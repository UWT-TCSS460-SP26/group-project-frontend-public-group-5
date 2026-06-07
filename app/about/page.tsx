import Link from "next/link";

const team = [
  {
    name: "Kylen Nguyen",
    role: "Auth & Integration Lead",
    contributions:
      "NextAuth setup, session token verification, consumer credentials, profile tab (edit ratings & reviews), overall UX polish, sprint merges.",
  },
  {
    name: "Evin Roen",
    role: "Detail Pages & Navigation",
    contributions:
      "Movie and TV show detail pages, navigation bar, review submission on detail pages.",
  },
  {
    name: "Carson",
    role: "Browse & Featured",
    contributions:
      "Popular movies browse page, user profile page, featured top-rated / most-reviewed content page.",
  },
  {
    name: "Geovani Vasquez",
    role: "Search & Ratings",
    contributions:
      "Search page, star-rating feature, trending carousel with live navigation.",
  },
];

const services = [
  {
    name: "The Movie Database (TMDB)",
    url: "https://www.themoviedb.org/",
    description:
      "All movie and TV show metadata — titles, posters, overviews, genres, and release dates — is sourced from TMDB through our partner backend.",
  },
  {
    name: "Auth² (Course Auth Service)",
    url: null,
    description:
      "User accounts, sign-in, and JWT session tokens are managed by the course authentication service provided by the TCSS 460 instructors.",
  },
  {
    name: "Group 4 Backend API",
    url: null,
    description:
      "All data queries (ratings, reviews, featured content, popular lists) are served by the REST API built and maintained by Group 4.",
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    description: "Continuous deployment and hosting for this Next.js application.",
  },
];

export default function AboutPage() {
  return (
    <main
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        padding: "0 0 var(--sp-12)",
      }}
    >
      <section
        style={{ maxWidth: 900, margin: "0 auto", padding: "var(--sp-12) var(--sp-4) 0" }}
      >
        {/* ── Page header ────────────────────────────────── */}
        <div
          style={{
            marginBottom: "var(--sp-12)",
            paddingBottom: "var(--sp-8)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              margin: "0 0 var(--sp-2)",
              color: "var(--accent)",
              fontSize: "var(--fs-xs)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            TCSS 460 · Spring 2026 · Group 5
          </p>
          <h1
            style={{
              margin: "0 0 var(--sp-4)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: "var(--lh-tight)",
              color: "var(--text)",
            }}
          >
            About This App
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "var(--fs-md)",
              color: "var(--text-muted)",
              lineHeight: "var(--lh-body)",
              maxWidth: 640,
            }}
          >
            A movie and TV show discovery platform. Browse popular titles, search by
            name, rate what you&apos;ve watched, and read or write community reviews —
            all powered by a real partner backend and The Movie Database.
          </p>
        </div>

        {/* ── Team ──────────────────────────────────────── */}
        <div style={{ marginBottom: "var(--sp-12)" }}>
          <h2
            style={{
              margin: "0 0 var(--sp-6)",
              fontSize: "var(--fs-lg)",
              color: "var(--text)",
            }}
          >
            The Team
          </h2>
          <div
            style={{
              display: "grid",
              gap: "var(--sp-4)",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {team.map((member) => (
              <div
                key={member.name}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-card)",
                  padding: "var(--sp-5)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 var(--sp-1)",
                    fontSize: "var(--fs-xs)",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                  }}
                >
                  {member.role}
                </p>
                <h3
                  style={{
                    margin: "0 0 var(--sp-3)",
                    fontSize: "var(--fs-base)",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--fs-sm)",
                    color: "var(--text-muted)",
                    lineHeight: "var(--lh-body)",
                  }}
                >
                  {member.contributions}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Partner group ─────────────────────────────── */}
        <div
          style={{
            marginBottom: "var(--sp-12)",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            padding: "var(--sp-6)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <h2
            style={{
              margin: "0 0 var(--sp-3)",
              fontSize: "var(--fs-lg)",
              color: "var(--text)",
            }}
          >
            Our Partner Group
          </h2>
          <p
            style={{
              margin: "0 0 var(--sp-4)",
              color: "var(--text-muted)",
              lineHeight: "var(--lh-body)",
            }}
          >
            This consumer app is built against the REST API developed and maintained by{" "}
            <strong style={{ color: "var(--text)" }}>Group 4</strong>. Their backend
            handles all data persistence — user accounts, ratings, reviews, and enriched
            TMDB metadata. We coordinate with them on API contracts, endpoint availability,
            and upstream bug reports.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sp-2)",
              background: "var(--genre-bg)",
              color: "var(--genre-text)",
              borderRadius: "var(--radius-full)",
              padding: "var(--sp-1) var(--sp-3)",
              fontSize: "var(--fs-sm)",
              fontWeight: 600,
            }}
          >
            Upstream partner: Group 4
          </div>
        </div>

        {/* ── Services ──────────────────────────────────── */}
        <div>
          <h2
            style={{
              margin: "0 0 var(--sp-6)",
              fontSize: "var(--fs-lg)",
              color: "var(--text)",
            }}
          >
            Powered By
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
            {services.map((svc) => (
              <div
                key={svc.name}
                style={{
                  display: "flex",
                  gap: "var(--sp-4)",
                  alignItems: "flex-start",
                  padding: "var(--sp-4)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 var(--sp-1)",
                      fontWeight: 700,
                      color: "var(--text)",
                      fontSize: "var(--fs-base)",
                    }}
                  >
                    {svc.url ? (
                      <a
                        href={svc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--accent)", textDecoration: "none" }}
                      >
                        {svc.name}
                      </a>
                    ) : (
                      svc.name
                    )}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--fs-sm)",
                      color: "var(--text-muted)",
                      lineHeight: "var(--lh-body)",
                    }}
                  >
                    {svc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer link ───────────────────────────────── */}
        <div
          style={{
            marginTop: "var(--sp-12)",
            paddingTop: "var(--sp-6)",
            borderTop: "1px solid var(--border)",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontSize: "var(--fs-sm)",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
