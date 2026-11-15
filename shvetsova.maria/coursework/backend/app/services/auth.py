from app.storage.json_store import read_json


async def authenticate(login: str, password: str) -> dict | None:
    users = await read_json("users")
    for user in users:
        if user["login"] == login and user["password"] == password:
            return {
                "id": user["id"],
                "login": user["login"],
                "name": user["name"]
            }
    return None
