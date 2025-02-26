import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const deleteNote = (id) => {
    axios
      .delete(`${API_URL}/notes/${id}`)
      .then(() => fetchNotes())
      .catch((error) => console.error("Error deleting note:", error));
  };

  return (
    <div>
      <h1>Notes App</h1>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>: {note.content}
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
