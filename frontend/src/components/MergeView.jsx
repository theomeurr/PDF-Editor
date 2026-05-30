import { useState } from 'react';
import Dropzone from './Dropzone.jsx';
import { formatBytes } from '../utils.js';

export default function MergeView() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const addFiles = (incoming) => {
    setFiles((prev) => [...prev, ...incoming]);
    setError(null);
  };

  const removeAt = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const move = (idx, dir) => {
    setFiles((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const merge = async () => {
    if (files.length < 2) {
      setError('Ajoutez au moins 2 PDF pour fusionner');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      files.forEach((f) => form.append('files', f));
      const res = await fetch('/api/merge', { method: 'POST', body: form });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Erreur HTTP ${res.status}`);
      }
      const blob = await res.blob();
      downloadBlob(blob, 'fusion.pdf');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Fusionner des PDF</h2>
        <p className="text-sm text-slate-500 mt-1">
          Glissez plusieurs PDF, réorganisez-les, puis téléchargez le fichier fusionné.
        </p>
      </div>

      <Dropzone onFiles={addFiles}>
        <div className="text-slate-600">
          <div className="text-4xl mb-2">📄</div>
          <p className="font-medium text-slate-800">Glissez vos PDF ici</p>
          <p className="text-sm text-slate-500 mt-1">ou cliquez pour parcourir</p>
        </div>
      </Dropzone>

      {files.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {files.map((f, idx) => (
              <li key={`${f.name}-${idx}`} className="flex items-center gap-3 px-4 py-3">
                <span className="text-slate-400 text-sm w-6">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                  <p className="text-xs text-slate-500">{formatBytes(f.size)}</p>
                </div>
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Monter"
                >
                  ▲
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === files.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Descendre"
                >
                  ▼
                </button>
                <button
                  onClick={() => removeAt(idx)}
                  className="p-1 text-slate-400 hover:text-red-600"
                  title="Retirer"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={merge}
          disabled={busy || files.length < 2}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {busy ? 'Fusion en cours…' : `Fusionner ${files.length} PDF`}
        </button>
        {files.length > 0 && (
          <button
            onClick={() => setFiles([])}
            className="px-4 py-3 text-slate-600 hover:text-slate-900 text-sm"
          >
            Tout effacer
          </button>
        )}
      </div>
    </div>
  );
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
