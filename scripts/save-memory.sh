#!/bin/bash

# save-memory.sh - Easy memory saving wrapper
# Usage:
#   save-memory.sh daily "what happened"
#   save-memory.sh longterm "lesson learned" "Category Name"
#   save-memory.sh project project-name "update text"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORKSPACE="$(dirname "$SCRIPT_DIR")"
HELPER="$WORKSPACE/helpers/memory-saver.js"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if helper exists
if [ ! -f "$HELPER" ]; then
  echo -e "${RED}❌ Error: memory-saver.js not found at $HELPER${NC}"
  exit 1
fi

# Pass all arguments to the helper
node "$HELPER" "$@"
