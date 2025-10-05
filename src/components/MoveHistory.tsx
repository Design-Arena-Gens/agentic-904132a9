'use client';

import { useMemo } from 'react';
import type { Move } from 'chess.js';

export interface MoveHistoryProps {
  moves: Move[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  const rows = useMemo(() => {
    const grouped: { move: number; white?: Move; black?: Move }[] = [];

    for (let index = 0; index < moves.length; index += 1) {
      const moveNumber = Math.floor(index / 2) + 1;
      const move = moves[index];
      const rowIndex = grouped.findIndex((entry) => entry.move === moveNumber);

      if (rowIndex === -1) {
        grouped.push({ move: moveNumber, white: move.color === 'w' ? move : undefined, black: move.color === 'b' ? move : undefined });
      } else {
        const entry = grouped[rowIndex];
        if (move.color === 'w') {
          entry.white = move;
        } else {
          entry.black = move;
        }
      }
    }

    return grouped;
  }, [moves]);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-500 shadow-inner">
        No moves played yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 shadow-inner">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-3 border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>No.</span>
        <span>White</span>
        <span>Black</span>
      </div>
      <div className="max-h-72 overflow-y-auto px-4 py-2 text-sm text-slate-800">
        {rows.map((row) => (
          <div key={row.move} className="grid grid-cols-[auto_1fr_1fr] items-center gap-3 py-1">
            <span className="font-semibold text-slate-500">{row.move}.</span>
            <span className="rounded px-2 py-1 text-slate-900">
              {row.white?.san ?? '—'}
            </span>
            <span className="rounded px-2 py-1 text-slate-900">
              {row.black?.san ?? '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoveHistory;
