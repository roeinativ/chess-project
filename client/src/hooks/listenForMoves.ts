import { Chess } from "chess.js";
import { useEffect, useContext } from "react";
import { colorContext } from "@/contexts/colorContext";
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
  const { color, setColor } = useContext(colorContext)

  const toggle_turn = (dataColor: string) => {
    if (dataColor === color) {
      setIsTurn(false)
    }

    else {
      setIsTurn(true)
    }
  }

  useEffect(() => {
    const handleMove = (data: Types.OnMoveData) => {
      
      if (data.valid) {

        
        chessGameRef.current.load(data.fen);
        setFen(data.fen);
        toggle_turn(data.color)
        handlePreMoves()
        console.log("Move valid");
      }
      
      else {
        console.log("Move not valid")
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
