import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MovieList.css";
import { fetchWithAuth } from "../utils";

function MovieListComponent() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetchWithAuth("https://projectfour-groupfour-api.onrender.com/movies", {
          method: "GET",
        });

        if (!response.ok) throw new Error("Failed to fetch movies");

        const result = await response.json();
        setMovies(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMovies();
  }, []);

  const addMovie = async () => {
    try {
      const response = await fetchWithAuth("https://projectfour-groupfour-api.onrender.com/create_movies", {
        method: "POST",
        body: JSON.stringify({ title: newMovie, watched: false }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to add movie");

      const result = await response.json();
      setMovies((prevMovies) => [...prevMovies, result]);
      setNewMovie("");
    } catch (err) {
      setError(err.message);
    }
  };

  const updateMovie = async (movieId, updatedFields) => {
    try {
      const response = await fetchWithAuth(
        `https://projectfour-groupfour-api.onrender.com/update-movie-list/${movieId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedFields),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to update movie");

      const updatedMovie = await response.json();
      setMovies((prevMovies) =>
        prevMovies.map((movie) => (movie.movie_id === movieId ? updatedMovie : movie))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMovie = async (movieId) => {
    try {
      const response = await fetchWithAuth(
        `https://projectfour-groupfour-api.onrender.com/delete_movie/${movieId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete movie");

      setMovies((prevMovies) => prevMovies.filter((movie) => movie.movie_id !== movieId));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditing = (id) => {
    setEditingIndex(id);
    const foundMovie = movies.find(movie => movie.movie_id === id).title;
    setEditingText(foundMovie);
  };

  return (
    <div className="movie-list-container">
      <h1>Movie List</h1>
      <div className="movie-input-container">
        <input
          type="text"
          value={newMovie}
          onChange={(e) => setNewMovie(e.target.value)}
          placeholder="Enter a movie title"
        />
        <button onClick={addMovie}>Add Movie</button>
      </div>
      {error && <h3>{error}</h3>}
      <ul className="movies-list">
        {movies.map((movie, index) => (
          <li
            key={movie.movie_id}
            className={`movie-item ${movie.watched ? "watched" : ""}`}
          >
            <div className="left-section">
              <input
                type="checkbox"
                checked={movie.watched}
                onChange={() => updateMovie(movie?.movie_id, {status: movie?.status === "Watched" ? "Unwatched" : "Watched"})}
              />
              {editingIndex === movie.movie_id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span
                  className="movie-title"
                  style={{
                    textDecoration: movie.status === "Watched" ? "line-through" : "none",
                  }}
                >
                  {movie.movie.title}
                </span>
              )}
            </div>
            <div className="right-section">
              {editingIndex === movie.movie_id ? (
                <button className="save-btn" onClick={()=>{
                  updateMovie(movie.movie_id, {movie_title:editingText})
                  setEditingIndex(null)
                  }}>
                  Save
                </button>
              ) : (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => startEditing(movie.movie_id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteMovie(movie.movie_id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
    </div>
  );
}

export default MovieListComponent;
