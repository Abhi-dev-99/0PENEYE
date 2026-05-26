from fastapi import APIRouter, HTTPException
from typing import List
import httpx
from app.database import get_client
from app.models import Movie

router = APIRouter(prefix="/movies", tags=["movies"])


@router.get("/", response_model=List[Movie])
async def get_movies(search: str = ""):
    async with get_client() as client:
        params = {"select": "*"}
        if search:
            params["title"] = f"ilike.*{search}*"
        response = await client.get("/movies", params=params)
        response.raise_for_status()
        return response.json()


@router.get("/{movie_id}", response_model=Movie)
async def get_movie(movie_id: int):
    async with get_client() as client:
        params = {"select": "*", "id": f"eq.{movie_id}"}
        response = await client.get("/movies", params=params)
        response.raise_for_status()
        data = response.json()
        if not data:
            raise HTTPException(status_code=404, detail="Movie not found")
        return data[0]
