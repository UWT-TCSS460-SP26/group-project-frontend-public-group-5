"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import styles from "./page.module.css";

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
  const [fading, setFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoPlay = (itemCount: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % itemCount);
    }, 3000);
  };

  useEffect(() => {
    if (items.length === 0) return;
    startAutoPlay(items.length);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, [items.length]);

  const navigate = (newIndex: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => startAutoPlay(items.length), 15000);

    setFading(true);
    setTimeout(() => {
      setIndex(newIndex);
      setFading(false);
    }, 180);
  };

  if (items.length === 0) return null;

  const item = items[index];
  const title = item.title ?? item.name ?? "Untitled";
  const date = item.release_date ?? item.first_air_date ?? null;

  const arrowBtn = (disabled: boolean, onClick: () => void, ariaLabel: string, symbol: string) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: disabled ? "transparent" : "var(--surface)",
        boxShadow: disabled ? "none" : "var(--shadow-sm)",
        color: disabled ? "var(--text-faint)" : "var(--text)",
        fontSize: 20,
        lineHeight: 1,
        cursor: disabled ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        ...(symbol === "‹" ? { left: 0 } : { right: 0 }),
      }}
    >
      {symbol}
    </button>
  );

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
            color: "var(--text)",
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
              background: "var(--danger)",
              boxShadow: "var(--shadow-hero)",
            }}
          />
          {label}
        </h2>
        <span style={{ fontSize: 13, color: "var(--text-faint)" }}>
          {index + 1} / {items.length}
        </span>
      </div>

      <div className={styles.carouselWrapper}>
        {arrowBtn(index === 0, () => navigate(index - 1), "Previous", "‹")}
        {arrowBtn(index === items.length - 1, () => navigate(index + 1), "Next", "›")}

        <Link
          href={`/${linkPrefix}/${item.id}`}
          className={styles.card}
          style={{
            background: "var(--surface)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-xl)",
            overflow: "hidden",
            display: "flex",
            minHeight: 200,
            opacity: fading ? 0 : 1,
            transition: "opacity 0.18s ease, transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <div style={{ flexShrink: 0, width: 140, background: "var(--surface-2)", display: "block" }}>
            {item.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={`${title} poster`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--text-faint)",
                  fontSize: 12,
                  textAlign: "center",
                  padding: 8,
                }}
              >
                No poster
              </div>
            )}
          </div>

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
                    color: "var(--accent)",
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
                  color: "var(--text)",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>
              {item.overview && (
                <p
                  style={{
                    margin: 0,
                    color: "var(--text-muted)",
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
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  borderRadius: 9999,
                  background: "var(--accent)",
                  color: "var(--accent-text)",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                View details
              </span>

              <div style={{ display: "flex", gap: 6 }}>
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setIndex(i); }}
                    aria-label={`Go to item ${i + 1}`}
                    style={{
                      width: i === index ? 20 : 8,
                      height: 8,
                      borderRadius: 9999,
                      border: "none",
                      background: i === index ? "var(--accent)" : "var(--border)",
                      cursor: "pointer",
                      padding: 0,
                      transition: "width 0.3s, background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>{/* end card + arrows wrapper */}
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

  // Extracted search logic — stable reference via useCallback
  const performSearch = useCallback(async (text: string, type: "MOVIE" | "TV") => {
    if (!text.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    try {
      setIsLoading(true);
      const url =
        type === "MOVIE"
          ? `/api/movies/search?title=${text.replace(/ /g, "+")}`
          : `/api/tv/search?title=${text.replace(/ /g, "+")}`;
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
  }, []);

  // Live search — debounce 300 ms so the API is not called on every keystroke
  useEffect(() => {
    if (!searchText.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    const timer = setTimeout(() => performSearch(searchText, mediaType), 300);
    return () => clearTimeout(timer);
  }, [searchText, mediaType, performSearch]);

  const handleSearch = () => performSearch(searchText, mediaType);

  const showTrending = results.length === 0 && !isLoading && !error && !searchText.trim();
  const showNoResults = !isLoading && !error && searchText.trim().length > 0 && results.length === 0;

  return (
    <main
      style={{
        padding: "0 0 24px",
        fontFamily: "system-ui, sans-serif",
        background: "var(--bg)",
        minHeight: "100vh",
      }}
    >
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: "8px 0 0", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text)" }}>
            Find Movies & TV Shows
          </h1>
          <p
            style={{
              marginTop: 12,
              maxWidth: 680,
              lineHeight: 1.7,
              color: "var(--text-muted)",
            }}
          >
            Type to instantly filter results — or hit Search for a full lookup.
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
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            style={{
              flex: "1 1 260px",
              padding: "12px 16px",
              fontSize: 15,
              border: "1px solid var(--border)",
              borderRadius: 9999,
              outline: "none",
              background: "var(--surface)",
              color: "var(--text)",
              boxShadow: "var(--shadow-sm)",
            }}
          />
          <button
            onClick={() => setMediaType("MOVIE")}
            aria-pressed={mediaType === "MOVIE"}
            style={{
              padding: "10px 20px",
              borderRadius: 9999,
              border: mediaType === "MOVIE" ? "none" : "1px solid var(--border)",
              background: mediaType === "MOVIE" ? "var(--accent)" : "var(--surface)",
              color: mediaType === "MOVIE" ? "var(--accent-text)" : "var(--text)",
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
              border: mediaType === "TV" ? "none" : "1px solid var(--border)",
              background: mediaType === "TV" ? "var(--accent)" : "var(--surface)",
              color: mediaType === "TV" ? "var(--accent-text)" : "var(--text)",
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
              background: "var(--accent)",
              color: "var(--accent-text)",
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
          <p role="status" style={{ color: "var(--text-muted)" }}>
            Loading...
          </p>
        )}
        {error && (
          <div
            style={{
              padding: 20,
              background: "var(--error-bg-alt)",
              color: "var(--error-text-alt)",
              borderRadius: 14,
              border: "1px solid var(--error-border)",
            }}
          >
            {error}
          </div>
        )}

        {/* No results empty state */}
        {showNoResults && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "var(--text-subtle)",
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", color: "var(--text-muted)" }}>
              No results found for &ldquo;{searchText}&rdquo;
            </p>
            <p style={{ fontSize: 14, margin: 0 }}>
              Try a different title or switch between Movies and TV Shows.
            </p>
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
              <Link
                key={item.id}
                href={`/${mediaType.toLowerCase()}/${item.id}`}
                className={styles.card}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 420,
                }}
              >
                <div style={{ display: "block", minHeight: 190, background: "var(--surface-2)" }}>
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={`${item.title} poster`}
                      style={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: 190,
                        display: "grid",
                        placeItems: "center",
                        color: "var(--text-faint)",
                        background: "var(--border)",
                      }}
                    >
                      No poster available
                    </div>
                  )}
                </div>
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
                      color: "var(--accent)",
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {mediaType} • {item.release_date ?? "Unknown"}
                  </p>
                  <h2 style={{ margin: "10px 0 0", fontSize: 20, flex: 1, color: "var(--text)" }}>
                    {item.title}
                  </h2>
                  <div style={{ marginTop: 18 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        borderRadius: 9999,
                        background: "var(--accent)",
                        color: "var(--accent-text)",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      View details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
