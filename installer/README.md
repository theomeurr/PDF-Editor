# Installeur Inno Setup

Ce dossier contient tout ce qu'il faut pour produire un installeur Windows
**`PDF-Editor-Setup-1.0.0.exe`** distribuable.

## Le pipeline en deux options

### Option A — Tout-en-un (recommandé)

À la racine du projet, double-cliquez sur **`build-windows.bat`**.
Le script :

1. installe les dépendances Python et Node
2. build le frontend
3. lance PyInstaller (mode onedir → `dist\PDF-Editor\`)
4. **détecte Inno Setup et compile l'installeur** → `installer\output\PDF-Editor-Setup-1.0.0.exe`

### Option B — Manuel (si vous voulez voir le détail)

1. Lancez d'abord PyInstaller pour produire le bundle :
   ```
   pyinstaller --noconfirm pdf-editor.spec
   ```
   Cela crée `dist\PDF-Editor\PDF-Editor.exe` + dépendances.

2. Ouvrez `installer\pdf-editor.iss` dans **Inno Setup Compiler**
   ([télécharger](https://jrsoftware.org/isdl.php)).

3. Menu **Build → Compile** (ou F9). L'installeur sort dans `installer\output\`.

## Personnalisation

Tous les paramètres sont en haut de [`pdf-editor.iss`](pdf-editor.iss) :

```pascal
#define MyAppName      "PDF Editor"
#define MyAppVersion   "1.0.0"
#define MyAppPublisher "Theo Meurier"
#define MyAppURL       "https://github.com/theomeurr/PDF-Editor"
#define MyAppExeName   "PDF-Editor.exe"
```

⚠ **Ne changez jamais `AppId`** : c'est l'identifiant unique utilisé par
Windows pour gérer les mises à jour et le désinstalleur.

## Icône (optionnel)

Placez un fichier `icon.ico` (256×256 recommandé) dans ce dossier (`installer/`).
- PyInstaller l'utilisera pour `PDF-Editor.exe`
- Inno Setup l'utilisera pour `setup.exe` et le raccourci d'installation

Si vous n'avez pas d'icône, **commentez** la ligne `SetupIconFile=icon.ico`
dans [`pdf-editor.iss`](pdf-editor.iss). PyInstaller fonctionne aussi sans.

## Embarquer Ghostscript dans l'installeur

Pour livrer une version 100 % autonome (l'utilisateur n'a plus rien à installer) :

1. Installez Ghostscript 64-bit sur votre machine de build
2. Copiez tout le dossier (souvent `C:\Program Files\gs\gs10.04.0\`)
   dans `installer\ghostscript\`. Vous devez obtenir :
   ```
   installer/ghostscript/
       bin/
           gswin64c.exe
           gsdll64.dll
           ...
       lib/
           ...
       Resource/
   ```
3. **Renommez `gswin64c.exe` en `gs.exe`** (le code Python cherche `gs`)
4. Dans [`pdf-editor.iss`](pdf-editor.iss), **décommentez** la ligne :
   ```pascal
   ; Source: "ghostscript\*"; DestDir: "{app}\ghostscript"; Flags: ignoreversion recursesubdirs createallsubdirs
   ```
5. Recompilez

> **Licence** : Ghostscript est sous AGPL. Pour un usage privé / interne, aucun
> souci. Pour une redistribution publique, vous devez fournir les sources avec.

## Vérifier l'installeur

Après build, double-cliquez sur `installer\output\PDF-Editor-Setup-1.0.0.exe` :

- Wizard d'installation (français / anglais)
- Choix du dossier (`Program Files` ou utilisateur)
- Création des raccourcis menu Démarrer + bureau (optionnel)
- Si Ghostscript n'est pas détecté, l'installeur le signale mais autorise l'install
- Désinstalleur dans le panneau de configuration Windows

## Structure produite

```
C:\Program Files\PDF Editor\
├── PDF-Editor.exe          ← le launcher
├── _internal\              ← bibliothèques Python embarquées
├── ghostscript\            ← (si bundle activé)
├── README.md
└── unins000.exe            ← désinstalleur
```
