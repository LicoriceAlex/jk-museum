# Makefile

MSG ?= $(word 2,$(MAKECMDGOALS))
COMPOSE ?= docker-compose
TEST_COMPOSE ?= docker-compose -f docker-compose.test.yml
BACKEND_DIR ?= ./backend
UV_RUN ?= uv run

# avoid make treating the message as a real target
%:
	@:

# HOWTO GENERATE MIGRATIONS FILE
.PHONY: db-up
db-up:
	$(COMPOSE) up -d db

.PHONY: dev-up
dev-up:
	$(COMPOSE) up -d --build

.PHONY: migration
migration:
	@if [ -z "$(MSG)" ]; then echo "ERROR: MSG is empty. Usage: make migration \"Your migrate message\" or make migration \"Your message\""; exit 1; fi
	$(COMPOSE) run --rm --build migrations alembic revision --autogenerate -m "$(MSG)"

# HOWTO RUN TESTS
.PHONY: tests
tests:
	$(TEST_COMPOSE) up -d --no-deps --build

.PHONY: lint
lint:
	cd $(BACKEND_DIR) && uv run ruff check --fix

.PHONY: format
format:
	cd $(BACKEND_DIR) && uv run ruff format
