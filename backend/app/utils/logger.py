import contextvars
from loguru import logger
import sys

trace_id_var = contextvars.ContextVar("trace_id", default=None)


def set_trace_id(trace_id):
    trace_id_var.set(trace_id)


def get_trace_id():
    return trace_id_var.get()


def log_method_call(func):
    from functools import wraps

    @wraps(func)
    async def wrapper(*args, **kwargs):
        trace_id = get_trace_id()
        logger.info(
            f"[{trace_id}] Call: {func.__name__} args={args} kwargs={kwargs}")
        result = await func(*args, **kwargs)
        logger.info(f"[{trace_id}] Result: {func.__name__} -> {result}")
        return result
    return wrapper
