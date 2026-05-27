from fastapi import APIRouter, HTTPException
import httpx
from app.database import get_client
from app.models import BookingCreate, Booking, PaymentRequest

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=Booking)
async def create_booking(booking: BookingCreate):
    async with get_client() as client:
        # Check if movie exists
        try:
            movie_resp = await client.get("/movies", params={
                "select": "*",
                "id": f"eq.{booking.movie_id}"
            })
            movie_resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Supabase movies error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Movies request failed: {str(e)}")

        movies = movie_resp.json()
        if not movies:
            raise HTTPException(status_code=404, detail="Movie not found")

        movie = movies[0]
        booked_seats = movie.get("booked_seats") or []

        for seat in booking.seats:
            if seat in booked_seats:
                raise HTTPException(status_code=400, detail=f"Seat {seat} is already booked")

        # Create booking
        booking_data = booking.model_dump()
        booking_data["payment_status"] = "pending"

        try:
            response = await client.post("/bookings", json=booking_data)
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Supabase bookings error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Bookings request failed: {str(e)}")

        data = response.json()
        if not data:
            raise HTTPException(status_code=500, detail="Failed to create booking")
        return data[0]


@router.post("/payment")
async def process_payment(payment: PaymentRequest):
    async with get_client() as client:
        # Get booking
        try:
            booking_resp = await client.get("/bookings", params={
                "select": "*",
                "id": f"eq.{payment.booking_id}"
            })
            booking_resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Supabase error: {e.response.text}")

        bookings = booking_resp.json()
        if not bookings:
            raise HTTPException(status_code=404, detail="Booking not found")

        booking = bookings[0]

        # Update booking status
        await client.patch(
            "/bookings",
            params={"id": f"eq.{payment.booking_id}"},
            json={"payment_status": "paid"}
        )

        # Update movie booked_seats
        try:
            movie_resp = await client.get("/movies", params={
                "select": "*",
                "id": f"eq.{booking['movie_id']}"
            })
            movie_resp.raise_for_status()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=500, detail=f"Supabase error: {e.response.text}")

        movie = movie_resp.json()[0]
        current_booked = movie.get("booked_seats") or []
        new_booked = list(set(current_booked + booking["seats"]))

        await client.patch(
            "/movies",
            params={"id": f"eq.{booking['movie_id']}"},
            json={"booked_seats": new_booked}
        )

        return {"message": "Payment successful", "booking_id": payment.booking_id}
