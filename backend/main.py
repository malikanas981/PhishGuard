from fastapi import FastAPI

app = FastAPI(title="PhishGuard API")


@app.get("/")
def root():
    return {
        "message": "PhishGuard API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "PhishGuard API"
    }