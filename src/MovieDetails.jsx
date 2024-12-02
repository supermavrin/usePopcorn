import { useEffect, useState } from "react";

import StarRating from "./StarRating";
import Loader from "./Loader";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  apiKey,
  watched,
  onAddWatched,
  onRemoveWatched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isOnWatchlist = watched
    .map((movie) => movie.imdbID)
    .includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    imdbID,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      title,
      poster,
      runtime: Number(runtime.split(" ").at(0)),
      imdbRating: Number(imdbRating),
      imdbID,
      userRating: userRating,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  function handleRemove(id) {
    onRemoveWatched(id);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails(id) {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?&apikey=${apiKey}&i=${id}`
          );

          if (!res.ok)
            throw new Error(`There was an error fetching movie details!`);

          const data = await res.json();

          if (data.Response === "False")
            throw new Error(`There was an error fetching movie details!`);

          setMovie(data);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching movie details: ", err);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }

      getMovieDetails(selectedId);
    },
    [selectedId, watched]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") onCloseMovie();
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button className="btn-back" onClick={onCloseMovie}>
            &larr;
          </button>
          <header>
            <img src={poster} alt={`Image of a poster for ${title}.`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>🌟</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isOnWatchlist ? (
                <StarRating
                  maxRating={10}
                  size={24}
                  defaultRating={userRating ? 1 : 0}
                  onSetRating={setUserRating}
                />
              ) : (
                <span>You rated this movie {watchedUserRating} ⭐!</span>
              )}
              {!isOnWatchlist ? (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to Watchlist
                </button>
              ) : (
                <button
                  className="btn-add"
                  onClick={() => handleRemove(movie.imdbID)}
                >
                  - Remove from Watchlist
                </button>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
