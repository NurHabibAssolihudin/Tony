#!/bin/sh
set -eu

# Mirror scripts/dev.cjs defaults
LETTA_DEBUG="${LETTA_DEBUG:-1}"
export LETTA_DEBUG

# The agent's project working directory (mount user dirs here).
cd "${TONY_WORKSPACE_DIR:-/workspace}"

# Run the source directly (absolute path) so module resolution uses
# /app/node_modules while process.cwd() stays on the workspace.
exec bun \
  --loader=.md:text \
  --loader=.mdx:text \
  --loader=.txt:text \
  run /app/src/index.ts "$@"
