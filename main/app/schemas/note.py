from pydantic import BaseModel, Field

# Request model for creating a note
class NoteCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=500, description="Note text")

# Request model for updating a note
class NoteUpdate(BaseModel):
    text: str = Field(..., min_length=1, max_length=500, description="Updated note text")

# Response model for a note
class NoteResponse(BaseModel):
    id: int
    text: str
