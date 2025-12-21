import uuid

from backend.app.utils.logger import set_trace_id
from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import StreamingResponse


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        trace_id = str(uuid.uuid4())
        request.state.trace_id = trace_id
        set_trace_id(trace_id)

        # Paths to skip logging (healthchecks etc.)
        SKIP_LOG_PATHS = {"/api/v1/health", "/health", "/healthz"}
        path = request.url.path

        # If this is a healthcheck, don't read/preview bodies or log; still set trace header
        if path in SKIP_LOG_PATHS:
            response = await call_next(request)
            try:
                response.headers["X-Trace-Id"] = trace_id
            except Exception:
                pass
            return response

        # safe request body read
        req_body = b""
        try:
            req_body = await request.body()
        except Exception:
            req_body = b""

        # use a higher depth so loguru shows the original caller (route handler)
        logger.opt(depth=6).bind(trace_id=trace_id).info(
            "Incoming request: {} {} | Body preview ({}b): {}",
            request.method,
            request.url,
            len(req_body[:1024]),
            req_body[:1024],
        )

        response = await call_next(request)

        # If response is a streaming response, don't consume its iterator — only log headers/status
        if isinstance(response, StreamingResponse):
            logger.bind(trace_id=trace_id).info(
                "Response (streaming): {} | Headers: {}",
                response.status_code,
                dict(response.headers),
            )
            response.headers["X-Trace-Id"] = trace_id
            return response

        # otherwise try to read its body safely (supports async and sync iterators)
        response_body = b""
        body_iter = getattr(response, "body_iterator", None)
        try:
            if body_iter is not None:
                if hasattr(body_iter, "__aiter__"):
                    async for chunk in body_iter:
                        response_body += chunk
                else:
                    for chunk in body_iter:
                        response_body += chunk
            else:
                response_body = getattr(response, "body", b"") or b""
        except Exception:
            response_body = getattr(response, "body", b"") or b""

        preview = response_body[:2000]
        logger.opt(depth=6).bind(trace_id=trace_id).info(
            "Response: {} | Headers: {} | Body preview ({}b): {}",
            response.status_code,
            dict(response.headers),
            len(preview),
            preview,
        )

        new_headers = dict(response.headers)
        new_headers["X-Trace-Id"] = trace_id

        return Response(
            content=response_body,
            status_code=response.status_code,
            headers=new_headers,
            media_type=getattr(response, "media_type", None),
        )
