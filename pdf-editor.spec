# PyInstaller spec — mode "onedir" (un dossier dist/PDF-Editor/ que Inno Setup empaquète).
# Usage : pyinstaller pdf-editor.spec

from pathlib import Path

block_cipher = None
ROOT = Path(SPECPATH).resolve()

# Icône optionnelle : si installer/icon.ico existe on l'utilise, sinon icône par défaut
icon_path = ROOT / 'installer' / 'icon.ico'
icon_arg = str(icon_path) if icon_path.exists() else None

a = Analysis(
    ['backend/launcher.py'],
    pathex=[str(ROOT / 'backend')],
    binaries=[],
    datas=[
        # On embarque le frontend buildé dans le bundle
        (str(ROOT / 'frontend' / 'dist'), 'frontend/dist'),
    ],
    hiddenimports=['app'],
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='PDF-Editor',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=False,             # pas de fenêtre console — pure double-clic
    disable_windowed_traceback=False,
    icon=icon_arg,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,
    upx_exclude=[],
    name='PDF-Editor',
)
