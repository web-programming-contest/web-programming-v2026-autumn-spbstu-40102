from fastapi import APIRouter, HTTPException, Request, Response, status

from app.schemas.auth import LoginRequest, UserResponse
from app.services.auth import authenticate

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/login", response_model=UserResponse)
async def login(data: LoginRequest, request: Request):
    user = await authenticate(data.login, data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Такого пользователя нет, возможно неправильный логин или пароль — проверьте данные",
        )
    request.session["user"] = user
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(request: Request):
    request.session.clear()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserResponse | None)
async def me(request: Request):
    return request.session.get("user")
