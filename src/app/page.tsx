'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Move, Piece, PieceSymbol, Square } from 'chess.js';
import { Chess } from 'chess.js';
import CapturedPieces from '@/components/CapturedPieces';
import ChessBoard from '@/components/ChessBoard';
import ControlPanel from '@/components/ControlPanel';
import GameStatus from '@/components/GameStatus';
import MoveHistory from '@/components/MoveHistory';

type BoardPiece = {
  type: PieceSymbol;
  color: 'w' | 'b';
};

type SquareMap = Record<Square, BoardPiece | null>;

type LastMove = { from: Square; to: Square } | null;

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

const toSquare = (fileIndex: number, rankIndex: number): Square =>
  `${files[fileIndex]}${ranks[rankIndex]}` as Square;

const createSquareMap = (game: Chess): SquareMap => {
  const boardMatrix = game.board();
  const map: Partial<Record<Square, BoardPiece | null>> = {};

  for (let rankIndex = 0; rankIndex < 8; rankIndex += 1) {
    for (let fileIndex = 0; fileIndex < 8; fileIndex += 1) {
      const square = toSquare(fileIndex, rankIndex);
      const piece: Piece | null = boardMatrix[rankIndex][fileIndex];
      map[square] = piece
        ? {
            type: piece.type,
            color: piece.color,
          }
        : null;
    }
  }

  return map as SquareMap;
};

const describeGameState = (game: Chess): string => {
  if (game.isCheckmate()) {
    const winner = game.turn() === 'w' ? 'Black' : 'White';
    return `${winner} wins by checkmate`;
  }

  if (game.isStalemate()) {
    return 'Draw by stalemate';
  }

  if (game.isThreefoldRepetition()) {
    return 'Draw by repetition';
  }

  if (game.isInsufficientMaterial()) {
    return 'Draw by insufficient material';
  }

  if (game.isDraw()) {
    return 'Drawn position';
  }

  const player = game.turn() === 'w' ? 'White' : 'Black';
  return game.inCheck() ? `${player} to move (check!)` : `${player} to move`;
};

const collectCaptures = (moves: Move[]) => {
  const whiteCaptures: PieceSymbol[] = [];
  const blackCaptures: PieceSymbol[] = [];

  moves.forEach((move) => {
    if (!move.captured) return;
    if (move.color === 'w') {
      whiteCaptures.push(move.captured);
    } else {
      blackCaptures.push(move.captured);
    }
  });

  return { whiteCaptures, blackCaptures };
};

const getLegalTargets = (game: Chess, source: Square): Square[] => {
  return (game.moves({ square: source, verbose: true }) as Move[]).map((move) => move.to as Square);
};

export default function HomePage() {
  const [game] = useState(() => new Chess());
  const [squares, setSquares] = useState<SquareMap>(() => createSquareMap(game));
  const [moves, setMoves] = useState<Move[]>(() => game.history({ verbose: true }) as Move[]);
  const [turn, setTurn] = useState<'w' | 'b'>(game.turn());
  const [status, setStatus] = useState<string>(() => describeGameState(game));
  const [lastMove, setLastMove] = useState<LastMove>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);

  const syncState = (latestMove: LastMove = null) => {
    setSquares(createSquareMap(game));
    setMoves(game.history({ verbose: true }) as Move[]);
    setTurn(game.turn());
    setStatus(describeGameState(game));
    setLastMove(latestMove);
  };

  useEffect(() => {
    syncState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSquareClick = (square: Square) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    if (selectedSquare) {
      const movesFromSource = game.moves({ square: selectedSquare, verbose: true }) as Move[];
      const chosenMove = movesFromSource.find((move) => move.to === square);

      if (chosenMove) {
        game.move({
          from: selectedSquare,
          to: square,
          promotion: chosenMove.promotion ?? 'q',
        });
        syncState({ from: selectedSquare, to: square });
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      const pieceAtDestination = squares[square];
      if (pieceAtDestination && pieceAtDestination.color === game.turn()) {
        setSelectedSquare(square);
        setLegalMoves(getLegalTargets(game, square));
        return;
      }

      setSelectedSquare(null);
      setLegalMoves([]);
      return;
    }

    const piece = squares[square];
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      setLegalMoves(getLegalTargets(game, square));
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const handleRightClick = () => {
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleReset = () => {
    game.reset();
    setIsFlipped(false);
    syncState(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleUndo = () => {
    const undone = game.undo();
    if (!undone) return;
    syncState(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleRandomMove = () => {
    const legal = game.moves({ verbose: true }) as Move[];
    if (legal.length === 0) return;
    const randomMove = legal[Math.floor(Math.random() * legal.length)];
    game.move(randomMove);
    syncState({ from: randomMove.from as Square, to: randomMove.to as Square });
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  const { whiteCaptures, blackCaptures } = useMemo(() => collectCaptures(moves), [moves]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold uppercase tracking-[0.3em] text-transparent drop-shadow-2xl sm:text-4xl" style={{ backgroundImage: 'linear-gradient(90deg,#f59e0b,#f87171,#a855f7)', WebkitBackgroundClip: 'text' }}>
            Lumina Chess
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            A polished chess experience with move history, captured piece tracking, and a responsive board that looks fantastic on any screen.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-4">
            <ChessBoard
              squares={squares}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              isFlipped={isFlipped}
              onSquareClick={handleSquareClick}
              onSquareRightClick={handleRightClick}
            />
            <ControlPanel
              isFlipped={isFlipped}
              canUndo={moves.length > 0}
              onReset={handleReset}
              onUndo={handleUndo}
              onFlip={handleFlip}
              onRandomMove={handleRandomMove}
            />
          </div>

          <div className="flex flex-col gap-4">
            <GameStatus status={status} turn={turn} moveCount={moves.length} />
            <CapturedPieces whiteCaptures={whiteCaptures} blackCaptures={blackCaptures} />
            <MoveHistory moves={moves} />
          </div>
        </div>
      </div>
    </main>
  );
}
