@echo off
REM ============================================================
REM  Build PDF-Editor + installeur Inno Setup
REM
REM  Prerequis sur la machine Windows (une seule fois) :
REM   - Python 3.10+ ........... https://www.python.org/downloads/
REM       (cochez "Add Python to PATH" pendant l'installation)
REM   - Node.js LTS ............ https://nodejs.org/
REM   - Ghostscript ............ https://ghostscript.com/releases/gsdnld.html
REM   - Inno Setup 6+ .......... https://jrsoftware.org/isdl.php
REM
REM  Puis double-cliquez sur ce script.
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo === [1/6] Verification des outils ===
where python >nul 2>nul || (echo ERREUR: Python introuvable. Installez Python 3.10+ et cochez "Add to PATH". & pause & exit /b 1)
where node   >nul 2>nul || (echo ERREUR: Node.js introuvable. Installez Node LTS depuis nodejs.org. & pause & exit /b 1)
where npm    >nul 2>nul || (echo ERREUR: npm introuvable. Reinstallez Node.js. & pause & exit /b 1)

echo.
echo === [2/6] Environnement Python ===
if not exist backend\.venv (
    python -m venv backend\.venv || (echo Echec creation venv & pause & exit /b 1)
)
call backend\.venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul
pip install -r backend\requirements.txt
pip install pyinstaller==6.10.0

echo.
echo === [3/6] Build du frontend (Vite) ===
pushd frontend
if not exist node_modules (
    call npm install || (popd & echo Echec npm install & pause & exit /b 1)
)
call npm run build || (popd & echo Echec build frontend & pause & exit /b 1)
popd

echo.
echo === [4/6] Packaging PyInstaller (mode onedir) ===
if exist build rmdir /s /q build
if exist dist  rmdir /s /q dist
pyinstaller --noconfirm pdf-editor.spec || (echo Echec PyInstaller & pause & exit /b 1)

if not exist "dist\PDF-Editor\PDF-Editor.exe" (
    echo ERREUR: dist\PDF-Editor\PDF-Editor.exe introuvable
    pause
    exit /b 1
)

echo.
echo === [5/6] Recherche d'Inno Setup (ISCC.exe) ===
set "ISCC="
if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" set "ISCC=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe"
if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe"      set "ISCC=%ProgramFiles%\Inno Setup 6\ISCC.exe"
if not defined ISCC (
    where ISCC.exe >nul 2>nul && for /f "delims=" %%i in ('where ISCC.exe') do set "ISCC=%%i"
)

if not defined ISCC (
    echo.
    echo Inno Setup n'a pas ete detecte.
    echo Telechargez-le ici : https://jrsoftware.org/isdl.php
    echo.
    echo Vous pouvez aussi compiler l'installeur manuellement :
    echo   - Ouvrir installer\pdf-editor.iss dans Inno Setup Compiler
    echo   - Cliquer sur Compile
    echo.
    echo L'application est neanmoins prete dans : dist\PDF-Editor\PDF-Editor.exe
    pause
    exit /b 0
)

echo Inno Setup trouve : "%ISCC%"

echo.
echo === [6/6] Compilation de l'installeur ===
"%ISCC%" installer\pdf-editor.iss > installer\iscc.log 2>&1
if errorlevel 1 (
    echo.
    echo ------------------------------------------------------------
    echo ECHEC d'Inno Setup. Voici le log :
    echo ------------------------------------------------------------
    type installer\iscc.log
    echo ------------------------------------------------------------
    echo Log complet : installer\iscc.log
    pause
    exit /b 1
)

echo.
echo ============================================================
echo  TERMINE
echo ============================================================
echo.
echo Installeur cree dans : installer\output\
dir /b installer\output\*.exe 2>nul
echo.
echo Double-cliquez sur le .exe pour installer PDF Editor sur ce PC,
echo ou distribuez-le sur n'importe quel autre PC Windows.
echo.
pause
