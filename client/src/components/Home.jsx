import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes on mount
  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await axios.get("/api/notes");
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  async function addNote(newNote) {
    try {
      const res = await axios.post("/api/notes", newNote);
      setNotes(prevNotes => [res.data, ...prevNotes]);
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  }

  async function deleteNote(id) {
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />

      {loading ? (
        <div className="notes-loading">Loading your notes...</div>
      ) : notes.length === 0 ? (
        <div className="notes-empty">
          <p>No notes yet. Start by creating one above! 📝</p>
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map(note => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Home;
