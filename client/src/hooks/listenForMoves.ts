import { Chess } from "chess.js";
import { useEffect } from "react";
import { gameSocket } from "./game.socket";
import * as Types from "@/types/types";

type UseChessGameParams = {
  chessGameRef: React.RefObject<Chess>;
  setFen: (fen: string) => void;
  setIsTurn: (val: boolean) => void;
  setGameOn: (val: boolean) => void;
  setCurrentRoom: (room: string) => void;
  setEndingMessage: (endingMessage: string | null) => void;
  handlePreMoves: () => void;
};

export function useChessGame({
  chessGameRef,
  setFen,
  setIsTurn,
  setGameOn,
  setCurrentRoom,
  setEndingMessage,
  handlePreMoves,
}: UseChessGameParams) {


  // Listen for opponent move
  useEffect(() => {
    const handleMove = (data: Types.OnMoveData) => {


      chessGameRef.current.load(data.fen);
      
      if (data.valid) {

        setFen(data.fen);
        setIsTurn(true);
        handlePreMoves();
        console.log("Move is valid updating fen")
      }
      
      else {
        console.log("Move was not valid")
      }

    };

    gameSocket.onMove(handleMove);
    return () => gameSocket.offOnMove();
  }, []);

  // Listen for game over
  useEffect(() => {
    const handleGameOver = (data: Types.OnGameOverData) => {
      chessGameRef.current.load(data.fen);
      setFen(data.fen);

      setTimeout(() => {
        setGameOn(false);
        setCurrentRoom("Home");
        setEndingMessage(data.message);
      }, 2000);
    };

    gameSocket.onGameOver(handleGameOver);
    return () => gameSocket.offGameOver();
  }, []);
}
