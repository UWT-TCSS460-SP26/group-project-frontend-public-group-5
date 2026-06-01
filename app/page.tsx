import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Centered content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}
      >
        <div style={{ maxWidth: 700, textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              color: "#2563eb",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontSize: 12,
            }}
          >
            Group 4's site
          </p>
          <h1
            style={{
              margin: "16px 0 12px",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.05,
            }}
          >
            Movies & TV Shows
          </h1>
          <p
            style={{
              margin: "0 0 28px",
              fontSize: 18,
              lineHeight: 1.75,
              color: "#475569",
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
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
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
                  background: "#0f172a",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
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
