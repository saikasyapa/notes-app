import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/notes`)
      .then((res) => setNotes(res.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const addNote = () => {
    axios.post(`${API_URL}/notes`, { title, content })
      .then(() => {
        setTitle("");
        setContent("");
        axios.get(`${API_URL}/notes`).then((res) => setNotes(res.data));
      })
      .catch(error => console.error("Error adding note:", error));
  };
  

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <h1>Notes App</h1>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>: {note.content}
          </li>
        ))}
      </ul>
      <style>
        {`
          body {
            transition: background 0.3s ease-in-out;
          }
          .dark-mode {
            background-color: #333;
            color: white;
            min-height: 100vh;
            padding: 20px;
          }
          .light-mode {
            background-color: #fff;
            color: black;
            min-height: 100vh;
            padding: 20px;
          }
        `}
      </style>
    </div>
  );
}

export default App;
