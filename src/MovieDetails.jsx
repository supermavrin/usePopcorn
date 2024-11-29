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
  const [isOnWatchlist, setIsOnWatchlist] = useState(false);

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

          console.log(data);

          if (data.Response === "False")
            throw new Error(`There was an error fetching movie details!`);

          setMovie(data);
          setIsOnWatchlist(
            watched.map((movie) => movie.imdbID).includes(data.imdbID)
          );
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
    [selectedId]
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
              <StarRating
                maxRating={10}
                size={24}
                defaultRating={imdbRating ? Math.round(imdbRating) : 0}
              />
              <button
                onClick={
                  !isOnWatchlist
                    ? () => onAddWatched(movie)
                    : () => onRemoveWatched(movie.imdbID)
                }
              >
                {!isOnWatchlist ? "Add to Watchlist" : "Remove from Watchlist"}
              </button>
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
