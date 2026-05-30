#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# S'assurer que Homebrew (Ghostscript, Node) est dans le PATH
if [ -x /opt/homebrew/bin/brew ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [ -x /usr/local/bin/brew ]; then
  eval "$(/usr/local/bin/brew shellenv)"
fi

if [ ! -d backend/.venv ]; then
  echo "→ Création de l'environnement Python…"
  python3 -m venv backend/.venv
  backend/.venv/bin/pip install --upgrade pip
  backend/.venv/bin/pip install -r backend/requirements.txt
fi

if [ ! -d frontend/node_modules ]; then
  echo "→ Installation des paquets Node…"
  (cd frontend && npm install)
fi

echo "→ Démarrage du backend (Flask) sur http://127.0.0.1:5001"
backend/.venv/bin/python backend/app.py &
BACK_PID=$!

cleanup() {
  echo "→ Arrêt…"
  kill $BACK_PID 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "→ Démarrage du frontend (Vite) sur http://127.0.0.1:5173"
(cd frontend && npm run dev)
