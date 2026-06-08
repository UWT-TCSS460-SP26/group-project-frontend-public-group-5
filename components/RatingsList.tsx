"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

interface RatingEntry {
  id: number;
  score: number;
  createdAt: string;
  user: { userId: number; username: string };
  media: { tmdbId: number; type: string; title: string | null };
}

interface RatingsListProps {
  ratings: RatingEntry[];
  onRatingsChange: (ratings: RatingEntry[]) => void;
}

export default function RatingsList({ ratings, onRatingsChange }: RatingsListProps) {
  const { data: session } = useSession();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startEdit = (rating: RatingEntry) => {
    setEditingId(rating.id);
    setEditScore(rating.score);
    setError(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditScore(0); };

  const handleUpdate = async (ratingId: number) => {
    try {
      setUpdating(true);
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) throw new Error("No access token available");
      const response = await fetch(
        `https://group-project-backend-group-4.onrender.com/api/ratings/${ratingId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ score: editScore }),
        },
      );
      if (!response.ok) throw new Error("Failed to update rating");
      onRatingsChange(ratings.map((r) => (r.id === ratingId ? { ...r, score: editScore } : r)));
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update rating");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (ratingId: number) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    try {
      setDeletingId(ratingId);
      const accessToken = (session as any)?.accessToken;
      if (!accessToken) throw new Error("No access token available");
      const response = await fetch(
        `https://group-project-backend-group-4.onrender.com/api/ratings/${ratingId}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!response.ok) throw new Error("Failed to delete rating");
      onRatingsChange(ratings.filter((r) => r.id !== ratingId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete rating");
    } finally {
      setDeletingId(null);
    }
  };

  if (ratings.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-subtle)" }}>
        <p>You haven&apos;t rated anything yet.</p>
        <Link href="/browse" style={{ color: "var(--accent)", textDecoration: "none" }}>
          Start rating movies and TV shows
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
        {ratings.map((rating) => (
          <div
            key={rating.id}
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
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--text)", flex: 1, minWidth: 0 }}>
                {rating.media.title || "Unknown Title"}
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
                {rating.media.type === "MOVIE" ? "Film" : "TV Show"}
              </span>
            </div>

            {editingId === rating.id ? (
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setEditScore(star)}
                      aria-label={`Rate ${star} out of 5`}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 28,
                        color: star <= editScore ? "var(--star)" : "var(--star-empty)",
                        padding: 0,
                        minWidth: 44,
                        minHeight: 44,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleUpdate(rating.id)}
                    disabled={updating || editScore === 0}
                    style={{
                      padding: "12px 18px",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 8,
                      background: editScore === 0 ? "var(--border)" : "var(--accent)",
                      color: editScore === 0 ? "var(--text-faint)" : "var(--accent-text)",
                      cursor: updating || editScore === 0 ? "not-allowed" : "pointer",
                      opacity: updating ? 0.6 : 1,
                    }}
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={updating}
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--surface)",
                      color: "var(--text-muted)",
                      cursor: updating ? "not-allowed" : "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  {/* Star rating */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: 12 }}>
                    <span style={{ fontSize: 18, color: "var(--star)" }}>
                      {"★".repeat(Math.min(Math.max(rating.score, 0), 5))}
                      {"☆".repeat(5 - Math.min(Math.max(rating.score, 0), 5))}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-subtle)", marginLeft: 6 }}>
                      ({rating.score}/5)
                    </span>
                  </div>
                  {/* Footer: date + view link */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/${rating.media.type === "MOVIE" ? "movie" : "tv"}/${rating.media.tmdbId}`}
                      style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}
                    >
                      View {rating.media.type === "MOVIE" ? "film" : "show"} →
                    </Link>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => startEdit(rating)}
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--surface)",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(rating.id)}
                    disabled={deletingId === rating.id}
                    style={{
                      padding: "12px 14px",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--surface)",
                      color: "var(--danger)",
                      cursor: deletingId === rating.id ? "not-allowed" : "pointer",
                      opacity: deletingId === rating.id ? 0.6 : 1,
                    }}
                  >
                    {deletingId === rating.id ? "Deleting..." : "Delete"}
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
