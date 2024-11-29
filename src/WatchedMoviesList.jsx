import WatchedMovie from "./WatchedMovie";

export default function WatchedMoviesList({
  watched,
  onSelectMovie,
  onRemoveWatched,
}) {
  return (
    <ul className="list list-movies">
      {watched.map((movie) => (
        <div>
          <WatchedMovie
            movie={movie}
            key={movie.imdbID}
            onSelectMovie={onSelectMovie}
            onRemoveWatched={onRemoveWatched}
          />
        </div>
      ))}
    </ul>
  );
}
