"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  release_date?: string | null;
  first_air_date?: string | null;
  poster_path: string | null;
  overview?: string;
};

function TrendingCarousel({
  items,
  label,
  linkPrefix,
}: {
  items: MediaItem[];
  label: string;
  linkPrefix: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 3000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[index];
  const title = item.title ?? item.name ?? "Untitled";
  const date = item.release_date ?? item.first_air_date ?? null;

  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 0 3px rgba(239,68,68,0.2)",
            }}
          />
          {label}
        </h2>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>
          {index + 1} / {items.length}
        </span>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(15,23,42,0.08)",
          overflow: "hidden",
          display: "flex",
          minHeight: 200,
          transition: "opacity 0.4s",
        }}
      >
        <Link
          href={`/${linkPrefix}/${item.id}`}
          style={{ flexShrink: 0, width: 140, background: "#f3f4f6", display: "block" }}
        >
          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={`${title} poster`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", cursor: "pointer" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center",
                color: "#94a3b8",
                fontSize: 12,
                textAlign: "center",
                padding: 8,
              }}
            >
              No poster
            </div>
          )}
        </Link>

        <div
          style={{
            padding: "20px 24px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {date && (
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: 12,
                  color: "#2563eb",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {new Date(date).getFullYear()}
              </p>
            )}
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
                fontWeight: 700,
                color: "#0f172a",
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>
            {item.overview && (
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: 14,
                  lineHeight: 1.65,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.overview}
              </p>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Link
              href={`/${linkPrefix}/${item.id}`}
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: 9999,
                background: "#2563eb",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              View details
            </Link>

            <div style={{ display: "flex", gap: 6 }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to item ${i + 1}`}
                  style={{
                    width: i === index ? 20 : 8,
                    height: 8,
                    borderRadius: 9999,
                    border: "none",
                    background: i === index ? "#2563eb" : "#cbd5e1",
                    cursor: "pointer",
                    padding: 0,
                    transition: "width 0.3s, background 0.3s",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [mediaType, setMediaType] = useState<"MOVIE" | "TV">("MOVIE");
  const [results, setResults] = useState<
    { id: number; title: string; release_date: string; poster_path: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTV, setTrendingTV] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetch("/api/movies/popular?language=en-US&page=1&sort_by=desc")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setTrendingMovies(Array.isArray(data) ? data.slice(0, 10) : [])
      )
      .catch(() => {});

    fetch("/api/tv/popular?language=en-US&page=1&sort_by=desc")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setTrendingTV(Array.isArray(data) ? data.slice(0, 10) : [])
      )
      .catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!searchText) return;
    try {
      setIsLoading(true);
      const url =
        mediaType === "MOVIE"
          ? `/api/movies/search?title=${searchText.replace(/ /g, "+")}`
          : `/api/tv/search?title=${searchText.replace(/ /g, "+")}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setResults(data.results);
      setError(null);
    } catch {
      setError("An error occurred while fetching data.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showTrending = results.length === 0 && !isLoading && !error;

  return (
    <main
      style={{
        padding: "0 0 24px",
        fontFamily: "system-ui, sans-serif",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: "8px 0 0", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Find Movies & TV Shows
          </h1>
          <p
            style={{
              marginTop: 12,
              maxWidth: 680,
              lineHeight: 1.7,
              color: "#555",
            }}
          >
            Search by title and filter by type to find what you&apos;re looking for.
          </p>
        </div>

        {/* Search controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <input
            type="text"
            placeholder="Search for a title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            style={{
              flex: "1 1 260px",
              padding: "12px 16px",
              fontSize: 15,
              border: "1px solid #e2e8f0",
              borderRadius: 9999,
              outline: "none",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(15,23,42,0.06)",
            }}
          />
          <button
            onClick={() => setMediaType("MOVIE")}
            aria-pressed={mediaType === "MOVIE"}
            style={{
              padding: "10px 20px",
              borderRadius: 9999,
              border: mediaType === "MOVIE" ? "none" : "1px solid #e2e8f0",
              background: mediaType === "MOVIE" ? "#2563eb" : "#fff",
              color: mediaType === "MOVIE" ? "#fff" : "#0f172a",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Movies
          </button>
          <button
            onClick={() => setMediaType("TV")}
            aria-pressed={mediaType === "TV"}
            style={{
              padding: "10px 20px",
              borderRadius: 9999,
              border: mediaType === "TV" ? "none" : "1px solid #e2e8f0",
              background: mediaType === "TV" ? "#2563eb" : "#fff",
              color: mediaType === "TV" ? "#fff" : "#0f172a",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            TV Shows
          </button>
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              borderRadius: 9999,
              border: "none",
              background: "#0f172a",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {/* States */}
        {isLoading && (
          <p role="status" style={{ color: "#475569" }}>
            Loading...
          </p>
        )}
        {error && (
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
        )}

        {/* Trending carousels — shown before any search */}
        {showTrending && (
          <>
            <TrendingCarousel
              items={trendingMovies}
              label="Trending Movies"
              linkPrefix="movie"
            />
            <TrendingCarousel
              items={trendingTV}
              label="Trending TV Shows"
              linkPrefix="tv"
            />
          </>
        )}

        {/* Results grid */}
        {results.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {results.map((item) => (
              <article
                key={item.id}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  boxShadow: "0 4px 16px rgba(15,23,42,0.07)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 420,
                }}
              >
                <Link
                  href={`/${mediaType.toLowerCase()}/${item.id}`}
                  style={{ display: "block", minHeight: 190, background: "#f3f4f6" }}
                >
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={`${item.title} poster`}
                      style={{ width: "100%", height: 190, objectFit: "cover", display: "block", cursor: "pointer" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 190,
                        display: "grid",
                        placeItems: "center",
                        color: "#667085",
                        background: "#e2e8f0",
                      }}
                    >
                      No poster available
                    </div>
                  )}
                </Link>
                <div
                  style={{
                    padding: 18,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#2563eb",
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {mediaType} • {item.release_date ?? "Unknown"}
                  </p>
                  <h2 style={{ margin: "10px 0 0", fontSize: 20, flex: 1 }}>
                    {item.title}
                  </h2>
                  <div style={{ marginTop: 18 }}>
                    <Link
                      href={`/${mediaType.toLowerCase()}/${item.id}`}
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        borderRadius: 9999,
                        background: "#2563eb",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
