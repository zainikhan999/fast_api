from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

notes_router = APIRouter()

# In-memory storage for notes
notes = [
    {"id": 1, "text": "Example note 1"},
    {"id": 2, "text": "Example note 2"},
]

# Get all notes
@notes_router.get("/notes")
async def get_notes():
    return JSONResponse(content={"notes": notes})

# Add a new note
@notes_router.post("/add_note")
async def add_note(text: str):
    new_id = len(notes) + 1
    note = {"id": new_id, "text": text}
    notes.append(note)
    return JSONResponse(content={"message": "Note added", "note": note})

# Update a note
@notes_router.put("/update_note/{note_id}")
async def update_note(note_id: int, text: str):
    for note in notes:
        if note["id"] == note_id:
            note["text"] = text
            return JSONResponse(content={"message": "Note updated", "note": note})
    raise HTTPException(status_code=404, detail="Note not found")

# Delete a note
@notes_router.delete("/delete_note/{note_id}")
async def delete_note(note_id: int):
    for note in notes:
        if note["id"] == note_id:
            notes.remove(note)
            return JSONResponse(content={"message": "Note deleted"})
    raise HTTPException(status_code=404, detail="Note not found")
