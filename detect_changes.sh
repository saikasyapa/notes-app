#!/bin/bash

echo "Detecting changed files..."
CHANGED_FILES=$(git diff --name-only HEAD~1 || git ls-files -m)

# Ensure env.sh is created
echo "Creating env.sh..."
echo "" > env.sh

# Check if frontend code changed
if echo "$CHANGED_FILES" | grep -E 'frontend/.*\.(js|ts|jsx|tsx|Dockerfile)'; then
  echo "Frontend code changed. Triggering frontend build..."
  echo "FRONTEND_BUILD=1" >> env.sh
else
  echo "FRONTEND_BUILD=0" >> env.sh
fi

# Check if backend code changed
if echo "$CHANGED_FILES" | grep -E 'backend/.*\.(py|Dockerfile)'; then
  echo "Backend code changed. Triggering backend build..."
  echo "BACKEND_BUILD=1" >> env.sh
else
  echo "BACKEND_BUILD=0" >> env.sh
fi

# Check if only Kubernetes YAML files changed
if echo "$CHANGED_FILES" | grep -E 'k8s/.*\.(yaml|yml)' && ! echo "$CHANGED_FILES" | grep -E 'frontend/|backend/|Dockerfile'; then
  echo "Only Kubernetes YAML files changed. Skipping build..."
  exit 1
fi

# Verify env.sh exists before exiting
if [ ! -f env.sh ]; then
  echo "Error: env.sh was not created!"
  exit 1
fi

echo "Environment variables updated successfully!"
