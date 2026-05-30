# Déploiement sur Windows (.exe)

Objectif : produire un **`PDF-Editor.exe`** que vous (ou n'importe quel utilisateur)
double-cliquez pour lancer l'application. Pas de terminal, pas de configuration.

## Procédure

### Étape 1 — Une seule fois : préparer une machine Windows pour le *build*

Installez ces trois outils sur la machine Windows qui fera le build :

| Outil | Lien | Note |
|-------|------|------|
| **Python 3.10+** | https://www.python.org/downloads/ | ✅ Cochez **« Add Python to PATH »** pendant l'installation |
| **Node.js LTS** | https://nodejs.org/ | Installation standard |
| **Ghostscript** | https://ghostscript.com/releases/gsdnld.html | Version **64-bit** |

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
4. lance PyInstaller pour packager le tout

Au bout de quelques minutes, vous obtenez :

```
dist\PDF-Editor.exe
```

### Étape 4 — Utiliser l'exe sur n'importe quel PC Windows

Copiez **`PDF-Editor.exe`** où vous voulez. Pour le lancer :

1. (Une seule fois sur chaque PC) installez **Ghostscript** :
   https://ghostscript.com/releases/gsdnld.html
2. Double-clic sur `PDF-Editor.exe`
3. Le navigateur s'ouvre automatiquement sur `http://127.0.0.1:5001`

Pour arrêter l'application, fermez la fenêtre console qui s'est ouverte.

## Bundling Ghostscript dans l'exe (optionnel, avancé)

Si vous voulez éviter d'installer Ghostscript sur chaque PC, vous pouvez livrer
une version *portable* :

1. Téléchargez Ghostscript et installez-le sur la machine Windows
2. Copiez le dossier d'installation (généralement `C:\Program Files\gs\gs10.xx\`)
   à côté de `PDF-Editor.exe` en le renommant `ghostscript/` :
   ```
   PDF-Editor.exe
   ghostscript/
       bin/
           gswin64c.exe
           …
   ```
3. ⚠ Renommez `gswin64c.exe` en `gs.exe` (le code cherche `gs`)
4. Distribuez le dossier entier (par exemple sous forme de `.zip`)

> Note licence : Ghostscript est en **AGPL**. La redistribution est libre tant
> que vous fournissez les sources de Ghostscript avec — ce qui est facile en
> incluant simplement l'installeur officiel. Pour usage personnel privé, aucun
> souci.

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
