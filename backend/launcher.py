"""Point d'entrée de PDF-Editor.exe.

Démarre Flask sur 127.0.0.1, ouvre le navigateur par défaut.
Si la console est masquée (mode windowed), toute erreur est consignée dans
%LOCALAPPDATA%\\PDF-Editor\\error.log
"""

import os
import socket
import sys
import threading
import time
import traceback
import webbrowser
from pathlib import Path


def _log_dir() -> Path:
    base = os.environ.get("LOCALAPPDATA") or os.path.expanduser("~")
    p = Path(base) / "PDF-Editor"
    p.mkdir(parents=True, exist_ok=True)
    return p


def _log_error(exc: BaseException) -> None:
    try:
        log = _log_dir() / "error.log"
        with log.open("a", encoding="utf-8") as f:
            f.write(f"\n----- {time.strftime('%Y-%m-%d %H:%M:%S')} -----\n")
            f.write("".join(traceback.format_exception(type(exc), exc, exc.__traceback__)))
    except Exception:
        pass


def _free_port(default: int = 5001) -> int:
    """Renvoie `default` s'il est libre, sinon un port aléatoire libre."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("127.0.0.1", default))
            return default
        except OSError:
            pass
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def _open_browser(url: str, delay: float = 1.2) -> None:
    def _go():
        time.sleep(delay)
        try:
            webbrowser.open(url)
        except Exception as e:
            _log_error(e)

    threading.Thread(target=_go, daemon=True).start()


def _setup_bundled_ghostscript() -> None:
    """Si un Ghostscript portable est livré à côté de l'exe, l'ajoute au PATH."""
    if not getattr(sys, "frozen", False):
        return
    exe_dir = Path(sys.executable).resolve().parent
    candidates = [
        exe_dir / "ghostscript" / "bin",
        exe_dir.parent / "ghostscript" / "bin",
    ]
    for gs_dir in candidates:
        if gs_dir.exists():
            os.environ["PATH"] = str(gs_dir) + os.pathsep + os.environ.get("PATH", "")
            return


def main():
    HERE = Path(__file__).resolve().parent
    if str(HERE) not in sys.path:
        sys.path.insert(0, str(HERE))

    _setup_bundled_ghostscript()

    port = _free_port(5001)
    url = f"http://127.0.0.1:{port}"

    from app import app  # importé après l'ajustement du PATH

    _open_browser(url)

    app.run(host="127.0.0.1", port=port, debug=False, use_reloader=False)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except BaseException as e:
        _log_error(e)
        raise
