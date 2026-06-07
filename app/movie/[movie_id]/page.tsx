"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RatingWidget from "@/components/RatingWidget";

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  budget: number;
  genres: { name: string }[];
  community: {
    avgRating: number | null;
    totalRatings: number;
    totalReviews: number;
    recentReviews: { id: number; title: string; body: string; author: string; createdAt: string }[];
  };
};

export default function MovieDetailPage() {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

  const [recentReviews, setRecentReviews] = useState<MovieDetail["community"]["recentReviews"]>([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [userReview, setUserReview] = useState<{ id: number; title: string | null; body: string } | null>(null);
  const [editingReview, setEditingReview] = useState(false);
  const [editReviewTitle, setEditReviewTitle] = useState("");
  const [editReviewBody, setEditReviewBody] = useState("");
  const [updatingReview, setUpdatingReview] = useState(false);
  const [deletingReview, setDeletingReview] = useState(false);

  const loadMovie = useCallback(() => {
    fetch(`/api/movies/${movie_id}`)
      .then((r) => { if (!r.ok) throw new Error(`Server returned ${r.status}`); return r.json(); })
      .then(setMovie)
      .catch(() => setError("Failed to load movie details."));
  }, [movie_id]);

  useEffect(() => { loadMovie(); }, [loadMovie]);
  useEffect(() => { if (movie) setRecentReviews(movie.community.recentReviews || []); }, [movie]);
  useEffect(() => {
    if (!session || !movie) return;
    const accessToken = (session as any).accessToken;
    if (!accessToken) return;
    fetch(`${apiBase}/api/reviews/me`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const match = data?.data?.find((r: any) => r.media?.tmdbId === movie.id && r.media?.type === "MOVIE");
        if (match) setUserReview({ id: match.id, title: match.title, body: match.body });
      })
      .catch(() => {});
  }, [session, movie]);

  async function handleSubmitReview() {
    if (!session) { setReviewError("Please sign in to submit a review."); return; }
    if (!reviewTitle.trim()) { setReviewError("Please provide a title for your review."); return; }
    if (!reviewBody.trim()) { setReviewError("Please write a review before submitting."); return; }
    try {
      setSubmittingReview(true);
      setReviewError(null);
      const accessToken = (session as any).accessToken;
      if (!accessToken) throw new Error("No access token available");
      const res = await fetch(`${apiBase}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ tmdbId: movie?.id, type: "MOVIE", title: reviewTitle, body: reviewBody }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      const created = await res.json();
      setRecentReviews((r) => [created, ...r]);
      if (movie) setMovie({ ...movie, community: { ...movie.community, totalReviews: movie.community.totalReviews + 1 } });
      setReviewTitle("");
      setReviewBody("");
      setUserReview({ id: created.id, title: reviewTitle, body: reviewBody });
    } catch (err: any) {
      setReviewError(err?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleUpdateReview() {
    if (!userReview || !editReviewBody.trim()) return;
    try {
      setUpdatingReview(true);
      const accessToken = (session as any).accessToken;
      const res = await fetch(`${apiBase}/api/reviews/${userReview.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ title: editReviewTitle || null, body: editReviewBody }),
      });
      if (!res.ok) throw new Error("Failed to update review");
      setUserReview({ ...userReview, title: editReviewTitle || null, body: editReviewBody });
      setEditingReview(false);
    } catch (err: any) {
      setReviewError(err?.message || "Failed to update review");
    } finally {
      setUpdatingReview(false);
    }
  }

  async function handleDeleteReview() {
    if (!userReview || !window.confirm("Are you sure you want to delete your review?")) return;
    try {
      setDeletingReview(true);
      const accessToken = (session as any).accessToken;
      const res = await fetch(`${apiBase}/api/reviews/${userReview.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setUserReview(null);
      if (movie) setMovie({ ...movie, community: { ...movie.community, totalReviews: movie.community.totalReviews - 1 } });
    } catch (err: any) {
      setReviewError(err?.message || "Failed to delete review");
    } finally {
      setDeletingReview(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: 8, border: "1px solid var(--border)", borderRadius: 8,
    boxSizing: "border-box", background: "var(--surface)", color: "var(--text)",
  };
  const cardStyle: React.CSSProperties = {
    background: "var(--surface)", padding: 16, borderRadius: "var(--radius-card)",
    border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)",
  };
  const btnSecondary: React.CSSProperties = {
    padding: "8px 14px", fontSize: 13, fontWeight: 600, border: "1px solid var(--border)",
    borderRadius: 8, background: "var(--surface)", color: "var(--text-muted)", cursor: "pointer",
  };

  if (error)
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ padding: 20, background: "var(--error-bg-alt)", color: "var(--error-text-alt)", borderRadius: 14, border: "1px solid var(--error-border)" }}>
          {error}
        </div>
      </main>
    );

  if (!movie)
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
        <p role="status" style={{ color: "var(--text-muted)" }}>Loading...</p>
      </main>
    );

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "0 0 24px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {/* Hero */}
        <div style={{ display: "flex", gap: 32, marginTop: 24, flexWrap: "wrap" }}>
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              style={{ width: 220, borderRadius: 16, boxShadow: "var(--shadow-lg)", flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 220, height: 330, borderRadius: 16, background: "var(--border)", display: "grid", placeItems: "center", color: "var(--text-faint)", flexShrink: 0 }}>
              No poster
            </div>
          )}

          <div style={{ flex: 1, minWidth: 240 }}>
            <p style={{ margin: 0, color: "var(--accent)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em" }}>Movie</p>
            <h1 style={{ margin: "8px 0 12px", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.1, color: "var(--text)" }}>
              {movie.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {movie.genres.map((g) => (
                <span key={g.name} style={{ padding: "4px 12px", borderRadius: 9999, background: "var(--genre-bg)", color: "var(--genre-text)", fontSize: 13, fontWeight: 600 }}>
                  {g.name}
                </span>
              ))}
              <span style={{ padding: "4px 12px", borderRadius: 9999, background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 13 }}>
                {new Date(movie.release_date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              </span>
              {movie.budget > 0 && (
                <span style={{ padding: "4px 12px", borderRadius: 9999, background: "var(--surface-2)", color: "var(--text-muted)", fontSize: 13 }}>
                  Budget: ${movie.budget.toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.75, fontSize: 15 }}>{movie.overview}</p>
          </div>
        </div>

        <RatingWidget tmdbId={movie.id} mediaType="MOVIE" onRatingChange={loadMovie} />

        {/* Community */}
        <div style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 32 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: 22, color: "var(--text)" }}>Community</h2>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
            {[
              { label: "Avg Rating", value: movie.community.avgRating != null ? movie.community.avgRating.toFixed(1) : "—" },
              { label: "Total Ratings", value: movie.community.totalRatings },
              { label: "Total Reviews", value: movie.community.totalReviews },
            ].map(({ label, value }) => (
              <div key={label} style={{ flex: "1 1 120px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: "16px 20px", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{value}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Review section */}
          <div style={{ marginBottom: 32 }}>
            {!session ? (
              <p>
                <a href="/api/auth/signin" style={{ color: "var(--accent)" }}>Sign in</a> to write a review
              </p>
            ) : userReview ? (
              <div style={cardStyle}>
                <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Review</p>
                {editingReview ? (
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <input type="text" placeholder="Title (optional)" value={editReviewTitle} onChange={(e) => setEditReviewTitle(e.target.value)} style={inputStyle} />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <textarea placeholder="Write your review..." value={editReviewBody} onChange={(e) => setEditReviewBody(e.target.value)} style={{ ...inputStyle, minHeight: 100, fontFamily: "system-ui, sans-serif" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={handleUpdateReview} disabled={updatingReview || !editReviewBody.trim()} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, background: "var(--accent)", color: "var(--accent-text)", border: "none", borderRadius: 8, cursor: updatingReview ? "not-allowed" : "pointer", opacity: updatingReview ? 0.6 : 1 }}>
                        {updatingReview ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => setEditingReview(false)} disabled={updatingReview} style={btnSecondary}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {userReview.title && <strong style={{ display: "block", marginBottom: 4, fontSize: 15, color: "var(--text)" }}>{userReview.title}</strong>}
                    <p style={{ margin: "0 0 12px", color: "var(--text-muted)", lineHeight: 1.65 }}>{userReview.body}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setEditReviewTitle(userReview.title || ""); setEditReviewBody(userReview.body); setEditingReview(true); }} style={btnSecondary}>Edit</button>
                      <button onClick={handleDeleteReview} disabled={deletingReview} style={{ ...btnSecondary, color: "var(--danger)", cursor: deletingReview ? "not-allowed" : "pointer", opacity: deletingReview ? 0.6 : 1 }}>
                        {deletingReview ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
                {reviewError && <div style={{ marginTop: 8, background: "var(--error-bg)", color: "var(--error-text)", padding: "12px 16px", borderRadius: 8, fontSize: 13 }}>{reviewError}</div>}
              </div>
            ) : (
              <div style={cardStyle}>
                <div style={{ marginBottom: 8 }}>
                  <input type="text" placeholder="Title" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <textarea placeholder="Write your review..." value={reviewBody} onChange={(e) => setReviewBody(e.target.value)} style={{ ...inputStyle, minHeight: 100, fontFamily: "system-ui, sans-serif" }} />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button onClick={handleSubmitReview} disabled={submittingReview} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, background: "var(--accent)", color: "var(--accent-text)", border: "none", borderRadius: 8, cursor: submittingReview ? "not-allowed" : "pointer", opacity: submittingReview ? 0.6 : 1 }}>
                    {submittingReview ? "Posting..." : "Post Review"}
                  </button>
                  {reviewError && <div style={{ background: "var(--error-bg)", color: "var(--error-text)", padding: "12px 16px", borderRadius: 8, fontSize: 13 }}>{reviewError}</div>}
                </div>
              </div>
            )}
          </div>

          <h3 style={{ margin: "0 0 16px", fontSize: 17, color: "var(--text)" }}>Recent Reviews</h3>
          {recentReviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {recentReviews.map((review) => (
                <div key={review.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", padding: "18px 20px", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
                    <strong style={{ fontSize: 15, color: "var(--text)" }}>{review.title}</strong>
                    <span style={{ fontSize: 13, color: "var(--text-subtle)" }}>{review.author} · {new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: "10px 0 0", color: "var(--text-muted)", lineHeight: 1.65 }}>{review.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-faint)", fontStyle: "italic" }}>No reviews yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
