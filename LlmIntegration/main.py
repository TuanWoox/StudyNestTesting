# Main FastAPI application entry point
from fastapi import FastAPI
from core.config import settings
from core.logging import setup_logging
from core.middleware import RequestIdMiddleware
from api.v1.routers import router as v1_router

def create_app() -> FastAPI:
    setup_logging(settings.LOG_LEVEL)
    app = FastAPI(title="LLM Quiz Service", version="1.0.0")
    app.add_middleware(RequestIdMiddleware)

    # Mount API v1
    app.include_router(v1_router)

    return app

app = create_app()
