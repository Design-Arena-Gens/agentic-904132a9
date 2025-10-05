'use client';

import type { PieceSymbol } from 'chess.js';

const capturedGlyphs: Record<PieceSymbol, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

export interface CapturedPiecesProps {
  whiteCaptures: PieceSymbol[];
  blackCaptures: PieceSymbol[];
}

function renderRow(label: string, captures: PieceSymbol[], color: 'white' | 'black') {
  if (captures.length === 0) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-500">
        <span className="font-semibold uppercase tracking-wide text-slate-600">{label}</span>
        <span>—</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-lg">
      <span className="text-sm font-semibold uppercase tracking-wide text-slate-600">{label}</span>
      <span className={color === 'white' ? 'text-emerald-700' : 'text-amber-700'}>
        {captures.map((piece, index) => (
          <span key={`${piece}-${index}`} className="px-1">
            {capturedGlyphs[piece]}
          </span>
        ))}
      </span>
    </div>
  );
}

export function CapturedPieces({ whiteCaptures, blackCaptures }: CapturedPiecesProps) {
  return (
    <div className="flex flex-col gap-2">
      {renderRow('White captured', whiteCaptures, 'white')}
      {renderRow('Black captured', blackCaptures, 'black')}
    </div>
  );
}

export default CapturedPieces;
