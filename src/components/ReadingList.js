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

  const addBook = () => {
    if (newBook.trim() !== "") {
      setBooks([...books, { title: newBook, read: false }]);
      setNewBook("");
    }
  };

  const deleteBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(books[index].title);
  };

  const saveEdit = () => {
    if (editingText.trim() !== "") {
      const updatedBooks = [...books];
      updatedBooks[editingIndex].title = editingText;
      setBooks(updatedBooks);
      setEditingIndex(null);
    }
  };

  const toggleRead = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index].read = !updatedBooks[index].read;
    setBooks(updatedBooks);
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
        {books.map((book) => (
          <li
            key={book.book_id}
            className={`book-item ${book.status === "Read" ? "read" : ""}`}
          >
            <div className="left-section">
              <input
                type="checkbox"
                checked={book.read}
                onChange={() => toggleRead(book.book_id)}
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
                    textDecoration: book.read ? "line-through" : "none",
                  }}
                >
                  {book.book_title}
                </span>
              )}
            </div>
            <div className="right-section">
              {editingIndex === book.book_id ? (
                <button className="save-btn" onClick={saveEdit}>
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
