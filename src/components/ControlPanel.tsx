'use client';

export interface ControlPanelProps {
  isFlipped: boolean;
  canUndo: boolean;
  onReset: () => void;
  onUndo: () => void;
  onFlip: () => void;
  onRandomMove: () => void;
}

export function ControlPanel({ isFlipped, canUndo, onReset, onUndo, onFlip, onRandomMove }: ControlPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-lg">
      <button
        type="button"
        onClick={onReset}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        New Game
      </button>
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="rounded-lg bg-slate-900/90 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={onFlip}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-black shadow-sm transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
      >
        {isFlipped ? 'White Bottom' : 'Black Bottom'}
      </button>
      <button
        type="button"
        onClick={onRandomMove}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700"
      >
        Random Move
      </button>
    </div>
  );
}

export default ControlPanel;
