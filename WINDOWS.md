# Déploiement sur Windows

Objectif : produire un **installeur Windows** (`PDF-Editor-Setup-1.0.0.exe`)
que vous distribuez ; les utilisateurs l'installent comme n'importe quelle app
classique (raccourci menu Démarrer + désinstalleur).

## Procédure

### Étape 1 — Une seule fois : préparer une machine Windows pour le *build*

**Option rapide (recommandée)** : double-cliquez sur **`install-prerequisites.bat`**
à la racine du projet. Le script installe automatiquement Python, Node.js,
Ghostscript, Inno Setup et Git via `winget` (gestionnaire de paquets intégré
à Windows 10/11). Fermez ensuite la fenêtre et ouvrez-en une nouvelle pour
que le PATH soit à jour.

**Option manuelle** : installez ces outils un par un :

| Outil | Lien | Note |
|-------|------|------|
| **Python 3.10+** | https://www.python.org/downloads/ | ✅ Cochez **« Add Python to PATH »** pendant l'installation |
| **Node.js LTS** | https://nodejs.org/ | Installation standard |
| **Ghostscript** | https://ghostscript.com/releases/gsdnld.html | Version **64-bit** |
| **Inno Setup 6+** | https://jrsoftware.org/isdl.php | Pour générer l'installeur |

### Étape 2 — Copier le projet sur Windows

Copiez tout le dossier **PDF Editor** (depuis votre Mac) vers la machine Windows
via USB, OneDrive, Google Drive, ou `git clone`.

> ⚠ Avant de copier, **supprimez** ces dossiers (ils seront recréés sur Windows) :
> `backend/.venv/`, `frontend/node_modules/`, `frontend/dist/`, `build/`, `dist/`

### Étape 3 — Builder l'exe

Sur la machine Windows, **double-cliquez sur `build-windows.bat`**.

Le script :
1. vérifie que Python / Node sont installés
2. crée l'environnement Python et installe les dépendances
3. build le frontend (`npm run build`)
4. lance PyInstaller pour packager le tout (mode onedir)
5. **détecte Inno Setup et compile l'installeur**

Au bout de quelques minutes, vous obtenez :

```
installer\output\PDF-Editor-Setup-1.0.0.exe   ← installeur à distribuer
dist\PDF-Editor\PDF-Editor.exe                ← version portable (dossier complet)
```

Si Inno Setup n'est pas détecté, seul le dossier portable est produit ; vous
pouvez ensuite ouvrir [`installer/pdf-editor.iss`](installer/pdf-editor.iss)
manuellement dans Inno Setup Compiler.

> Pour les détails de personnalisation de l'installeur (icône, bundling Ghostscript,
> version), voir [installer/README.md](installer/README.md).

### Étape 4 — Installer sur n'importe quel PC Windows

Distribuez `PDF-Editor-Setup-1.0.0.exe` à vos utilisateurs. Sur chaque PC :

1. (Une seule fois) installer **Ghostscript** :
   https://ghostscript.com/releases/gsdnld.html
   *(ou embarquez-le directement dans l'installeur — voir [installer/README.md](installer/README.md))*
2. Double-clic sur `PDF-Editor-Setup-1.0.0.exe` → wizard d'installation classique
3. Au premier lancement (raccourci menu Démarrer ou bureau), le navigateur s'ouvre tout seul

La désinstallation se fait via **Panneau de configuration → Applications**.

## Bundling Ghostscript

Voir [installer/README.md](installer/README.md#embarquer-ghostscript-dans-linstalleur)
pour livrer une version 100 % autonome (Ghostscript embarqué dans l'installeur).

## Dépannage

| Symptôme | Solution |
|----------|----------|
| `python n'est pas reconnu` | Python n'est pas dans le PATH — réinstallez Python en cochant « Add to PATH » |
| `Ghostscript non détecté` dans l'app | Installez Ghostscript ou placez `ghostscript/bin/gs.exe` à côté de l'exe |
| Le navigateur ne s'ouvre pas | Ouvrez manuellement `http://127.0.0.1:5001` |
| Le port 5001 est occupé | L'app prend automatiquement le prochain port libre — regardez la console |
| Windows SmartScreen bloque l'exe | Cliquez sur « Informations complémentaires » → « Exécuter quand même » (l'exe n'est pas signé) |

## Pour les autres OS

- **macOS** : `./start.sh` (voir [README.md](README.md))
- **Linux** : même procédure macOS — installez `python3`, `nodejs`, `ghostscript` via votre gestionnaire de paquets, puis `./start.sh`
