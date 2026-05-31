"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

interface RatingEntry {
  id: number;
  score: number;
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

interface RatingsListProps {
  ratings: RatingEntry[];
  onRatingsChange: (ratings: RatingEntry[]) => void;
}

export default function RatingsList({
  ratings,
  onRatingsChange,
}: RatingsListProps) {
  const { data: session } = useSession();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (ratingId: number) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) {
      return;
    }

    try {
      setDeletingId(ratingId);
      const accessToken = (session as any)?.accessToken;

      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await fetch(
        `https://group-project-backend-group-4.onrender.com/api/ratings/${ratingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete rating");
      }

      // Remove from local state
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
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "#64748b",
        }}
      >
        <p>You haven't rated anything yet.</p>
        <Link href="/browse" style={{ color: "#2563eb", textDecoration: "none" }}>
          Start rating movies and TV shows
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
        {ratings.map((rating) => (
          <div
            key={rating.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "20px",
              background: "#fff",
            }}
          >
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
                    {rating.media.title || "Unknown Title"}
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
                    {rating.media.type === "MOVIE" ? "Film" : "TV Show"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    margin: "12px 0 0 0",
                  }}
                >
                  <div style={{ fontSize: 14, color: "#64748b" }}>
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {"★".repeat(rating.score)}
                    {"☆".repeat(10 - rating.score)}
                    <span
                      style={{
                        fontSize: 14,
                        color: "#64748b",
                        marginLeft: "8px",
                      }}
                    >
                      ({rating.score}/10)
                    </span>
                  </div>
                </div>

                <Link
                  href={`/${rating.media.type === "MOVIE" ? "movie" : "tv"}/${rating.media.tmdbId}`}
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    fontSize: 12,
                    color: "#2563eb",
                    textDecoration: "none",
                  }}
                >
                  View {rating.media.type === "MOVIE" ? "film" : "show"} →
                </Link>
              </div>

              <button
                onClick={() => handleDelete(rating.id)}
                disabled={deletingId === rating.id}
                style={{
                  padding: "8px 12px",
                  fontSize: 12,
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                  background: "#fff",
                  color: "#dc2626",
                  cursor: deletingId === rating.id ? "not-allowed" : "pointer",
                  opacity: deletingId === rating.id ? 0.6 : 1,
                }}
              >
                {deletingId === rating.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
