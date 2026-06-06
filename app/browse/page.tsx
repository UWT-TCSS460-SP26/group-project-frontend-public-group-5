import Link from "next/link";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://group-project-backend-group-4.onrender.com";

type MovieListItem = {
  id: number;
  title: string;
  overview: string;
  release_date: string | null;
  poster_path: string | null;
  backdrop_path?: string | null;
  original_language: string;
};

async function getPopularMovies(): Promise<MovieListItem[]> {
  const url = `${API_BASE}/api/movies/popular?language=en-US&page=1&sort_by=desc`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(
      `Failed to load popular movies from ${url}: ${res.status} ${res.statusText}`,
    );
  }

  return res.json();
}

function formatReleaseDate(releaseDate: string | null) {
  if (!releaseDate) return "Unknown";
  return new Date(releaseDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BrowsePage() {
  let movies: MovieListItem[] = [];
  let errorMessage: string | null = null;

  try {
    movies = await getPopularMovies();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage =
        "An unexpected error occurred while loading popular movies.";
    }
  }

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
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ margin: "8px 0 0", fontSize: "clamp(2rem, 4vw, 3rem)" }}>
            Popular Movies
          </h1>
          <p
            style={{
              marginTop: 12,
              maxWidth: 680,
              lineHeight: 1.7,
              color: "#555",
            }}
          >
            See what people are watching right now.
          </p>
        </div>

        {errorMessage ? (
          <div
            style={{
              padding: 20,
              background: "#ffe8e8",
              color: "#842029",
              borderRadius: 14,
              border: "1px solid #f5c2c7",
            }}
          >
            <strong>Unable to load browse content.</strong>
            <p style={{ margin: "8px 0 0" }}>{errorMessage}</p>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "#5c5c5c" }}>
              Confirm that the partner API base URL is set in{" "}
              <code>NEXT_PUBLIC_API_BASE_URL</code> or that the default local
              URL is accessible.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {movies.map((movie) => (
              <article
                key={movie.id}
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
                <a
                  href={`/movie/${movie.id}`}
                  style={{ display: "block", minHeight: 190, background: "#f3f4f6" }}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={`${movie.title} poster`}
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
                </a>
                <div
                  style={{
                    padding: 18,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "#2563eb",
                        fontSize: 12,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {movie.original_language.toUpperCase()} •{" "}
                      {formatReleaseDate(movie.release_date)}
                    </p>
                    <h2 style={{ margin: "10px 0 0", fontSize: 20 }}>
                      {movie.title}
                    </h2>
                  </div>
                  <p
                    style={{
                      marginTop: 12,
                      color: "#475569",
                      lineHeight: 1.65,
                      flex: 1,
                    }}
                  >
                    {movie.overview || "No description available."}
                  </p>
                  <div style={{ marginTop: 18 }}>
                    <a
                      href={`/movie/${movie.id}`}
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
                    </a>
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
