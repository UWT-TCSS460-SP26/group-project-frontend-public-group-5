"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

interface ReviewEntry {
  id: number;
  title: string | null;
  body: string;
  createdAt: string;
  user: { userId: number; username: string };
  media: { tmdbId: number; type: string; title: string | null };
}

interface ReviewsListProps {
  reviews: ReviewEntry[];
  onReviewsChange: (reviews: ReviewEntry[]) => void;
}

export default function ReviewsList({ reviews, onReviewsChange }: ReviewsListProps) {
  const { data: session } = useSession();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editBody, setEditBody] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const startEdit = (review: ReviewEntry) => {
    setEditingId(review.id);
    setEditTitle(review.title || "");
    setEditBody(review.body);
    setError(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditTitle(""); setEditBody(""); };

  const handleUpdate = async (reviewId: number) => {
    try {
      setUpdating(true);
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) throw new Error("No access token available");
      const response = await fetch(
        `https://group-project-backend-group-4.onrender.com/api/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle || null, body: editBody }),
        }
      );
      if (!response.ok) throw new Error("Failed to update review");
      onReviewsChange(reviews.map((r) => r.id === reviewId ? { ...r, title: editTitle || null, body: editBody } : r));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      setDeletingId(reviewId);
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) throw new Error("No access token available");
      const response = await fetch(
        `https://group-project-backend-group-4.onrender.com/api/reviews/${reviewId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!response.ok) throw new Error("Failed to delete review");
      onReviewsChange(reviews.filter((r) => r.id !== reviewId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-subtle)" }}>
        <p>You haven&apos;t written any reviews yet.</p>
        <Link href="/browse" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Start writing reviews
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div style={{ background: "var(--error-bg)", color: "var(--error-text)", padding: "16px", borderRadius: 8, marginBottom: "20px" }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-card)",
              padding: "20px",
              background: "var(--surface)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {/* Title + type badge — always visible */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--text)" }}>
                {review.media.title || "Unknown Title"}
              </h3>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  color: "var(--text-subtle)",
                  background: "var(--surface-2)",
                  padding: "4px 8px",
                  borderRadius: 4,
                }}
              >
                {review.media.type === "MOVIE" ? "Film" : "TV Show"}
              </span>
            </div>

            {editingId === review.id ? (
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: "4px", color: "var(--text-subtle)" }}>
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 14, boxSizing: "border-box", background: "var(--surface)", color: "var(--text)" }}
                    placeholder="Review title"
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: "4px", color: "var(--text-subtle)" }}>
                    Review
                  </label>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    style={{ width: "100%", padding: "8px", border: "1px solid var(--border)", borderRadius: 4, fontSize: 14, fontFamily: "system-ui, sans-serif", minHeight: 120, boxSizing: "border-box", background: "var(--surface)", color: "var(--text)" }}
                    placeholder="Write your review..."
                  />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleUpdate(review.id)}
                    disabled={updating}
                    style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 8, background: "var(--accent)", color: "var(--accent-text)", cursor: updating ? "not-allowed" : "pointer", opacity: updating ? 0.6 : 1 }}
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={updating}
                    style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)", color: "var(--text-muted)", cursor: updating ? "not-allowed" : "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  {review.title && (
                    <h4 style={{ margin: "0 0 8px 0", fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>
                      &ldquo;{review.title}&rdquo;
                    </h4>
                  )}
                  <p style={{ margin: "0 0 12px 0", fontSize: 14, lineHeight: 1.5, color: "var(--text-muted)" }}>
                    {review.body}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/${review.media.type === "MOVIE" ? "movie" : "tv"}/${review.media.tmdbId}`}
                      style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}
                    >
                      View {review.media.type === "MOVIE" ? "film" : "show"} →
                    </Link>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => startEdit(review)}
                    style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)", color: "var(--text-muted)", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    style={{ padding: "8px 14px", fontSize: 13, fontWeight: 600, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface)", color: "var(--danger)", cursor: deletingId === review.id ? "not-allowed" : "pointer", opacity: deletingId === review.id ? 0.6 : 1 }}
                  >
                    {deletingId === review.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
