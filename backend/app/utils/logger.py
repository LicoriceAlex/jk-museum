import logging
import contextvars
import inspect
import asyncio
from loguru import logger
import sys

# trace_id context variable must exist before we configure the sink
trace_id_var = contextvars.ContextVar("trace_id", default=None)

# Configure logger to include trace_id from contextvar when present
logger.remove()


def _inject_trace_id(record):
    try:
        record["extra"].setdefault("trace_id", trace_id_var.get())
    except Exception:
        pass
    return True


# Older versions of loguru may not support `patch`; use `filter` to mutate record
logger.add(
    sys.stderr,
    format="{level: <8} | trace_id={extra[trace_id]!s} | {name}:{function}:{line} - {message}",
    filter=_inject_trace_id,
)

# Redirect standard library logging (and other libraries that use it) into loguru


class InterceptHandler(logging.Handler):
    """Intercept standard library logs and redirect them to loguru."""

    def emit(self, record: logging.LogRecord) -> None:  # pragma: no cover - thin wrapper
        try:
            # Get corresponding Loguru level if it exists
            level = logger.level(record.levelname).name
        except Exception:
            level = record.levelno
        # Find caller from where the logging call was made
        logger.opt(depth=6, exception=record.exc_info).log(
            level, record.getMessage())


# Install InterceptHandler as the handler for the stdlib logging
logging.basicConfig(handlers=[InterceptHandler()], level=0)

# Silence or reduce verbosity of noisy third-party loggers
NOISY_LOGGERS = [
    "uvicorn.access",
    "uvicorn.error",
    "sqlalchemy.engine",
    "asyncio",
]
for name in NOISY_LOGGERS:
    lg = logging.getLogger(name)
    lg.handlers = [InterceptHandler()]
    lg.setLevel(logging.WARNING)

# If you want to completely disable a logger instead of routing it, you can do:
# logging.getLogger('uvicorn.access').disabled = True


def set_trace_id(trace_id):
    trace_id_var.set(trace_id)


def get_trace_id():
    return trace_id_var.get()


def log_method_call(func):
    """Декоратор для логирования вызовов функций/методов.

    Поддерживает sync и async функции. В лог добавляется:
    - trace_id из contextvar
    - имя функции
    - место определения функции (файл:строка)
    - место вызова (caller файл:строка)
    - аргументы и результат
    """
    from functools import wraps

    def _get_def_location(f):
        try:
            file = inspect.getsourcefile(f) or f.__module__
            line = getattr(f, "__code__", None) and f.__code__.co_firstlineno
            return f"{file}:{line}"
        except Exception:
            return f.__name__

    def _get_caller_location():
        # stack[0] - this frame, stack[1] - wrapper, stack[2] - caller
        try:
            stack = inspect.stack()
            if len(stack) > 2:
                frame = stack[2]
            elif len(stack) > 1:
                frame = stack[1]
            else:
                frame = stack[0]
            return f"{frame.filename}:{frame.lineno}"
        finally:
            # avoid reference cycles
            del stack

    @wraps(func)
    async def _async_wrapper(*args, **kwargs):
        trace_id = get_trace_id()
        def_loc = _get_def_location(func)
        caller_loc = _get_caller_location()
        # use opt(depth=1) so loguru attributes (file/line) point to caller
        logger.opt(depth=1).info(
            f"[{trace_id}] Call {func.__name__} defined_at={def_loc} called_from={caller_loc} args={args} kwargs={kwargs}"
        )
        result = await func(*args, **kwargs)
        logger.opt(depth=1).info(
            f"[{trace_id}] Result {func.__name__} -> {result}")
        return result

    @wraps(func)
    def _sync_wrapper(*args, **kwargs):
        trace_id = get_trace_id()
        def_loc = _get_def_location(func)
        caller_loc = _get_caller_location()
        logger.opt(depth=1).info(
            f"[{trace_id}] Call {func.__name__} defined_at={def_loc} called_from={caller_loc} args={args} kwargs={kwargs}"
        )
        result = func(*args, **kwargs)
        logger.opt(depth=1).info(
            f"[{trace_id}] Result {func.__name__} -> {result}")
        return result

    if asyncio.iscoroutinefunction(func):
        return _async_wrapper
    return _sync_wrapper
