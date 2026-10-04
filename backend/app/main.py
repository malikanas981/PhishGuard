from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.db.session import Base, engine
from app import models


app = FastAPI(
    title="PhishGuard API",
    description="Phishing URL Detection and Cybersecurity Awareness Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "https://phish-guard-dun.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "PhishGuard API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PhishGuard API",
    }