import { useEffect } from "react";

export default function MovieDetails({ selectedId, onCloseMovie, apiKey }) {
  useEffect(function () {
    async function fetchMovie(id) {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${selectedId}&apikey=${apiKey}`
        );

        console.log(res);
      } finally {
      }
    }

    fetchMovie(selectedId);
  });

  return (
    <div className="details">
      <button className="btn-back" onClick={onCloseMovie}>
        {" "}
        &larr;{" "}
      </button>
      {selectedId}
    </div>
  );
}
