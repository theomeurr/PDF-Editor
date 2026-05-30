"""Point d'entrée de PDF-Editor.exe.

Démarre Flask sur 127.0.0.1, ouvre le navigateur par défaut,
puis maintient le serveur tant que la fenêtre est ouverte.
"""

import os
import socket
import sys
import threading
import time
import webbrowser
from pathlib import Path

# S'assurer qu'on peut importer app.py qu'on soit en dev ou bundle PyInstaller
HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))


def _free_port(default: int = 5001) -> int:
    """Renvoie le port `default` s'il est libre, sinon un port aléatoire libre."""
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
        webbrowser.open(url)

    threading.Thread(target=_go, daemon=True).start()


def main():
    port = _free_port(5001)
    url = f"http://127.0.0.1:{port}"

    # Hint Ghostscript bundle si présent à côté de l'exe
    if getattr(sys, "frozen", False):
        exe_dir = Path(sys.executable).resolve().parent
        gs_dir = exe_dir / "ghostscript" / "bin"
        if gs_dir.exists():
            os.environ["PATH"] = str(gs_dir) + os.pathsep + os.environ.get("PATH", "")

    from app import app  # importé après l'ajustement du PATH

    print(f"PDF Editor démarré sur {url}")
    print("Ferme cette fenêtre pour quitter.")

    _open_browser(url)

    # Mode production : pas de reloader, pas de debug
    app.run(host="127.0.0.1", port=port, debug=False, use_reloader=False)


if __name__ == "__main__":
    main()
