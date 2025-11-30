from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.db.notes_queries import get_all_notes, add_note, update_note, delete_note
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from typing import List

notes_router = APIRouter()

@notes_router.get("/notes", response_model=List[NoteResponse])
async def get_notes():
    return get_all_notes()


@notes_router.post("/add_note", response_model=NoteResponse)
async def add_new_note(note: NoteCreate):
    new_note = add_note(note.text)
    if new_note:
        return new_note
    raise HTTPException(status_code=500, detail="Failed to add note")


@notes_router.put("/update_note/{note_id}", response_model=NoteResponse)
async def update_note_endpoint(note_id: int, note: NoteUpdate):
    updated = update_note(note_id, note.text)
    if not updated:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"id": updated[0], "text": updated[1]}


@notes_router.delete("/delete_note/{note_id}")
async def delete_note_endpoint(note_id: int):
    deleted = delete_note(note_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted"}
