"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const API_BASE = "http://127.0.0.1:8000/api";

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/notes`);
      setNotes(data.notes);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add a new note
  const addNote = async () => {
    if (!newNote) return;
    try {
      const { data } = await axios.post(`${API_BASE}/add_note`, null, {
        params: { text: newNote },
      });
      setNotes([...notes, data.note]);
      setNewNote("");
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete_note/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  // Start editing
  const startEditing = (note) => {
    setEditingId(note.id);
    setEditingText(note.text);
  };

  // Save edited note
  const saveEdit = async () => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/update_note/${editingId}`,
        null,
        { params: { text: editingText } }
      );
      setNotes(notes.map((note) => (note.id === editingId ? data.note : note)));
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Simple Notes Application
      </h1>

      {/* Add New Note */}
      <div className="flex mb-6 space-x-2 w-full max-w-md">
        <input
          type="text"
          placeholder="Add a new note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={addNote}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Notes List */}
      <div className="w-full max-w-md">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex justify-between items-center p-3 mb-2 bg-white shadow rounded"
          >
            {editingId === note.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded mr-2"
                />
                <button
                  onClick={saveEdit}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{note.text}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(note)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
