from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.api import auth, academic, misconceptions, career, jobshield, journey, realtime
from seed import seed_database

# Initialize Database Schema & Seed Data
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Seed note: {e}")

app = FastAPI(
    title="Student Success & Career Intelligence API",
    description="CRYPTORA '26 Hackathon Integrated Platform connecting Academic Intelligence, Misconception Hunter, Career Compass, and JobShield.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
v1_prefix = "/api/v1"
app.include_router(auth.router, prefix=v1_prefix)
app.include_router(academic.router, prefix=v1_prefix)
app.include_router(misconceptions.router, prefix=v1_prefix)
app.include_router(career.router, prefix=v1_prefix)
app.include_router(jobshield.router, prefix=v1_prefix)
app.include_router(journey.router, prefix=v1_prefix)
app.include_router(realtime.router, prefix=v1_prefix)

@app.get("/")
def read_root():
    return {
        "title": "Student Success & Career Intelligence API",
        "version": "1.0.0",
        "tagline": "Learn Better. Build Your Future. Apply Safely.",
        "status": "online",
        "docs": "/docs",
        "demo_mode": True
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "demo_mode": True}
