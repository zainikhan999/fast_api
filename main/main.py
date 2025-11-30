from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.core.connection import get_db_connection
from app.api.router import api_router

# Lifespan function to handle startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: check DB connection
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT current_database();")
        db_name = cur.fetchone()[0]
        print(f"Connected to Database: {db_name} ✅")

    except Exception as e:
        print("DB connection failed ❌", e)
    finally:
        conn.close()
    yield
    # Shutdown logic if needed
    print("Server shutting down...")

# Create FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

# CORS middleware
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include API router
app.include_router(api_router, prefix="/api")

# Root endpoint
@app.get("/", response_class=HTMLResponse)
def index():
    message = "Starter Template for FastAPI"
    html_content = f"<html><body><h1>{message}</h1></body></html>"
    return HTMLResponse(content=html_content)

# Run server
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
