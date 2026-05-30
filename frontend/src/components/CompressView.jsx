import { useState } from 'react';
import Dropzone from './Dropzone.jsx';
import { formatBytes } from '../utils.js';

const QUALITIES = [
  {
    id: 'screen',
    label: 'Écran',
    desc: 'Taille minimale · 72 dpi · idéal pour lecture web',
  },
  {
    id: 'ebook',
    label: 'Ebook',
    desc: 'Bon compromis · 150 dpi · recommandé',
  },
  {
    id: 'printer',
    label: 'Impression',
    desc: 'Qualité élevée · 300 dpi',
  },
  {
    id: 'prepress',
    label: 'Prépresse',
    desc: 'Qualité maximale · 300 dpi+ · couleurs préservées',
  },
];

export default function CompressView({ gsAvailable }) {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState('ebook');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onFiles = (arr) => {
    setFile(arr[0]);
    setResult(null);
    setError(null);
  };

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('files', file);
      form.append('quality', quality);
      const res = await fetch('/api/compress', { method: 'POST', body: form });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Erreur HTTP ${res.status}`);
      }
      const original = parseInt(res.headers.get('X-Original-Size') || '0', 10);
      const compressed = parseInt(res.headers.get('X-Compressed-Size') || '0', 10);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.pdf$/i, '');
      setResult({
        url,
        name: `${baseName}-compresse.pdf`,
        original,
        compressed,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Compresser un PDF</h2>
        <p className="text-sm text-slate-500 mt-1">
          Réduit la taille avec Ghostscript. Tout reste local.
        </p>
      </div>

      {!gsAvailable && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm">
          ⚠ Ghostscript n'est pas installé. Lancez :{' '}
          <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">brew install ghostscript</code>
        </div>
      )}

      <Dropzone multiple={false} onFiles={onFiles}>
        {file ? (
          <div className="text-left flex items-center gap-4">
            <div className="text-4xl">📄</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
            <span className="text-xs text-brand-600 font-medium">Changer →</span>
          </div>
        ) : (
          <div className="text-slate-600">
            <div className="text-4xl mb-2">📄</div>
            <p className="font-medium text-slate-800">Glissez votre PDF ici</p>
            <p className="text-sm text-slate-500 mt-1">ou cliquez pour parcourir</p>
          </div>
        )}
      </Dropzone>

      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">Niveau de compression</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUALITIES.map((q) => (
            <label
              key={q.id}
              className={`cursor-pointer border rounded-lg px-4 py-3 transition-colors ${
                quality === q.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="quality"
                value={q.id}
                checked={quality === q.id}
                onChange={() => setQuality(q.id)}
                className="sr-only"
              />
              <div className="font-medium text-sm text-slate-800">{q.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{q.desc}</div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {result && <CompressResult result={result} />}

      <div className="flex gap-3">
        <button
          onClick={compress}
          disabled={busy || !file || !gsAvailable}
          className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {busy ? 'Compression en cours…' : 'Compresser'}
        </button>
      </div>
    </div>
  );
}

function CompressResult({ result }) {
  const ratio = result.original
    ? Math.round((1 - result.compressed / result.original) * 100)
    : 0;
  const positive = ratio > 0;
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
      <div className="text-3xl">✅</div>
      <div className="flex-1">
        <p className="font-medium text-emerald-900">Compression terminée</p>
        <p className="text-sm text-emerald-800 mt-1">
          {formatBytes(result.original)} → <strong>{formatBytes(result.compressed)}</strong>{' '}
          {positive ? (
            <span className="text-emerald-700">(−{ratio} %)</span>
          ) : (
            <span className="text-amber-700">(déjà optimisé)</span>
          )}
        </p>
      </div>
      <a
        href={result.url}
        download={result.name}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg"
      >
        Télécharger
      </a>
    </div>
  );
}
