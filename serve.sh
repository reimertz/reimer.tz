#!/usr/bin/env bash

# Simple static file server launcher
# Tries multiple server options in order of preference

PORT="${1:-8000}"

echo "Starting server on http://localhost:$PORT"
echo "Press Ctrl+C to stop"
echo ""

# Try Python 3 first (most common)
if command -v python3 &> /dev/null; then
  echo "Using Python 3..."
  python3 -m http.server "$PORT"
  exit 0
fi

# Try Python 2 fallback
if command -v python &> /dev/null; then
  echo "Using Python 2..."
  python -m SimpleHTTPServer "$PORT"
  exit 0
fi

# Try PHP
if command -v php &> /dev/null; then
  echo "Using PHP..."
  php -S "localhost:$PORT"
  exit 0
fi

# Try Node.js http-server
if command -v npx &> /dev/null; then
  echo "Using Node.js http-server..."
  npx --yes http-server -p "$PORT" -c-1
  exit 0
fi

echo "Error: No suitable server found!"
echo "Please install one of: python3, python, php, or node.js"
exit 1
