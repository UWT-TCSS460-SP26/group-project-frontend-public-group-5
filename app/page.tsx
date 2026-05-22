import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 700, textAlign: "center" }}>
        <p style={{ margin: 0, color: "#2563eb", letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 12 }}>
          Group 4's site
        </p>
        <h1 style={{ margin: "16px 0 12px", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1.05 }}>
          Browse popular movies
        </h1>
        <p style={{ margin: "0 0 28px", fontSize: 18, lineHeight: 1.75, color: "#475569" }}>
          Explore popular movies. Click below to browse the current popular collection.
        </p>
        <Link href="/browse">
          <button
            style={{
              border: "none",
              borderRadius: 9999,
              padding: "14px 24px",
              background: "#2563eb",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            Browse popular movies
          </button>
        </Link>
      </div>
    </main>
  );
}
