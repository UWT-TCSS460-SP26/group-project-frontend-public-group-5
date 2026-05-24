"use client";
import { useState } from "react";
export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [mediaType, setMediaType] = useState<"MOVIE" | "TV" | null>(null);
  const [results, setResults] = useState<
    { id: number; title: string; release_date: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!mediaType || !searchText) return;
    try {
      let url = "";
      setIsLoading(true);
      if (mediaType === "MOVIE") {
        url = `/api/movies/search?title=${searchText.replace(/ /g, "+")}`;
      } else {
        url = `/api/tv/search?title=${searchText.replace(/ /g, "+")}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setResults(data.results);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError("An error occurred while fetching data.");
      setIsLoading(false);
      setResults([]);
    }
  };
  return (
    <>
      <div>
        <input
          style={{ width: "200px", padding: "2px" }}
          type="text"
          placeholder="Search for movies or TV shows..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          onClick={() => setMediaType("MOVIE")}
          aria-pressed={mediaType === "MOVIE"}
          style={{ backgroundColor: mediaType === "MOVIE" ? "cyan" : "grey" }}
        >
          Movies
        </button>
        <button
          onClick={() => setMediaType("TV")}
          aria-pressed={mediaType === "TV"}
          style={{ backgroundColor: mediaType === "TV" ? "cyan" : "grey" }}
        >
          TV Shows
        </button>
        <button onClick={handleSearch}>Search</button>
      </div>
      {isLoading && <p role="status">Loading...</p>}
      {error && <p>{error}</p>}
      {results.map((item) => (
        <div key={item.id} style={{ textAlign: "center",backgroundColor: "#b0c4d8" }}>
          <h3 style={{ fontSize: "50px", color: "black", margin: 0 }}>{item.title}</h3>
          <p style={{ fontSize: "30px", color: "grey", margin: 0 }}>{item.release_date}</p>
          <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} />
        </div>
      ))}
    </>
  );
}
