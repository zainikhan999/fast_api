from fastapi import APIRouter

from app.api.endpoints.user import user_router

api_router = APIRouter()

api_router.include_router(user_router, tags=["User"])