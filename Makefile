# Makefile

MSG ?= $(word 2,$(MAKECMDGOALS))
COMPOSE ?= docker-compose
TEST_COMPOSE ?= docker-compose -f docker-compose.test.yml

.PHONY: db-up migrations migration tests

# avoid make treating the message as a real target
%:
	@:

# HOWTO GENERATE MIGRATIONS FILE
db-up:
	$(COMPOSE) up -d db

dev-up:
	$(COMPOSE) up -d --build

migration:
	@if [ -z "$(MSG)" ]; then echo "ERROR: MSG is empty. Usage: make migration \"Your migrate message\" or make migration \"Your message\""; exit 1; fi
	$(COMPOSE) run --rm --build migrations alembic revision --autogenerate -m "$(MSG)"

# HOWTO RUN TESTS
tests:
	$(TEST_COMPOSE) up -d --no-deps --build