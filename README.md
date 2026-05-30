# PDF Editor — local

Alternative privée à ILovePDF. Fusionner et compresser des PDF sur votre machine.
Vos fichiers ne quittent jamais votre ordinateur.

## Prérequis

Trois dépendances système à installer une seule fois.

### 1. Homebrew (si vous ne l'avez pas)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Ghostscript + Node.js

```bash
brew install ghostscript node
```

Python 3.9+ est déjà fourni par macOS — rien à faire.

## Lancement

À la racine du projet :

```bash
./start.sh
```

Au premier démarrage, le script crée le venv Python, installe les paquets npm,
puis lance le backend (Flask, port 5001) et le frontend (Vite, port 5173).

Ouvrez ensuite : **http://127.0.0.1:5173**

## Structure

```
.
├── backend/         # Flask + pypdf + Ghostscript
│   ├── app.py
│   └── requirements.txt
├── frontend/        # React + Vite + Tailwind
│   └── src/
└── start.sh         # Lance back + front
```

## Fonctionnalités

- **Fusion** : combine plusieurs PDF, réorganisation par glisser ou avec les flèches.
- **Compression** : quatre niveaux (écran / ebook / impression / prépresse) via Ghostscript.

## Lancement manuel (sans script)

Backend :
```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python app.py
```

Frontend (dans un autre terminal) :
```bash
cd frontend
npm install
npm run dev
```

## Déployer sur un autre PC (Windows)

Pour distribuer l'app sous forme d'**installeur Windows** classique
(`PDF-Editor-Setup-1.0.0.exe`) avec raccourcis menu Démarrer + bureau et
désinstalleur : voir [WINDOWS.md](WINDOWS.md) et [installer/README.md](installer/README.md).

## Vie privée

- Aucune communication réseau hors de `127.0.0.1`.
- Les PDF sont traités en mémoire ou dans `/tmp` et supprimés immédiatement après usage.
- Aucun journal de fichier.
