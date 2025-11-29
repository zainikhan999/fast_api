
# Demo Endpoints!
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

user_router = APIRouter()

# Simple in-memory storage
users = [
    {"id": 1, "name": "test", "email": "test@gmail.com"},
]

# Get all users
@user_router.get("/users")
async def get_users():
    return JSONResponse(content={"users": users})

# Add a new user
@user_router.post("/add_user")
async def add_user(name: str, email: str):
    new_id = len(users) + 1
    user = {"id": new_id, "name": name, "email": email}
    users.append(user)
    return JSONResponse(content={"message": "User added", "user": user})

# Update existing user
@user_router.put("/update_user/{user_id}")
async def update_user(user_id: int, name: str = None, email: str = None):
    for user in users:
        if user["id"] == user_id:
            if name:
                user["name"] = name
            if email:
                user["email"] = email
            return JSONResponse(content={"message": "User updated", "user": user})
    raise HTTPException(status_code=404, detail="User not found")

# Delete a user
@user_router.delete("/delete_user/{user_id}")
async def delete_user(user_id: int):
    for user in users:
        if user["id"] == user_id:
            users.remove(user)
            return JSONResponse(content={"message": "User deleted"})
    raise HTTPException(status_code=404, detail="User not found")
