from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.router import api_router

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
    )

app.include_router(api_router, prefix="/api")

@app.get("/", response_class=HTMLResponse)
def index():
    message = "Starter Template for FastAPI"
    html_content = f"<html><body><h1>{message}</h1></body></html>"
    return HTMLResponse(content=html_content)



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=9090)