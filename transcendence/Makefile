SHELL := /bin/bash
COMPOSE := docker-compose

up:
	${COMPOSE} up -d --build

down:
	${COMPOSE} down

logs:
	${COMPOSE} logs -f

restart:
	${COMPOSE} down
	${COMPOSE} up -d --build

ps:
	${COMPOSE} ps

rebuild:
	${COMPOSE} build --no-cache

