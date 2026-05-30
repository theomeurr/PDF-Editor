import io
import os
import shutil
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path
from typing import Optional

from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from pypdf import PdfReader, PdfWriter


def _resource_root() -> Path:
    if getattr(sys, "frozen", False):
        return Path(sys._MEIPASS)  # type: ignore[attr-defined]
    return Path(__file__).resolve().parent.parent


STATIC_DIR = _resource_root() / "frontend" / "dist"

app = Flask(__name__, static_folder=None)
CORS(app)


@app.get("/")
def serve_index():
    index = STATIC_DIR / "index.html"
    if index.exists():
        return send_from_directory(STATIC_DIR, "index.html")
    return jsonify({"status": "frontend non buildé — lancez `npm run build` dans /frontend"}), 200


@app.get("/<path:filename>")
def serve_static(filename):
    if filename.startswith("api/"):
        return jsonify({"error": "not found"}), 404
    target = STATIC_DIR / filename
    if target.exists() and target.is_file():
        return send_from_directory(STATIC_DIR, filename)
    index = STATIC_DIR / "index.html"
    if index.exists():
        return send_from_directory(STATIC_DIR, "index.html")
    return jsonify({"error": "not found"}), 404

MAX_UPLOAD_MB = 200
app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_MB * 1024 * 1024

GS_QUALITY = {
    "screen": "/screen",
    "ebook": "/ebook",
    "printer": "/printer",
    "prepress": "/prepress",
}


def _ghostscript_binary() -> Optional[str]:
    return shutil.which("gs")


def _validate_pdfs(files) -> list:
    pdfs = []
    for f in files:
        if not f or not f.filename:
            continue
        if not f.filename.lower().endswith(".pdf"):
            raise ValueError(f"Fichier non PDF : {f.filename}")
        pdfs.append(f)
    if not pdfs:
        raise ValueError("Aucun PDF fourni")
    return pdfs


@app.get("/api/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "ghostscript": bool(_ghostscript_binary()),
        }
    )


@app.post("/api/merge")
def merge():
    try:
        files = _validate_pdfs(request.files.getlist("files"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    if len(files) < 2:
        return jsonify({"error": "Au moins 2 PDF requis pour la fusion"}), 400

    writer = PdfWriter()
    try:
        for f in files:
            reader = PdfReader(f.stream)
            for page in reader.pages:
                writer.add_page(page)
    except Exception as e:
        return jsonify({"error": f"Erreur de lecture PDF : {e}"}), 400

    buf = io.BytesIO()
    writer.write(buf)
    buf.seek(0)

    return send_file(
        buf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name="fusion.pdf",
    )


@app.post("/api/compress")
def compress():
    gs = _ghostscript_binary()
    if not gs:
        return (
            jsonify(
                {
                    "error": "Ghostscript n'est pas installé. Installez-le avec : brew install ghostscript"
                }
            ),
            500,
        )

    try:
        files = _validate_pdfs(request.files.getlist("files"))
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    quality = request.form.get("quality", "ebook")
    if quality not in GS_QUALITY:
        return jsonify({"error": f"Qualité inconnue : {quality}"}), 400

    f = files[0]
    work = Path(tempfile.mkdtemp(prefix="pdfcompress-"))
    try:
        src = work / f"src-{uuid.uuid4().hex}.pdf"
        dst = work / f"out-{uuid.uuid4().hex}.pdf"
        f.save(src)
        original_size = src.stat().st_size

        cmd = [
            gs,
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.4",
            f"-dPDFSETTINGS={GS_QUALITY[quality]}",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={dst}",
            str(src),
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=300)
        if result.returncode != 0 or not dst.exists():
            return (
                jsonify(
                    {
                        "error": "Ghostscript a échoué",
                        "details": result.stderr.decode("utf-8", errors="ignore"),
                    }
                ),
                500,
            )

        compressed_size = dst.stat().st_size
        data = dst.read_bytes()

        original_name = Path(f.filename).stem
        response = send_file(
            io.BytesIO(data),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=f"{original_name}-compresse.pdf",
        )
        response.headers["X-Original-Size"] = str(original_size)
        response.headers["X-Compressed-Size"] = str(compressed_size)
        response.headers["Access-Control-Expose-Headers"] = (
            "X-Original-Size, X-Compressed-Size"
        )
        return response
    finally:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5001"))
    app.run(host=host, port=port, debug=True)
