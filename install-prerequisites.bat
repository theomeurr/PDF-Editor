@echo off
REM ============================================================
REM  Installation automatique de tous les prerequis Windows
REM
REM  Installe via winget (gestionnaire de paquets integre a Windows 10/11) :
REM   - Python 3.12
REM   - Node.js LTS
REM   - Ghostscript
REM   - Inno Setup 6
REM   - Git (optionnel mais pratique)
REM
REM  Double-cliquez simplement sur ce fichier.
REM  Acceptez les fenetres UAC qui pourraient s'afficher.
REM ============================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ============================================================
echo  Installation des prerequis PDF Editor
echo ============================================================
echo.

REM --- Verification de winget ---
where winget >nul 2>nul
if errorlevel 1 (
    echo winget n'est pas disponible sur ce PC.
    echo.
    echo Solution : installez "App Installer" depuis le Microsoft Store :
    echo   https://apps.microsoft.com/detail/9nblggh4nns1
    echo.
    echo Apres installation, relancez ce script.
    pause
    exit /b 1
)

echo winget detecte. Demarrage des installations...
echo.

set "WINGET_ARGS=-e --accept-source-agreements --accept-package-agreements --silent"

REM --- Python ---
echo [1/5] Python 3.12
where python >nul 2>nul
if errorlevel 1 (
    winget install --id Python.Python.3.12 %WINGET_ARGS%
) else (
    echo     deja installe, on saute.
)
echo.

REM --- Node.js ---
echo [2/5] Node.js LTS
where node >nul 2>nul
if errorlevel 1 (
    winget install --id OpenJS.NodeJS.LTS %WINGET_ARGS%
) else (
    echo     deja installe, on saute.
)
echo.

REM --- Ghostscript ---
echo [3/5] Ghostscript
set "GS_FOUND="
if exist "%ProgramFiles%\gs" set "GS_FOUND=1"
if exist "%ProgramFiles(x86)%\gs" set "GS_FOUND=1"
if defined GS_FOUND (
    echo     deja installe, on saute.
) else (
    winget install --id ArtifexSoftware.GhostScript %WINGET_ARGS%
)
echo.

REM --- Inno Setup ---
echo [4/5] Inno Setup 6
if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" (
    echo     deja installe, on saute.
) else if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe" (
    echo     deja installe, on saute.
) else (
    winget install --id JRSoftware.InnoSetup %WINGET_ARGS%
)
echo.

REM --- Git (optionnel) ---
echo [5/5] Git (optionnel - pour cloner le depot)
where git >nul 2>nul
if errorlevel 1 (
    winget install --id Git.Git %WINGET_ARGS%
) else (
    echo     deja installe, on saute.
)
echo.

echo ============================================================
echo  TERMINE
echo ============================================================
echo.
echo IMPORTANT : fermez cette fenetre et OUVREZ-EN UNE NOUVELLE
echo pour que le PATH soit a jour, sinon les outils ne seront pas
echo trouves quand vous lancerez build-windows.bat.
echo.
echo Ensuite, double-cliquez sur build-windows.bat pour construire
echo l'installeur PDF Editor.
echo.
pause
