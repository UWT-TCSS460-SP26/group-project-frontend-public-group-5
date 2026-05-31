"use client";
import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [mediaType, setMediaType] = useState<"MOVIE" | "TV">("MOVIE");
  const [results, setResults] = useState<
    { id: number; title: string; release_date: string; poster_path: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            Search by title and filter by type to find what you're looking for.
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
              padding: "12px 20px",
              borderRadius: 9999,
              border: "1px solid #e2e8f0",
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
              padding: "12px 20px",
              borderRadius: 9999,
              border: "1px solid #e2e8f0",
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
              padding: "12px 24px",
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
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 420,
                }}
              >
                <div style={{ minHeight: 190, background: "#f3f4f6" }}>
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={`${item.title} poster`}
                      style={{ width: "100%", height: 190, objectFit: "cover" }}
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
                        padding: "10px 16px",
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
