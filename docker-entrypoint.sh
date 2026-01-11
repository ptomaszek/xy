#!/bin/sh
set -e

# Install dependencies if node_modules is empty
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the command passed to the container
exec "$@"
