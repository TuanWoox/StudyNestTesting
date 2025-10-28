import time, uuid, structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

log = structlog.get_logger()

class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        rid = request.headers.get("x-request-id") or str(uuid.uuid4())
        structlog.contextvars.bind_contextvars(requestId=rid, path=request.url.path)
        start = time.perf_counter()
        try:
            response: Response = await call_next(request)
            return response
        finally:
            latency_ms = round((time.perf_counter() - start) * 1000, 2)
            log.info(
                "access",
                method=request.method,
                statusCode=getattr(locals().get("response", None), "status_code", 500),
                latencyMs=latency_ms,
            )
