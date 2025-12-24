# Makefile

MSG ?= $(word 2,$(MAKECMDGOALS))
COMPOSE ?= docker-compose
TEST_COMPOSE ?= docker-compose -f docker-compose.test.yml
<<<<<<< HEAD

.PHONY: db-up migrations migration tests
=======
BACKEND_DIR ?= ./backend
UV_RUN ?= uv run
>>>>>>> origin/main

# avoid make treating the message as a real target
%:
	@:

# HOWTO GENERATE MIGRATIONS FILE
<<<<<<< HEAD
db-up:
	$(COMPOSE) up -d db

dev-up:
	$(COMPOSE) up -d --build

=======
.PHONY: db-up
db-up:
	$(COMPOSE) up -d db

.PHONY: dev-up
dev-up:
	$(COMPOSE) up -d --build

.PHONY: migration
>>>>>>> origin/main
migration:
	@if [ -z "$(MSG)" ]; then echo "ERROR: MSG is empty. Usage: make migration \"Your migrate message\" or make migration \"Your message\""; exit 1; fi
	$(COMPOSE) run --rm --build migrations alembic revision --autogenerate -m "$(MSG)"

# HOWTO RUN TESTS
<<<<<<< HEAD
tests:
	$(TEST_COMPOSE) up -d --no-deps --build
=======
.PHONY: tests
tests:
	$(TEST_COMPOSE) up -d --no-deps --build

.PHONY: lint
lint:
	cd $(BACKEND_DIR) && uv run ruff check --fix

.PHONY: format
format:
	cd $(BACKEND_DIR) && uv run ruff format
>>>>>>> origin/main
