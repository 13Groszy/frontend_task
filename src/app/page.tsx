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

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchData(title, type, setMovies, setError, setResults, setLoading);
  };

  return (
    <main className="py-10 space-y-5">
      <h1 className="text-2xl text-center px-5">Search Movies</h1>
      <SearchForm
        type={type}
        setType={setType}
        title={title}
        setTitle={setTitle}
        handleSubmit={handleSubmit}
      />
      {loading && <p className="text-center">Loading...</p>}
      {results > 0 && (
        <MovieList
          movies={movies}
          results={results}
          fetchData={() =>
            fetchData(title, type, setMovies, setError, setResults, setLoading)
          }
        />
      )}
      {error && <p className="text-center">No results found</p>}
    </main>
  );
}

const fetchData = async (
  title: string,
  type: string,
  setMovies: (movies: Movie[]) => void,
  setError: (error: boolean) => void,
  setResults: (results: number) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true);
  const response = await fetch(
    `http://www.omdbapi.com/?s=${title}&type=${type}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
  );
  const data = await response.json();

  if (data.Search) {
    setMovies(data.Search);
    setError(false);
    setResults(data.totalResults);
  } else {
    setMovies([]);
    setError(true);
    setResults(0);
  }
  setLoading(false);
};

const SearchForm = ({
  type,
  setType,
  title,
  setTitle,
  handleSubmit,
}: {
  type: string;
  setType: (type: string) => void;
  title: string;
  setTitle: (title: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) => (
  <form
    className="max-w-xl mx-auto px-5 flex flex-col md:flex-row gap-4 items-start md:items-center"
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
);

const MovieItem = ({ movie }: { movie: Movie }) => (
  <div
    className="grid grid-cols-5 items-center py-2 px-3 odd:bg-gray-100 even:bg-gray-50 gap-1"
    key={movie.imdbID}
  >
    <div>
      <img src={movie.Poster} alt={movie.Title} style={{ width: "50px" }} />
    </div>
    <span className="col-span-2">{movie.Title}</span>
    <span>{movie.Type}</span>
    <span>{movie.Year}</span>
  </div>
);

const MovieList = ({
  movies,
  results,
  fetchData,
}: {
  movies: Movie[];
  results: number;
  fetchData: () => void;
}) => (
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
        <MovieItem movie={movie} key={movie.imdbID} />
      ))}
    </div>
    {results > 10 && (
      <button
        className="mt-4 px-2 py-1 bg-blue-300 hover:bg-blue-400 transition rounded-md"
        onClick={()=>console.log("load more")}
      >
        Load more
      </button>
      // load more button can be replaced with pagination
    )}
  </section>
);