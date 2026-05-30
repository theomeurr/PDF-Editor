#!/usr/bin/env bash
export PATH="/opt/homebrew/bin:$PATH"
cd "$(dirname "$0")/../frontend"
exec npm run dev
