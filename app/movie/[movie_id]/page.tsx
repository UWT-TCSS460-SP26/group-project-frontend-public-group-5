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
    recentReviews: {
      id: number;
      title: string;
      body: string;
      author: string;
      createdAt: string;
    }[];
  };
};

export default function MovieDetailPage() {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";

  const [recentReviews, setRecentReviews] = useState<
    MovieDetail["community"]["recentReviews"]
  >([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [userReview, setUserReview] = useState<{
    id: number;
    title: string | null;
    body: string;
  } | null>(null);
  const [editingReview, setEditingReview] = useState(false);
  const [editReviewTitle, setEditReviewTitle] = useState("");
  const [editReviewBody, setEditReviewBody] = useState("");
  const [updatingReview, setUpdatingReview] = useState(false);
  const [deletingReview, setDeletingReview] = useState(false);

  const loadMovie = useCallback(() => {
    fetch(`/api/movies/${movie_id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then(setMovie)
      .catch(() => setError("Failed to load movie details."));
  }, [movie_id]);

  useEffect(() => {
    loadMovie();
  }, [loadMovie]);

  useEffect(() => {
    if (movie) {
      setRecentReviews(movie.community.recentReviews || []);
    }
  }, [movie]);

  useEffect(() => {
    if (!session || !movie) return;
    const accessToken = (session as any).accessToken;
    if (!accessToken) return;
    fetch(`${apiBase}/api/reviews/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const match = data?.data?.find(
          (r: any) => r.media?.tmdbId === movie.id && r.media?.type === "MOVIE",
        );
        if (match) setUserReview({ id: match.id, title: match.title, body: match.body });
      })
      .catch(() => {});
  }, [session, movie]);

  async function handleSubmitReview() {
    if (!session) {
      setReviewError("Please sign in to submit a review.");
      return;
    }
    if (!reviewTitle.trim()) {
      setReviewError("Please provide a title for your review.");
      return;
    }

    if (!reviewBody.trim()) {
      setReviewError("Please write a review before submitting.");
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError(null);
      const accessToken = (session as any).accessToken;
      if (!accessToken) throw new Error("No access token available");

      const res = await fetch(`${apiBase}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          tmdbId: movie?.id,
          type: "MOVIE",
          title: reviewTitle,
          body: reviewBody,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      const created = await res.json();

      // Prepend to local reviews list
      setRecentReviews((r) => [created, ...r]);

      // Update movie counts if present
      if (movie) {
        setMovie({
          ...movie,
          community: {
            ...movie.community,
            totalReviews: movie.community.totalReviews + 1,
          },
        });
      }

      // Clear form
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
    if (!userReview) return;
    if (!editReviewBody.trim()) return;
    try {
      setUpdatingReview(true);
      const accessToken = (session as any).accessToken;
      const res = await fetch(`${apiBase}/api/reviews/${userReview.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
    if (!userReview) return;
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      setDeletingReview(true);
      const accessToken = (session as any).accessToken;
      const res = await fetch(`${apiBase}/api/reviews/${userReview.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setUserReview(null);
      if (movie) {
        setMovie({
          ...movie,
          community: {
            ...movie.community,
            totalReviews: movie.community.totalReviews - 1,
          },
        });
      }
    } catch (err: any) {
      setReviewError(err?.message || "Failed to delete review");
    } finally {
      setDeletingReview(false);
    }
  }

  if (error)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            padding: 20,
            background: "#ffe8e8",
            color: "#842029",
            borderRadius: 14,
            border: "1px solid #f5c2c7",
          }}
        >
          {error}
        </div>
      </main>
    );

  if (!movie)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#f8fafc",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p role="status" style={{ color: "#475569" }}>
          Loading...
        </p>
      </main>
    );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "0 0 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {/* Hero */}
        <div
          style={{ display: "flex", gap: 32, marginTop: 24, flexWrap: "wrap" }}
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              style={{
                width: 220,
                borderRadius: 16,
                boxShadow: "0 10px 40px rgba(15,23,42,0.15)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 220,
                height: 330,
                borderRadius: 16,
                background: "#e2e8f0",
                display: "grid",
                placeItems: "center",
                color: "#667085",
                flexShrink: 0,
              }}
            >
              No poster
            </div>
          )}

          <div style={{ flex: 1, minWidth: 240 }}>
            <p
              style={{
                margin: 0,
                color: "#2563eb",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Movie
            </p>
            <h1
              style={{
                margin: "8px 0 12px",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                lineHeight: 1.1,
                color: "#0f172a",
              }}
            >
              {movie.title}
            </h1>

            {/* Badges */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {movie.genres.map((g) => (
                <span
                  key={g.name}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 9999,
                    background: "#e0e7ff",
                    color: "#3730a3",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {g.name}
                </span>
              ))}
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 9999,
                  background: "#f1f5f9",
                  color: "#475569",
                  fontSize: 13,
                }}
              >
                {new Date(movie.release_date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {movie.budget > 0 && (
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 9999,
                    background: "#f1f5f9",
                    color: "#475569",
                    fontSize: 13,
                  }}
                >
                  Budget: ${movie.budget.toLocaleString()}
                </span>
              )}
            </div>

            <p
              style={{
                margin: 0,
                color: "#475569",
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Rating */}
        <RatingWidget
          tmdbId={movie.id}
          mediaType="MOVIE"
          onRatingChange={loadMovie}
        />

        {/* Community */}
        <div
          style={{
            marginTop: 40,
            borderTop: "1px solid #e2e8f0",
            paddingTop: 32,
          }}
        >
          <h2 style={{ margin: "0 0 20px", fontSize: 22, color: "#0f172a" }}>
            Community
          </h2>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 32,
            }}
          >
            {[
              {
                label: "Avg Rating",
                value:
                  movie.community.avgRating != null
                    ? movie.community.avgRating.toFixed(1)
                    : "—",
              },
              { label: "Total Ratings", value: movie.community.totalRatings },
              { label: "Total Reviews", value: movie.community.totalReviews },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  flex: "1 1 120px",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "16px 20px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {value}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 12,
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>

          <>
            {/* Review section */}
            <div style={{ marginBottom: 32 }}>
              {!session ? (
                <p>
                  <a href="/api/auth/signin" style={{ color: "#2563eb" }}>
                    Sign in
                  </a>{" "}
                  to write a review
                </p>
              ) : userReview ? (
                // User already has a review — show it with edit/delete
                <div
                  style={{
                    background: "#fff",
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Your Review
                  </p>
                  {editingReview ? (
                    <div>
                      <div style={{ marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          value={editReviewTitle}
                          onChange={(e) => setEditReviewTitle(e.target.value)}
                          style={{ width: "100%", padding: 8, border: "1px solid #e2e8f0", borderRadius: 8, boxSizing: "border-box" }}
                        />
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <textarea
                          placeholder="Write your review..."
                          value={editReviewBody}
                          onChange={(e) => setEditReviewBody(e.target.value)}
                          style={{ width: "100%", padding: 8, border: "1px solid #e2e8f0", borderRadius: 8, minHeight: 100, boxSizing: "border-box", fontFamily: "system-ui, sans-serif" }}
                        />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleUpdateReview}
                          disabled={updatingReview || !editReviewBody.trim()}
                          style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: updatingReview ? "not-allowed" : "pointer", opacity: updatingReview ? 0.6 : 1 }}
                        >
                          {updatingReview ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingReview(false)}
                          disabled={updatingReview}
                          style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, background: "#fff", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {userReview.title && (
                        <strong style={{ display: "block", marginBottom: 4, fontSize: 15, color: "#0f172a" }}>
                          {userReview.title}
                        </strong>
                      )}
                      <p style={{ margin: "0 0 12px", color: "#475569", lineHeight: 1.65 }}>
                        {userReview.body}
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setEditReviewTitle(userReview.title || "");
                            setEditReviewBody(userReview.body);
                            setEditingReview(true);
                          }}
                          style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#475569", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteReview}
                          disabled={deletingReview}
                          style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#dc2626", cursor: deletingReview ? "not-allowed" : "pointer", opacity: deletingReview ? 0.6 : 1 }}
                        >
                          {deletingReview ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                  {reviewError && (
                    <div style={{ marginTop: 8, background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: 8, fontSize: 13 }}>{reviewError}</div>
                  )}
                </div>
              ) : (
                // No review yet — show the submit form
                <div
                  style={{
                    background: "#fff",
                    padding: 16,
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      placeholder="Title"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      style={{ width: "100%", padding: 8, border: "1px solid #e2e8f0", borderRadius: 8, boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <textarea
                      placeholder="Write your review..."
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      style={{ width: "100%", padding: 8, border: "1px solid #e2e8f0", borderRadius: 8, minHeight: 100, fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                      style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: submittingReview ? "not-allowed" : "pointer", opacity: submittingReview ? 0.6 : 1 }}
                    >
                      {submittingReview ? "Posting..." : "Post Review"}
                    </button>
                    {reviewError && (
                      <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: 8, fontSize: 13 }}>{reviewError}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <h3 style={{ margin: "0 0 16px", fontSize: 17, color: "#0f172a" }}>
              Recent Reviews
            </h3>

            {recentReviews.length > 0 ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "18px 20px",
                      boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <strong style={{ fontSize: 15, color: "#0f172a" }}>
                        {review.title}
                      </strong>
                      <span style={{ fontSize: 13, color: "#64748b" }}>
                        {review.author} ·{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "10px 0 0",
                        color: "#475569",
                        lineHeight: 1.65,
                      }}
                    >
                      {review.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
                No reviews yet.
              </p>
            )}
          </>
        </div>
      </div>
    </main>
  );
}
