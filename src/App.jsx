// React
import { useEffect, useState } from "react";

// Custom Hooks
import { useMovies } from "./useMovies";

// Components
import MovieList from "./MovieList";
import Loader from "./Loader";
import NavBar from "./NavBar";
import Box from "./Box";
import ErrorMessage from "./ErrorMessage";
import Search from "./Search";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";
import MovieDetails from "./MovieDetails";
import Main from "./Main";
import NumResults from "./NumResults";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "c80b3469";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");
    return JSON.parse(storedValue);
  });

  const { movies, error, isLoading } = useMovies(query, handleCloseMovie);

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
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
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
              <WatchedMoviesList
                watched={watched}
                onSelectMovie={handleSelectMovie}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
