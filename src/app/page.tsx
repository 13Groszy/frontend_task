"use client";
import { useState } from "react";
import { debounce } from "lodash";

export default function Home() {
  const [type, setType] = useState("movie");
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);

  const fetchData = async () => {
    // Example fetch function, replace with actual API call
    const response = await fetch(
      `http://www.omdbapi.com/?s=${title}&type=${type}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
    );
    const data = await response.json();
    setMovies(data.Search || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <main className="py-10 space-y-5">
      <h1 className="text-2xl text-center px-5">Search Movies</h1>
      <form className="max-w-xl mx-auto px-5" onSubmit={handleSubmit}>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </label>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>
    </main>
  );
}
