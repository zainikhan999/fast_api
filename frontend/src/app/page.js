"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("notes"); // "notes", "archive", "trash"
  const [showAddModal, setShowAddModal] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api";

  // Predefined pastel colors for notes
  const noteColors = [
    "bg-gradient-to-br from-yellow-200 to-yellow-300",
    "bg-gradient-to-br from-orange-200 to-orange-300",
    "bg-gradient-to-br from-green-200 to-green-300",
    "bg-gradient-to-br from-purple-200 to-purple-300",
    "bg-gradient-to-br from-lime-200 to-lime-300",
    "bg-gradient-to-br from-cyan-200 to-cyan-300",
    "bg-gradient-to-br from-pink-200 to-pink-300",
    "bg-gradient-to-br from-blue-200 to-blue-300",
  ];

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
    if (!newNote.trim()) return;
    try {
      const { data } = await axios.post(`${API_BASE}/add_note`, null, {
        params: { text: newNote },
      });
      setNotes([...notes, data.note]);
      setNewNote("");
      setShowAddModal(false);
      setCurrentView("notes");
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  };

  // Delete note permanently
  const deleteNotePermanently = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete_note/${id}`);
      setTrashedNotes(trashedNotes.filter((note) => note.id !== id));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  // Move to trash (soft delete)
  const moveToTrash = (note) => {
    if (currentView === "notes") {
      setNotes(notes.filter((n) => n.id !== note.id));
      setTrashedNotes([...trashedNotes, note]);
    } else if (currentView === "archive") {
      setArchivedNotes(archivedNotes.filter((n) => n.id !== note.id));
      setTrashedNotes([...trashedNotes, note]);
    }
  };

  // Archive note
  const archiveNote = (note) => {
    setNotes(notes.filter((n) => n.id !== note.id));
    setArchivedNotes([...archivedNotes, note]);
  };

  // Unarchive note
  const unarchiveNote = (note) => {
    setArchivedNotes(archivedNotes.filter((n) => n.id !== note.id));
    setNotes([...notes, note]);
  };

  // Restore from trash
  const restoreFromTrash = (note) => {
    setTrashedNotes(trashedNotes.filter((n) => n.id !== note.id));
    setNotes([...notes, note]);
  };

  // Empty trash
  const emptyTrash = async () => {
    for (const note of trashedNotes) {
      try {
        await axios.delete(`${API_BASE}/delete_note/${note.id}`);
      } catch (err) {
        console.error("Failed to delete note:", err);
      }
    }
    setTrashedNotes([]);
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

      // Update in the correct array
      if (currentView === "notes") {
        setNotes(
          notes.map((note) => (note.id === editingId ? data.note : note))
        );
      } else if (currentView === "archive") {
        setArchivedNotes(
          archivedNotes.map((note) =>
            note.id === editingId ? data.note : note
          )
        );
      }

      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  // Get current notes based on view
  const getCurrentNotes = () => {
    let currentNotes = [];
    if (currentView === "notes") currentNotes = notes;
    else if (currentView === "archive") currentNotes = archivedNotes;
    else if (currentView === "trash") currentNotes = trashedNotes;

    return currentNotes.filter((note) =>
      note.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredNotes = getCurrentNotes();

  const getViewTitle = () => {
    if (currentView === "notes") return "Notes";
    if (currentView === "archive") return "Archive";
    if (currentView === "trash") return "Trash";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
            ZK
          </div>
          <span className="text-xl font-semibold text-gray-800">
            Zainab Khan Notes
          </span>
        </div>

        {/* Add Note Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full mb-6 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-medium shadow-md flex items-center justify-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Note</span>
        </button>

        <div className="space-y-2 flex-1">
          <div
            onClick={() => setCurrentView("notes")}
            className={`${
              currentView === "notes"
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600 hover:bg-gray-50"
            } px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center justify-between`}
          >
            <span>Notes</span>
            <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
              {notes.length}
            </span>
          </div>
          <div
            onClick={() => setCurrentView("archive")}
            className={`${
              currentView === "archive"
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600 hover:bg-gray-50"
            } px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center justify-between`}
          >
            <span>Archive</span>
            <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
              {archivedNotes.length}
            </span>
          </div>
          <div
            onClick={() => setCurrentView("trash")}
            className={`${
              currentView === "trash"
                ? "bg-gray-100 text-gray-800"
                : "text-gray-600 hover:bg-gray-50"
            } px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center justify-between`}
          >
            <span>Trash</span>
            <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
              {trashedNotes.length}
            </span>
          </div>
        </div>

        {currentView === "trash" && trashedNotes.length > 0 && (
          <div className="mt-8">
            <button
              onClick={emptyTrash}
              className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Empty Trash
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            {getViewTitle()}
          </h1>
        </div>

        {/* Add Note Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">New Note</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                placeholder="Take a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    addNote();
                  }
                }}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 resize-none"
                rows={6}
                autoFocus
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    setNewNote("");
                    setShowAddModal(false);
                  }}
                  className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Note
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Press Ctrl+Enter to save
              </p>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note, index) => {
            const colorClass = noteColors[index % noteColors.length];

            return (
              <div
                key={note.id}
                className={`${colorClass} rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all relative group min-h-[200px] flex flex-col justify-between`}
              >
                {editingId === note.id ? (
                  <>
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-gray-800 resize-none flex-1"
                      rows={4}
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={saveEdit}
                        className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line mb-4">
                      {note.text}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>

                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentView === "trash" ? (
                          <>
                            <button
                              onClick={() => restoreFromTrash(note)}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                              title="Restore"
                            >
                              <svg
                                className="w-4 h-4 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteNotePermanently(note.id)}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                              title="Delete Forever"
                            >
                              <svg
                                className="w-4 h-4 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            {currentView !== "archive" && (
                              <button
                                onClick={() => startEditing(note)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                                title="Edit"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-700"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                            )}
                            {currentView === "notes" && (
                              <button
                                onClick={() => archiveNote(note)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                                title="Archive"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-700"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                  />
                                </svg>
                              </button>
                            )}
                            {currentView === "archive" && (
                              <button
                                onClick={() => unarchiveNote(note)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                                title="Unarchive"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-700"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                  />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => moveToTrash(note)}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                              title="Move to Trash"
                            >
                              <svg
                                className="w-4 h-4 text-gray-700"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6z" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-full shadow-sm mb-6">
              <svg
                className="w-20 h-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">
              {searchQuery
                ? "No notes found"
                : `No ${
                    currentView === "notes"
                      ? "notes"
                      : currentView === "archive"
                      ? "archived notes"
                      : "trashed notes"
                  } yet`}
            </h3>
            <p className="text-gray-400">
              {searchQuery
                ? "Try a different search term"
                : currentView === "notes"
                ? "Click above to create your first note"
                : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
