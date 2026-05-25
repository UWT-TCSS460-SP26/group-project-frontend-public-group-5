"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  budget: number;
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

export default function MovieDetailPage() {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/movies/${movie_id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Server returned ${r.status}`);
        return r.json();
      })
      .then(setMovie)
      .catch(() => setError("Failed to load movie details."));
  }, [movie_id]);

  if (error) return <p>{error}</p>;
  if (!movie) return <p role="status">Loading...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <h1>{movie.title}</h1>
      <p>{movie.release_date}</p>
      <p>{movie.genres.map((g) => g.name).join(", ")}</p>
      <p>{movie.overview}</p>
      <p>Budget: ${movie.budget.toLocaleString()}</p>

      <h2>Community</h2>
      <p>Average Rating: {movie.community.avgRating ?? "No ratings yet"}</p>
      <p>Total Ratings: {movie.community.totalRatings}</p>
      <p>Total Reviews: {movie.community.totalReviews}</p>

      {movie.community.recentReviews.length > 0 && (
        <>
          <h3>Recent Reviews</h3>
          {movie.community.recentReviews.map((review) => (
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
