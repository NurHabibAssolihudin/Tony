#!/bin/sh
set -eu
cd /app
exec bun run dev "$@"
