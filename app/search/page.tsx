"use client"
import { useState } from "react"
export default function SearchPage() {
    const [searchText, setSearchText] = useState("");
    const [mediaType, setMediaType] = useState(null);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleSearch = async () => {
        if (!mediaType || !searchText) return;
        try {
            let url = "";
            setIsLoading(true);
            if(mediaType === "MOVIE") {
                url = `https://group-project-backend-group-4.onrender.com/api/movies/search?title=${searchText.replace(/ /g, "+")}`
            } else {
                url = `https://group-project-backend-group-4.onrender.com/api/tv/search?title=${searchText.replace(/ /g, "+")}`
            }
            const response = await fetch(url, {})
            const data = await response.json()
            setResults(data.results)
            setIsLoading(false);
            setError(null);
        } catch (err) {
            setError("An error occurred while fetching data.");
            setIsLoading(false);
            setResults([]);
        }
    }
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
                    if(e.key === "Enter") {
                        handleSearch()
                    }
                }}
            />
            <button 
                onClick={() => setMediaType("MOVIE")} 
                aria-pressed={mediaType === "MOVIE"}
                style={{ backgroundColor: mediaType === "MOVIE" ? "cyan" : "grey" }}>
                Movies
            </button>
            <button 
                onClick={() => setMediaType("TV")} 
                aria-pressed={mediaType === "TV"}
                style={{ backgroundColor: mediaType === "TV" ? "cyan" : "grey" }}>
                TV Shows
            </button>
            <button onClick={handleSearch}>Search</button>
        </div>
        {isLoading && <p role="status">Loading...</p>}
        {error && <p>{error}</p>}   
        {results.map((item) => (
            <div key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.release_date}</p>
            </div>
        ))}    
        </>
    )
}