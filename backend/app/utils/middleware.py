from loguru import logger
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from backend.app.utils.logger import set_trace_id

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        trace_id = str(uuid.uuid4())
        request.state.trace_id = trace_id
        set_trace_id(trace_id)

        body = await request.body()
        logger.info(f"[{trace_id}] Incoming request: {request.method} {request.url} | Body: {body}")

        response = await call_next(request)

        response_body = b""
        async for chunk in response.body_iterator:
            response_body += chunk

        logger.info(f"[{trace_id}] Response: {response.status_code} | Headers: {response.headers} | Body: {response_body}")

        new_response = Response(
            content=response_body,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.media_type
        )
        new_response.headers["X-Trace-Id"] = trace_id
        return new_response