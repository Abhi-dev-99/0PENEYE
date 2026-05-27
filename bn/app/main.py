from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import movies, bookings, admin

app = FastAPI(title="Movie Ticket Booking API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(bookings.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"message": "Movie Ticket Booking API is running"}
