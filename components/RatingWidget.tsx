"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type RatingWidgetProps = {
  tmdbId: number;
  mediaType: "MOVIE" | "TV_SHOW";
  onRatingChange?: () => void;
};

export default function RatingWidget({
  tmdbId,
  mediaType,
  onRatingChange,
}: RatingWidgetProps) {
  const [existingRating, setExistingRating] = useState<{
    id: number;
    score: number;
  } | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session } = useSession();
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "";

  useEffect(() => {
    if (!session) return;

    async function checkExisting() {
      const res = await fetch(`${apiBase}/api/ratings/me`, {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      const match = data.data?.find(
        (r: any) => r.media?.tmdbId === tmdbId && r.media?.type === mediaType,
      );
      if (match) {
        setExistingRating({ id: match.id, score: match.score });
        setSelectedRating(match.score);
      }
    }
    checkExisting();
  }, [session, tmdbId, mediaType]);

  async function handleSubmit() {
    if (!selectedRating) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (existingRating) {
        const res = await fetch(`${apiBase}/api/ratings/${existingRating.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify({ score: selectedRating }),
        });
        if (!res.ok) throw new Error("Failed to update rating");
        setExistingRating({ ...existingRating, score: selectedRating });
        setSuccess("Rating updated!");
        onRatingChange?.();
      } else {
        const res = await fetch(`${apiBase}/api/ratings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify({
            tmdbId,
            type: mediaType,
            score: selectedRating,
          }),
        });
        if (!res.ok) throw new Error("Failed to submit rating");
        const data = await res.json();
        setExistingRating({ id: data.id, score: selectedRating });
        setSuccess("Rating submitted!");
        onRatingChange?.();
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!existingRating) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${apiBase}/api/ratings/${existingRating.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete rating");
      setExistingRating(null);
      setSelectedRating(null);
      setSuccess("Rating removed.");
      onRatingChange?.();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <p>
        <a href="/api/auth/signin" style={{ color: "#2563eb" }}>Sign in</a> to rate
      </p>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <p
        style={{
          margin: "0 0 8px",
          fontWeight: 600,
          color: "#0f172a",
          fontSize: 15,
        }}
      >
        {existingRating ? "Your Rating" : "Rate This"}
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setSelectedRating(star)}
            aria-label={`Rate ${star} out of 5`}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 28,
              color:
                selectedRating !== null && star <= selectedRating
                  ? "#f59e0b"
                  : "#cbd5e1",
              padding: 0,
            }}
          >
            ★
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={loading || selectedRating === null}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: selectedRating === null ? "#e2e8f0" : "#2563eb",
            color: selectedRating === null ? "#94a3b8" : "#fff",
            border: "none",
            fontWeight: 600,
            cursor: selectedRating === null ? "not-allowed" : "pointer",
            fontSize: 13,
          }}
        >
          {loading ? "Saving..." : existingRating ? "Update" : "Submit"}
        </button>
        {existingRating && (
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              background: "#fff",
              color: "#dc2626",
              border: "1px solid #e2e8f0",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 13,
              opacity: loading ? 0.6 : 1,
            }}
          >
            Remove
          </button>
        )}
      </div>
      {success && (
        <p style={{ marginTop: 8, color: "#16a34a", fontSize: 13 }}>
          {success}
        </p>
      )}
      {error && (
        <div style={{ marginTop: 8, background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: 8, fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  );
}
