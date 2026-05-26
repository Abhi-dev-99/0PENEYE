from fastapi import APIRouter, HTTPException, Header
from typing import List, Optional
import httpx
from app.database import get_client
from app.models import Booking, Movie

router = APIRouter(prefix="/admin", tags=["admin"])

ADMIN_SECRET = "admin123"  # In production, use env variable


def verify_admin(authorization: Optional[str] = Header(None)):
    if authorization != f"Bearer {ADMIN_SECRET}":
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("/bookings", response_model=List[Booking])
async def get_all_bookings(authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    async with get_client() as client:
        response = await client.get("/bookings", params={"select": "*"})
        response.raise_for_status()
        return response.json()


@router.get("/movies-with-bookings")
async def get_movies_with_bookings(authorization: Optional[str] = Header(None)):
    verify_admin(authorization)
    async with get_client() as client:
        movies_resp = await client.get("/movies", params={"select": "*"})
        bookings_resp = await client.get("/bookings", params={"select": "*"})
        movies_resp.raise_for_status()
        bookings_resp.raise_for_status()

        movies = movies_resp.json() or []
        bookings = bookings_resp.json() or []

        result = []
        for movie in movies:
            movie_bookings = [b for b in bookings if b["movie_id"] == movie["id"]]
            result.append({
                "movie": movie,
                "bookings": movie_bookings,
                "total_revenue": sum(b["total_amount"] for b in movie_bookings if b["payment_status"] == "paid")
            })
        return result
