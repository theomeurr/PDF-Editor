import { useEffect, useState } from 'react';
import MergeView from './components/MergeView.jsx';
import CompressView from './components/CompressView.jsx';

export default function App() {
  const [tab, setTab] = useState('merge');
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'down' }));
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
              PDF
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">PDF Editor</h1>
              <p className="text-xs text-slate-500">100 % local — vos fichiers ne quittent pas votre machine</p>
            </div>
          </div>
          <HealthBadge health={health} />
        </div>
        <nav className="max-w-4xl mx-auto px-6 flex gap-1">
          <TabButton active={tab === 'merge'} onClick={() => setTab('merge')}>
            Fusionner
          </TabButton>
          <TabButton active={tab === 'compress'} onClick={() => setTab('compress')}>
            Compresser
          </TabButton>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {tab === 'merge' ? <MergeView /> : <CompressView gsAvailable={health?.ghostscript} />}
      </main>

      <footer className="text-center text-xs text-slate-400 py-6">
        Alternative privée à ILovePDF · Flask + React
      </footer>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-brand-500 text-brand-600'
          : 'border-transparent text-slate-500 hover:text-slate-800'
      }`}
    >
      {children}
    </button>
  );
}

function HealthBadge({ health }) {
  if (!health) {
    return <span className="text-xs text-slate-400">…</span>;
  }
  if (health.status !== 'ok') {
    return (
      <span className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200">
        Backend hors ligne
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
        Backend OK
      </span>
      <span
        className={`px-2 py-1 rounded border ${
          health.ghostscript
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}
        title={health.ghostscript ? 'Ghostscript détecté' : 'Ghostscript manquant — la compression sera indisponible'}
      >
        GS {health.ghostscript ? '✓' : '✗'}
      </span>
    </div>
  );
}
