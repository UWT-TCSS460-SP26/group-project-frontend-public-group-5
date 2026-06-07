"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import RatingsList from "@/components/RatingsList";
import ReviewsList from "@/components/ReviewsList";

interface RatingEntry {
  id: number;
  score: number;
  createdAt: string;
  user: { userId: number; username: string };
  media: { tmdbId: number; type: string; title: string | null };
}

interface ReviewEntry {
  id: number;
  title: string | null;
  body: string;
  createdAt: string;
  user: { userId: number; username: string };
  media: { tmdbId: number; type: string; title: string | null };
}

interface UserProfile {
  userId: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ratings" | "reviews">("ratings");

  useEffect(() => {
    if (status === "unauthenticated") return;

    if (status === "authenticated" && session) {
      const fetchData = async () => {
        try {
          const accessToken = (session as any).accessToken;
          if (!accessToken) throw new Error("No access token available");

          const profileRes = await fetch(
            "https://group-project-backend-group-4.onrender.com/api/users/me",
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );

          if (!profileRes.ok) {
            setError("Could not load profile");
            setLoading(false);
            return;
          }

          const profileData = await profileRes.json();
          setUserProfile(profileData.user);

          const ratingsRes = await fetch(
            "https://group-project-backend-group-4.onrender.com/api/ratings/me/enhanced",
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          if (ratingsRes.ok) {
            const ratingsData = await ratingsRes.json();
            setRatings(ratingsData.ratings || []);
          }

          const reviewsRes = await fetch(
            "https://group-project-backend-group-4.onrender.com/api/reviews/me/enhanced",
            { headers: { Authorization: `Bearer ${accessToken}` } },
          );
          if (reviewsRes.ok) {
            const reviewsData = await reviewsRes.json();
            setReviews(reviewsData.reviews || []);
          }

          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", color: "var(--text)" }}>Loading profile...</div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", color: "var(--text)" }}>
          <h1>Sign In Required</h1>
          <p>Please sign in to view your profile.</p>
          <Link href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>Return to Home</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
        {/* Profile header */}
        {userProfile && (
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ margin: "0 0 12px 0", fontSize: 32, fontWeight: 700, color: "var(--text)" }}>
              {userProfile.username}
            </h1>
            <p style={{ margin: 0, color: "var(--text-subtle)", fontSize: 14 }}>{userProfile.email}</p>
            <p style={{ margin: "8px 0 0 0", color: "var(--text-subtle)", fontSize: 14 }}>
              Joined {new Date(userProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "var(--error-bg)",
              color: "var(--error-text)",
              padding: "12px 16px",
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div style={{ marginBottom: "20px", borderBottom: "1px solid var(--border)" }}>
          <button
            onClick={() => setActiveTab("ratings")}
            style={{
              padding: "12px 20px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "ratings" ? 600 : 400,
              borderBottom: activeTab === "ratings" ? "2px solid var(--accent)" : "none",
              color: activeTab === "ratings" ? "var(--accent)" : "var(--text-subtle)",
              fontSize: 14,
            }}
          >
            Ratings ({ratings.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            style={{
              padding: "12px 20px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "reviews" ? 600 : 400,
              borderBottom: activeTab === "reviews" ? "2px solid var(--accent)" : "none",
              color: activeTab === "reviews" ? "var(--accent)" : "var(--text-subtle)",
              fontSize: 14,
            }}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-subtle)" }}>
            Loading your {activeTab}...
          </div>
        ) : activeTab === "ratings" ? (
          <RatingsList ratings={ratings} onRatingsChange={setRatings} />
        ) : (
          <ReviewsList reviews={reviews} onReviewsChange={setReviews} />
        )}
      </div>
    </main>
  );
}
