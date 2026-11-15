from datetime import datetime

from app.schemas.orders import OrderRequest
from app.storage.json_store import read_json, write_json, write_lock


class ProductNotFoundError(Exception):
    pass


async def create_order(user_id: int, data: OrderRequest) -> dict:
    goods = await read_json("goods")
    goods_by_id = {product["id"]: product for product in goods}

    items = []
    for item in data.items:
        product = goods_by_id.get(item.id)
        if product is None:
            raise ProductNotFoundError
        items.append(
            {
                "id": product["id"],
                "name": product["name"],
                "price": product["price"],
                "quantity": item.quantity,
            }
        )

    total = sum(item["price"] * item["quantity"] for item in items)

    async with write_lock:
        orders = await read_json("orders")
        order = {
            "id": max((order["id"] for order in orders), default=0) + 1,
            "userId": user_id,
            "createdAt": datetime.now().isoformat(timespec="seconds"),
            **data.model_dump(mode="json", exclude={"items"}),
            "items": items,
            "total": total,
        }
        orders.append(order)
        await write_json("orders", orders)

    return order


async def get_user_orders(user_id: int) -> list[dict]:
    orders = await read_json("orders")
    user_orders = [order for order in orders if order["userId"] == user_id]
    return sorted(user_orders, key=lambda order: order["id"], reverse=True)
