# API v1 routers
from fastapi import APIRouter, status
import time
from core.config import settings

router = APIRouter()
BOOT_TS = time.time()

@router.get("/healthz", status_code=status.HTTP_200_OK)
def healthz():
    return {"status": "ok", "version": "v1", "uptime": round(time.time() - BOOT_TS, 2)}

@router.get("/readyz", status_code=status.HTTP_200_OK)
def readyz():
    ok = True
    reasons: list[str] = []

    if not settings.SHARED_SECRET:
        ok = False; reasons.append("missing_shared_secret")

    return {
        "ready": ok,
        "reasons": reasons,
        "required": {
            "allowlist_hosts": settings.ALLOWLIST_HOSTS,
        },
    }
