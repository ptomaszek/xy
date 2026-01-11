#!/bin/zsh

# Check if Docker is running, if not start it
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Starting Docker..."
    sudo systemctl start docker
    # Wait a moment for Docker to start
    sleep 3
fi

# Restart Docker containers
docker-compose down && docker-compose up --build -d
