import { useState, useRef, useContext, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import { gameSocket } from "@/hooks/game.socket";


export default function Board() {
  type onPieceDropArgs = {
    sourceSquare: string;
    targetSquare: string | null;
  };
  
  type onValidationData = {
    from: string,
    to: string,
    promotion: string,
    valid: boolean,
  }

  const makeMove = (from: string, to: string, promotion: string) => {
    gameSocket.makeMove(username,from,to,promotion)
    console.log("Sent server move")
  }

  const { username, setUserName } = useContext(userContext)
  const { currentRoom,setCurrentRoom } = useContext(roomContext)
  

  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const [fen, setFen] = useState(chessGame.fen());


  

  useEffect(() => {
    const handleValidation = (data: onValidationData) =>  {
        if (data.valid){
            setFen(chessGame.fen());
                console.log(`Piece moved: \n 
                    From: ${data.from}\n
                    To: ${data.to}\n`);
        }

        else {
            console.log("Move not valid")
        }
    }

    gameSocket.onNotValidMove(handleValidation)

    return () => {
        gameSocket.offNotValidMove()
    }

  }, [fen])



  function onPieceDrop({ sourceSquare, targetSquare }: onPieceDropArgs) {
    // Checks if the target square is not null
    if (!targetSquare) return false;

    // Makes the move the local chess lib validates it
    const move = chessGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (!move) return false;

    makeMove(move.from,move.to, "q")
    return false
  }

  const chessBoardOptions = {
    onPieceDrop,
    position: fen,
    id: currentRoom ?? undefined,
    boardOrientation: 'black' as const
  };

  return (
    <>
      <Chessboard options={chessBoardOptions} />
    </>
  );
}
