from fastapi import APIRouter, HTTPException, Request, status

from app.schemas.orders import OrderRequest, OrderResponse
from app.services.orders import ProductNotFoundError, create_order, get_user_orders

router = APIRouter(prefix="/api/orders", tags=["orders"])


def get_current_user(request: Request) -> dict:
    user = request.session.get("user")
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Войдите, чтобы продолжить")
    return user


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def place_order(data: OrderRequest, request: Request):
    user = get_current_user(request)
    try:
        return await create_order(user["id"], data)
    except ProductNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Некоторые товары больше недоступны, обновите корзину",
        )


@router.get("", response_model=list[OrderResponse])
async def list_orders(request: Request):
    user = get_current_user(request)
    return await get_user_orders(user["id"])
