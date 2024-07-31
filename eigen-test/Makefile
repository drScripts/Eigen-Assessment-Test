start:
	docker compose -f ./deployments/docker-compose.yaml -p eigen up -d
build:
	docker compose -f ./deployments/docker-compose.yaml -p eigen build
start-dep:
	docker compose -f ./deployments/docker-compose.yaml -p eigen up mysql phpmyadmin -d
down:
	docker compose -f ./deployments/docker-compose.yaml -p eigen down -v