#!/bin/bash

# Script to update Next.js to the latest version

echo "Updating Next.js to the latest version..."

# Update Next.js
npm install next@latest react@latest react-dom@latest

# Check versions after update
echo "Updated versions:"
echo "Next.js: $(npm list next | grep next)"
echo "React: $(npm list react | grep react)"
echo "React DOM: $(npm list react-dom | grep react-dom)"

echo "Update complete! Please restart your development server." 