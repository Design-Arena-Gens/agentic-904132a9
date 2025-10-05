'use client';

export interface GameStatusProps {
  status: string;
  turn: 'w' | 'b';
  moveCount: number;
}

export function GameStatus({ status, turn, moveCount }: GameStatusProps) {
  const playerLabel = turn === 'w' ? 'White' : 'Black';

  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-lg">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Game Status</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{status}</div>
      <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
        <span>Turn</span>
        <span className={turn === 'w' ? 'text-emerald-700' : 'text-amber-700'}>{playerLabel}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm text-slate-600">
        <span>Moves played</span>
        <span>{moveCount}</span>
      </div>
    </div>
  );
}

export default GameStatus;
