#!/bin/bash
# check-creds.sh - List all stored credentials
# Usage: ./check-creds.sh [search-term]

ENV_FILE="$HOME/.clawdbot/.env"
SEARCH="$1"

echo "🔑 STORED CREDENTIALS"
echo "====================="
echo ""

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ No .env file found at $ENV_FILE"
    exit 1
fi

if [ -n "$SEARCH" ]; then
    echo "Searching for: $SEARCH"
    echo "---"
    grep -i "$SEARCH" "$ENV_FILE" | sed 's/=.*/=***/' 
else
    echo "Available keys (values hidden):"
    echo "---"
    grep -v "^#" "$ENV_FILE" | grep -v "^$" | sed 's/=.*/=***/'
fi

echo ""
echo "📍 File location: $ENV_FILE"
echo "💡 To see full values: cat $ENV_FILE"
