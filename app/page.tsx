"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BackdropItem = {
  backdrop_path: string | null;
};

export default function Home() {
  const [backdrops, setBackdrops] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBackdrops() {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_BASE_URL ??
          "https://group-project-backend-group-4.onrender.com";

        // Fetch popular movies and TV shows for backdrop images
        const [moviesRes, tvRes] = await Promise.all([
          fetch(`${API_BASE}/api/movies/popular?language=en-US&page=1`),
          fetch(`${API_BASE}/api/tv/popular?language=en-US&page=1`),
        ]);

        const movies: BackdropItem[] = moviesRes.ok ? await moviesRes.json() : [];
        const tvShows: BackdropItem[] = tvRes.ok ? await tvRes.json() : [];

        // Extract backdrop paths and filter out null values
        const allBackdrops = [...movies, ...tvShows]
          .map((item) => item.backdrop_path)
          .filter((path) => path !== null) as string[];

        // Take first 20 for a smooth loop
        setBackdrops(allBackdrops.slice(0, 20));
      } catch (error) {
        console.error("Failed to fetch backdrops:", error);
      }
    }

    fetchBackdrops();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "var(--text)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scrolling backdrop styles */}
      <style>{`
        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .backdrop-scroll {
          display: flex;
          animation: scroll-horizontal 60s linear infinite;
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          z-index: 0;
        }
        .backdrop-image {
          flex-shrink: 0;
          width: 20%;
          height: 100%;
          object-fit: cover;
          opacity: 0.5;
        }
      `}</style>

      {/* Scrolling backdrops */}
      <div className="backdrop-scroll">
        {backdrops.map((backdrop, idx) => (
          <img
            key={`scroll1-${idx}`}
            src={`https://image.tmdb.org/t/p/w1280${backdrop}`}
            alt={`backdrop-${idx}`}
            className="backdrop-image"
          />
        ))}
        {/* Duplicate for seamless loop */}
        {backdrops.map((backdrop, idx) => (
          <img
            key={`scroll2-${idx}`}
            src={`https://image.tmdb.org/t/p/w1280${backdrop}`}
            alt={`backdrop-loop-${idx}`}
            className="backdrop-image"
          />
        ))}
      </div>

      {/* Light overlay for text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(15, 23, 42, 0.35)",
          zIndex: 0,
        }}
      />

      {/* Centered content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: 700, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              color: "#60a5fa",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Group 5 Moving Rating System
          </p>
          <h1
            style={{
              margin: "16px 0 12px",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.05,
              color: "#fff",
            }}
          >
            Movies & TV Shows
          </h1>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 18,
              lineHeight: 1.75,
              color: "#e2e8f0",
            }}
          >
            Browse popular movies or search for a specific title.
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/browse">
              <button
                style={{
                  border: "none",
                  borderRadius: 9999,
                  padding: "13px 28px",
                  background: "#3b82f6",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
              >
                Browse popular movies
              </button>
            </Link>
            <Link href="/search">
              <button
                style={{
                  border: "none",
                  borderRadius: 9999,
                  padding: "13px 28px",
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
              >
                Search movies & TV
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
