from enum import Enum
from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints, model_validator

PhoneStr = Annotated[str, StringConstraints(strip_whitespace=True, pattern=r"^\+?[\d\s()-]{10,}$")]
EmailStr = Annotated[str, StringConstraints(strip_whitespace=True, pattern=r"^$|^[^\s@]+@[^\s@]+\.[^\s@]+$")]
TrimmedStr = Annotated[str, StringConstraints(strip_whitespace=True)]


class DeliveryType(str, Enum):
    pickup = "pickup"
    delivery = "delivery"


class PaymentType(str, Enum):
    card = "card"
    cash = "cash"


class OrderItemRequest(BaseModel):
    id: int
    quantity: int = Field(ge=1, le=99)


class OrderRequest(BaseModel):
    phone: PhoneStr
    email: EmailStr = ""
    delivery: DeliveryType
    address: TrimmedStr = ""
    payment: PaymentType
    packaging: bool = False
    items: list[OrderItemRequest] = Field(min_length=1)

    @model_validator(mode="after")
    def check_address(self):
        if self.delivery == DeliveryType.delivery and not self.address:
            raise ValueError("Укажите адрес доставки")
        if self.delivery == DeliveryType.pickup:
            self.address = ""
        return self


class OrderItem(BaseModel):
    id: int
    name: str
    price: int
    quantity: int


class OrderResponse(BaseModel):
    id: int
    createdAt: str
    phone: str
    email: str
    delivery: DeliveryType
    address: str
    payment: PaymentType
    packaging: bool
    items: list[OrderItem]
    total: int
