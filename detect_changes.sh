#!/bin/bash

# Fetch list of changed files
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

# Check if frontend application code changed
if echo "$CHANGED_FILES" | grep -E 'frontend/.*\.(js|ts|jsx|tsx|Dockerfile)'; then
  echo "Frontend code changed. Triggering frontend build..."
  echo "FRONTEND_BUILD=1" >> $GITHUB_ENV
fi

# Check if backend application code changed
if echo "$CHANGED_FILES" | grep -E 'backend/.*\.(py|Dockerfile)'; then
  echo "Backend code changed. Triggering backend build..."
  echo "BACKEND_BUILD=1" >> $GITHUB_ENV
fi

# Check if only Kubernetes YAML files changed
if echo "$CHANGED_FILES" | grep -E 'k8s/.*\.(yaml|yml)' && ! echo "$CHANGED_FILES" | grep -E 'frontend/|backend/|Dockerfile'; then
  echo "Only Kubernetes YAML files changed. Skipping build..."
  exit 1
fi
