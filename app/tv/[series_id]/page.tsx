"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type TVDetail = {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string;
  status: string;
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

export default function TVDetailPage() {
  const { series_id } = useParams();
  const [show, setShow] = useState<TVDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tv/${series_id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then(setShow)
      .catch(() => setError("Failed to load TV show details."));
  }, [series_id]);

  if (error) return <p>{error}</p>;
  if (!show) return <p role="status">Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <img
        src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
        alt={show.name}
      />
      <h1>{show.name}</h1>
      <p>{show.first_air_date}</p>
      <p>Status: {show.status}</p>
      <p>{show.genres.map((g) => g.name).join(", ")}</p>
      <p>{show.overview}</p>

      <h2>Community</h2>
      <p>Average Rating: {show.community.avgRating ?? "No ratings yet"}</p>
      <p>Total Ratings: {show.community.totalRatings}</p>
      <p>Total Reviews: {show.community.totalReviews}</p>

      {show.community.recentReviews.length > 0 && (
        <>
          <h3>Recent Reviews</h3>
          {show.community.recentReviews.map((review) => (
            <div
              key={review.id}
              style={{ borderTop: "1px solid #ccc", paddingTop: "10px" }}
            >
              <strong>{review.title}</strong> by {review.author}
              <p>{review.body}</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </>
      )}

      <p>
        <em>Sign in to rate</em>
      </p>
    </div>
  );
}
