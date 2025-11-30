from fastapi import APIRouter
from app.core.connection import get_db_connection
from fastapi.responses import JSONResponse

db_router = APIRouter()

@db_router.get("/dbstatus")
async def db_status():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")  # simple query
        cursor.fetchone()
        cursor.close()
        conn.close()
        return JSONResponse(content={"status": "ok", "message": "Database connection successful"})
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)
