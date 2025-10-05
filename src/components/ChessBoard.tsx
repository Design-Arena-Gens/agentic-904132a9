'use client';

import { useMemo } from 'react';
import type { PieceSymbol, Square } from 'chess.js';

type BoardPiece = {
  type: PieceSymbol;
  color: 'w' | 'b';
};

type SquareMap = Record<Square, BoardPiece | null>;

export interface ChessBoardProps {
  squares: SquareMap;
  selectedSquare: Square | null;
  legalMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  isFlipped: boolean;
  onSquareClick: (square: Square) => void;
  onSquareRightClick?: (square: Square) => void;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

const pieceGlyphs: Record<'w' | 'b', Record<PieceSymbol, string>> = {
  w: {
    k: '♔',
    q: '♕',
    r: '♖',
    b: '♗',
    n: '♘',
    p: '♙',
  },
  b: {
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
  },
};

const squareLabel = (file: string, rank: string): Square => `${file}${rank}` as Square;

export function ChessBoard({
  squares,
  selectedSquare,
  legalMoves,
  lastMove,
  isFlipped,
  onSquareClick,
  onSquareRightClick,
}: ChessBoardProps) {
  const legalMoveSet = useMemo(() => new Set(legalMoves), [legalMoves]);

  const rankOrder = isFlipped ? ranks : [...ranks].reverse();
  const fileOrder = isFlipped ? [...files].reverse() : files;

  return (
    <div className="relative flex flex-col gap-2">
      <div className="grid grid-cols-8 border-4 border-stone-700 rounded-xl overflow-hidden shadow-2xl shadow-black/30">
        {rankOrder.map((rank, rankIndex) =>
          fileOrder.map((file, fileIndex) => {
            const square = squareLabel(file, rank);
            const piece = squares[square];
            const isSelected = selectedSquare === square;
            const isLegalTarget = legalMoveSet.has(square);
            const isLastMoveSquare =
              lastMove !== null && (lastMove.from === square || lastMove.to === square);
            const lightSquare = (fileIndex + rankIndex) % 2 === 0;

            return (
              <button
                key={square}
                type="button"
                onClick={() => onSquareClick(square)}
                onContextMenu={(event) => {
                  if (!onSquareRightClick) return;
                  event.preventDefault();
                  onSquareRightClick(square);
                }}
                className={[
                  'relative flex h-16 w-16 items-center justify-center transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                  lightSquare ? 'bg-amber-100' : 'bg-emerald-700/80',
                  isLastMoveSquare ? 'outline outline-4 outline-amber-400/60' : '',
                  isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-lime-400 z-10' : '',
                  isLegalTarget && !piece ? 'hover:bg-lime-300/60' : '',
                  isLegalTarget && piece ? 'hover:bg-rose-400/60' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {isLegalTarget && !piece && (
                  <span className="absolute h-4 w-4 rounded-full bg-lime-400/70" />
                )}
                {isLegalTarget && piece && (
                  <span className="absolute inset-1 rounded-lg border-4 border-lime-300/80" />
                )}
                {piece && (
                  <span className="text-4xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.55)]">
                    {pieceGlyphs[piece.color][piece.type]}
                  </span>
                )}
                <span className="pointer-events-none absolute bottom-1 right-1 text-[10px] font-semibold uppercase tracking-wide text-black/50">
                  {square}
                </span>
              </button>
            );
          }),
        )}
      </div>
      <div className="flex justify-between px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {fileOrder.map((file) => (
          <span key={file} className="w-16 text-center">
            {file}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ChessBoard;
