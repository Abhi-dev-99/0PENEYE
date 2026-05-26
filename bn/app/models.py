from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class MovieBase(BaseModel):
    title: str
    description: str
    image_url: str
    genre: str
    duration: str
    rating: str
    price: float


class MovieCreate(MovieBase):
    pass


class Movie(MovieBase):
    id: int
    booked_seats: List[str] = []

    class Config:
        from_attributes = True


class BookingBase(BaseModel):
    movie_id: int
    user_name: str
    user_email: str
    seats: List[str]
    total_amount: float


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    id: int
    payment_status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymentRequest(BaseModel):
    booking_id: int
