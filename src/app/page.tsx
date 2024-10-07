"use client";
import { useState, FormEvent } from "react";

interface Movie {
  imdbID: string;
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
}

// componetize the app
// future improvements (for another ~1h session):
// debounce the fetchData function on typing
// fetch data after type change (only if title is not empty)
// add pagination

export default function Home() {
  const [type, setType] = useState("movie");
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState(0);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    const response = await fetch(
      `http://www.omdbapi.com/?s=${title}&type=${type}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
    );
    //page=2/3/4 - pagination
    const data = await response.json();

    if (data.Search) {
      setMovies(data.Search);
      setError(false);
      setResults(data.totalResults);
      setLoading(false);
    } else {
      setMovies([]);
      setError(true);
      setResults(0);
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchData();
  };

  return (
    <main className="py-10 space-y-5">
      <h1 className="text-2xl text-center px-5">Search Movies</h1>
      <form
        className="max-w-xl mx-auto px-5 flex gap-4 items-center"
        onSubmit={handleSubmit}
      >
        <label>
          Type: {""}
          <select
            className="px-4 py-1 border rounded border-gray-300"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </label>
        <label>
          Title: {""}
          <input
            className="ml-2 px-2 py-1 border border-gray-300 rounded"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <button
          className="px-2 py-1 bg-blue-300 hover:bg-blue-400 transition rounded-md"
          type="submit"
        >
          Search
        </button>
      </form>
      {loading && <p className="text-center">Loading...</p>}
      {results > 0 && (
        <section className="max-w-3xl mx-auto px-5">
          <h2 className="text-xl pb-4">Results found: {results}</h2>
          <div className="grid grid-cols-5 items-center">
            <span>Poster</span>
            <span className="col-span-2">Title</span>
            <span>Type</span>
            <span>Year</span>
          </div>
          <div>
            {movies.map((movie) => (
              <div
                className="grid grid-cols-5 items-center py-2 px-3 odd:bg-gray-100 even:bg-gray-50 gap-1"
                key={movie.imdbID}
              >
                <div>
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    style={{ width: "50px" }}
                  />
                </div>
                <span className="col-span-2">{movie.Title}</span>
                <span>{movie.Type}</span>
                <span>{movie.Year}</span>
              </div>
            ))}
          </div>
          {results > 10 && (
            <button
              className="mt-4 px-2 py-1 bg-blue-300 hover:bg-blue-400 transition rounded-md"
              onClick={fetchData}
            >
              Load more
            </button>
          )}
          {/* load more button can be replaced with pagination */}
        </section>
      )}
      {error && <p className="text-center">No results found</p>}
    </main>
  );
}
