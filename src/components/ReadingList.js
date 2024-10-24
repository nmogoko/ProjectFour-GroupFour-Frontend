import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ReadingList.css";
import { fetchWithAuth } from "../utils";

function ReadingListComponent() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          "https://projectfour-groupfour-api.onrender.com/reading-list",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        console.log(result);
        setBooks(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const addBook = async () => {
    try {
      const response = await fetchWithAuth(
        "https://projectfour-groupfour-api.onrender.com/create-reading-list",
        {
          method: "POST",
          body: JSON.stringify({
            book_title: newBook,
            status: "Unread",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      console.log(result);
      setNewBook("")
      setBooks((prevBooks) => [...prevBooks, result]);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  const updateBook = async (bookId, updatedFields) => {
    try {
      const response = await fetchWithAuth(
        `https://projectfour-groupfour-api.onrender.com/update-reading-list/${bookId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updatedFields),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

    const updatedBook = await response.json();
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.book_id === bookId ? updatedBook : book
        )
      );
    } catch (err) {
   
      setError(err.message);
    }
  };
 const deleteBook = async (id) => {
  try {
    const response = await fetchWithAuth(
      `https://projectfour-groupfour-api.onrender.com/delete-reading-list/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const result = await response.json();
    console.log(result);
    setBooks(books.filter(book => book.book_id !== id));
  } catch (err) {
    setError(err.message);
  }
  };

  const startEditing = (id) => {
    setEditingIndex(id);
    const foundBook = books.find(book => book.book_id == id).book_title;
    setEditingText(foundBook);
  };

  return (
    <div className="reading-list-container">
      <h1>Reading List</h1>
      <div className="book-input-container">
        <input
          type="text"
          value={newBook}
          onChange={(e) => setNewBook(e.target.value)}
          placeholder="Enter a book title"
        />
        <button onClick={addBook}>Add Book</button>
      </div>
      {error && <h3>{error}</h3>}
      <ul className="books-list">
        {books.map((book, index) => (
          <li
            key={book.book_id}
            className={`book-item ${book?.status === "Read" ? "read" : ""}`}
          >
            <div className="left-section">
              <input
                type="checkbox"
                checked={book?.status === "Read"}
                onChange={() => updateBook(book?.book_id, {status: book?.status === "Read" ? "Unread" : "Read"})}
              />
              {editingIndex === book.book_id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span
                  className="book-title"
                  style={{
                    textDecoration: book.status === "Read" ? "line-through" : "none",
                  }}
                >
                  {book.book_title}
                </span>
              )}
            </div>
            <div className="right-section">
              {editingIndex === book.book_id ? (
                <button className="save-btn" onClick={()=>{
                  updateBook(book.book_id, {book_title:editingText})
                  setEditingIndex(null)
                  }}>
                  Save
                </button>
              ) : (
                <>
                  <button
                    className="edit-btn"
                    onClick={() => startEditing(book.book_id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteBook(book.book_id)}
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

export default ReadingListComponent;
