# Сборка зависимостей
FROM python:3.12-slim AS builder
WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:0.4.15 /uv /bin/uv

ENV PATH="/app/.venv/bin:$PATH"
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Копируем только файлы зависимостей
COPY backend/pyproject.toml backend/uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project

# Копируем код приложения
COPY backend/app /app/backend/app
COPY migrations /app/migrations
COPY .env /app/

# Миграции
FROM python:3.12-slim AS migrations
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/migrations /app/migrations
COPY --from=builder /app/.env /app/.env
COPY migrations/alembic.ini /app/migrations/alembic.ini

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app:/app/backend"
ENV ALEMBIC_CONFIG=/app/migrations/alembic.ini
CMD ["alembic", "upgrade", "head"]

# Development
FROM python:3.12-slim AS dev
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/migrations /app/migrations
COPY --from=builder /app/.env /app/.env

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app:/app/backend"
ENV ALEMBIC_CONFIG=/app/migrations/alembic.ini
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# Production
FROM python:3.12-slim AS prod
WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/.env /app/.env

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app:/app/backend"
ENV ALEMBIC_CONFIG=/app/migrations/alembic.ini
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]


# Tests
FROM python:3.12-slim AS test
WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.venv /app/.venv

COPY backend /app/backend
COPY tests /app/tests
COPY .env /app/
COPY pytest.ini /app/

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app:/app/backend"
CMD ["pytest", "-v", "/app/tests"]