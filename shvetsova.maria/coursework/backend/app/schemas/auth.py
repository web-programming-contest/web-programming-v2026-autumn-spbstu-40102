from typing import Annotated
from pydantic import BaseModel, StringConstraints

NonEmptyString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class LoginRequest(BaseModel):
    login: NonEmptyString
    password: NonEmptyString


class UserResponse(BaseModel):
    id: int
    login: str
    name: str
