from fastapi import APIRouter

from app.api.endpoints.user import user_router
from app.api.endpoints.notes import notes_router
from app.api.endpoints.dbstatus import db_router
api_router = APIRouter()


api_router.include_router(user_router, tags=["User"])
api_router.include_router(notes_router, tags=["Notes"])
api_router.include_router(db_router, tags=["Database Status"])