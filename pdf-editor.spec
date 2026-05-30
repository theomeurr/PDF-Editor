# PyInstaller spec — produit dist/PDF-Editor.exe
# Usage : pyinstaller pdf-editor.spec

from pathlib import Path

block_cipher = None
ROOT = Path(SPECPATH).resolve()

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
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='PDF-Editor',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    runtime_tmpdir=None,
    console=True,   # garde une fenêtre console pour les logs ; mettre False pour cacher
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
