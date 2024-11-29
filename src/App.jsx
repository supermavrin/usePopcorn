// React
import { useEffect, useState } from "react";

// Components
import MovieList from "./MovieList";
import Loader from "./Loader";
import NavBar from "./NavBar";
import Box from "./Box";
import ErrorMessage from "./ErrorMessage";
import Search from "./Search";
import WatchedMovie from "./WatchedMovie";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";
import MovieDetails from "./MovieDetails";
import Main from "./Main";
import NumResults from "./NumResults";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "c80b3469";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id !== selectedId ? id : null));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleRemoveWatched(id) {
    const indexToRemove = watched.findIndex((movie) => movie.imdbID === id);
    const newWatchedList = watched.toSpliced(indexToRemove, 1);
    setWatched(newWatchedList);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies!");

          const data = await res.json();

          if (data.Response === "False" && query !== "")
            throw new Error("Movie not found!");

          setMovies(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              apiKey={KEY}
              watched={watched}
              onAddWatched={handleAddWatched}
              onRemoveWatched={handleRemoveWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} average={average} />
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
