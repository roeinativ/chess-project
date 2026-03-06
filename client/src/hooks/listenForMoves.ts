import { Chess } from "chess.js";
import type { moveData,onGameOverData,onMoveData } from "./game.socket";
import { useEffect } from "react";
import { gameSocket } from "./game.socket";

type UseChessGameParams = {
chessGameRef: React.RefObject<Chess>;
setFen: (fen: string) => void;
setIsTurn: (val: boolean) => void;
setGameOn: (val: boolean) => void;
setCurrentRoom: (room: string) => void;
PresentWinner: (winner: string) => void;
handlePreMoves: () => void;
};

export function useChessGame({
  chessGameRef,
  setFen,
  setIsTurn,
  setGameOn,
  setCurrentRoom,
  PresentWinner,
  handlePreMoves,
}: UseChessGameParams) {

// Listen for move validation
  useEffect(() => {
    const handleValidation = (data: moveData) => {
      if (data.valid) {
        setFen(chessGameRef.current.fen());
        setIsTurn(false);
      } else {
        chessGameRef.current.undo();
      }
    };

    gameSocket.onNotValidMove(handleValidation);
    return () => gameSocket.offNotValidMove();
  }, []);

  // Listen for opponent move
  useEffect(() => {
    const handleMove = (data: onMoveData) => {
      chessGameRef.current.load(data.fen);
      setFen(data.fen);
      setIsTurn(true);
      handlePreMoves();
    };

    gameSocket.onMove(handleMove);
    return () => gameSocket.offOnMove();
  }, []);

  // Listen for game over
  useEffect(() => {
    const handleGameOver = (data: onGameOverData) => {
      chessGameRef.current.load(data.fen);
      setFen(data.fen);
      setGameOn(false);
      setCurrentRoom("Home");
      PresentWinner(data.winner);
    };

    gameSocket.onGameOver(handleGameOver);
    return () => gameSocket.offGameOver();
  }, []);
}
