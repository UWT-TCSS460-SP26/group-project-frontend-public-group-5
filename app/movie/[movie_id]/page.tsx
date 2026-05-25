"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";

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

  useEffect(() => {
    fetch(`/api/movies/${movie_id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then(setMovie)
      .catch(() => setError("Failed to load movie details."));
  }, [movie_id]);

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
      {/* Top nav */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "12px 16px",
        }}
      >
        <AuthButton />
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px" }}>
        {/* Back link */}
        <Link
          href="/"
          style={{
            color: "#2563eb",
            fontSize: 14,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Home
        </Link>

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
                  borderRadius: 14,
                  padding: "16px 20px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
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

          {movie.community.recentReviews.length > 0 ? (
            <>
              <h3
                style={{ margin: "0 0 16px", fontSize: 17, color: "#0f172a" }}
              >
                Recent Reviews
              </h3>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {movie.community.recentReviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 14,
                      padding: "18px 20px",
                      boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
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
            </>
          ) : (
            <p style={{ color: "#94a3b8", fontStyle: "italic" }}>
              No reviews yet.
            </p>
          )}

          <p
            style={{
              marginTop: 24,
              color: "#94a3b8",
              fontStyle: "italic",
              fontSize: 14,
            }}
          >
            Sign in to rate
          </p>
        </div>
      </div>
    </main>
  );
}
