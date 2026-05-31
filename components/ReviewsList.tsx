"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

interface ReviewEntry {
  id: number;
  title: string | null;
  body: string;
  createdAt: string;
  user: {
    userId: number;
    username: string;
  };
  media: {
    tmdbId: number;
    type: string;
    title: string | null;
  };
}

interface ReviewsListProps {
  reviews: ReviewEntry[];
  onReviewsChange: (reviews: ReviewEntry[]) => void;
}

export default function ReviewsList({
  reviews,
  onReviewsChange,
}: ReviewsListProps) {
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

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditBody("");
  };

  const handleUpdate = async (reviewId: number) => {
    try {
      setUpdating(true);
      const accessToken = (session as any)?.accessToken;

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await fetch(
        `https://group-project-backend-group-4.onrender.com/api/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editTitle || null,
            body: editBody,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      // Update local state
      const updatedReviews = reviews.map((r) =>
        r.id === reviewId
          ? { ...r, title: editTitle || null, body: editBody }
          : r
      );
      onReviewsChange(updatedReviews);
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update review");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      setDeletingId(reviewId);
      const accessToken = (session as any)?.accessToken;

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await fetch(
        `https://group-project-backend-group-4.onrender.com/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Remove from local state
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
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#64748b",
        }}
      >
        <p>You haven't written any reviews yet.</p>
        <Link href="/browse" style={{ color: "#2563eb", textDecoration: "none" }}>
          Start writing reviews
        </Link>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "16px",
            borderRadius: 8,
            marginBottom: "20px",
          }}
        >
          Error: {error}
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {reviews.map((review) => (
          <div
            key={review.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "20px",
              background: "#fff",
            }}
          >
            {editingId === review.id ? (
              // Edit mode
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: "4px",
                      color: "#64748b",
                    }}
                  >
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 4,
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="Review title"
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: "4px",
                      color: "#64748b",
                    }}
                  >
                    Review
                  </label>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #e2e8f0",
                      borderRadius: 4,
                      fontSize: 14,
                      fontFamily: "system-ui, sans-serif",
                      minHeight: 120,
                      boxSizing: "border-box",
                    }}
                    placeholder="Write your review..."
                  />
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleUpdate(review.id)}
                    disabled={updating}
                    style={{
                      padding: "8px 16px",
                      fontSize: 12,
                      border: "none",
                      borderRadius: 4,
                      background: "#2563eb",
                      color: "#fff",
                      cursor: updating ? "not-allowed" : "pointer",
                      opacity: updating ? 0.6 : 1,
                    }}
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={updating}
                    style={{
                      padding: "8px 16px",
                      fontSize: 12,
                      border: "1px solid #e2e8f0",
                      borderRadius: 4,
                      background: "#fff",
                      color: "#64748b",
                      cursor: updating ? "not-allowed" : "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: "16px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {review.media.title || "Unknown Title"}
                      </h3>
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: 12,
                          color: "#64748b",
                          background: "#f1f5f9",
                          padding: "4px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {review.media.type === "MOVIE" ? "Film" : "TV Show"}
                      </span>
                    </div>

                    {review.title && (
                      <h4
                        style={{
                          margin: "8px 0 0 0",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#475569",
                        }}
                      >
                        "{review.title}"
                      </h4>
                    )}

                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "#334155",
                      }}
                    >
                      {review.body}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        margin: "12px 0 0 0",
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                      <Link
                        href={`/${
                          review.media.type === "MOVIE" ? "movie" : "tv"
                        }/${review.media.tmdbId}`}
                        style={{
                          fontSize: 12,
                          color: "#2563eb",
                          textDecoration: "none",
                        }}
                      >
                        View {review.media.type === "MOVIE" ? "film" : "show"} →
                      </Link>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button
                      onClick={() => startEdit(review)}
                      style={{
                        padding: "8px 12px",
                        fontSize: 12,
                        border: "1px solid #e2e8f0",
                        borderRadius: 4,
                        background: "#fff",
                        color: "#2563eb",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                      style={{
                        padding: "8px 12px",
                        fontSize: 12,
                        border: "1px solid #e2e8f0",
                        borderRadius: 4,
                        background: "#fff",
                        color: "#dc2626",
                        cursor: deletingId === review.id ? "not-allowed" : "pointer",
                        opacity: deletingId === review.id ? 0.6 : 1,
                      }}
                    >
                      {deletingId === review.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
