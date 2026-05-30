@echo off
REM ============================================================
REM  Build PDF-Editor.exe pour Windows
REM
REM  Prerequis sur la machine Windows (une seule fois) :
REM   - Python 3.10+ ........... https://www.python.org/downloads/
REM       (cochez "Add Python to PATH" pendant l'installation)
REM   - Node.js LTS ............ https://nodejs.org/
REM   - Ghostscript ............ https://ghostscript.com/releases/gsdnld.html
REM
REM  Puis double-cliquez sur ce script.
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo === [1/5] Verification des outils ===
where python >nul 2>nul || (echo ERREUR: Python introuvable. Installez Python 3.10+ et cochez "Add to PATH". & pause & exit /b 1)
where node   >nul 2>nul || (echo ERREUR: Node.js introuvable. Installez Node LTS depuis nodejs.org. & pause & exit /b 1)
where npm    >nul 2>nul || (echo ERREUR: npm introuvable. Reinstallez Node.js. & pause & exit /b 1)

echo.
echo === [2/5] Environnement Python ===
if not exist backend\.venv (
    python -m venv backend\.venv || (echo Echec creation venv & pause & exit /b 1)
)
call backend\.venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul
pip install -r backend\requirements.txt
pip install pyinstaller==6.10.0

echo.
echo === [3/5] Build du frontend (Vite) ===
pushd frontend
if not exist node_modules (
    call npm install || (popd & echo Echec npm install & pause & exit /b 1)
)
call npm run build || (popd & echo Echec build frontend & pause & exit /b 1)
popd

echo.
echo === [4/5] Packaging PyInstaller ===
if exist build rmdir /s /q build
if exist dist  rmdir /s /q dist
pyinstaller --noconfirm pdf-editor.spec || (echo Echec PyInstaller & pause & exit /b 1)

echo.
echo === [5/5] Termine ===
echo.
echo Votre executable est ici : dist\PDF-Editor.exe
echo Double-cliquez dessus pour lancer l'application.
echo.
echo IMPORTANT : Ghostscript doit etre installe sur chaque PC ou vous lancez le .exe.
echo Telechargez-le ici : https://ghostscript.com/releases/gsdnld.html
echo.
pause
