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
      <input className="input-title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="input-content" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button className="add-button" onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li className="note-item" key={note.id}>
            <strong className="note-title">{note.title}</strong>
            <p className="note-content">{note.content}</p>
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
          .title {
            text-align: center;
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .input-title, .input-content {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
          }
          .input-content {
            height: 80px;
          }
          .add-button {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
          }
          .add-button:hover {
            background-color: #0056b3;
          }
          .notes-list {
            list-style: none;
            padding: 0;
          }
          .note-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
          }
          .note-title {
            font-size: 1.2rem;
            font-weight: bold;
          }
          .note-content {
            margin-top: 5px;
            font-size: 1rem;
          }
        `}
      </style>
    </div>
  );
}

export default App;
