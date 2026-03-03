import { useState, useRef, useContext, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { gameSocket } from "@/hooks/game.socket";
import type { Square } from "chess.js";
import type { onMoveData, moveData } from "@/hooks/game.socket";


export default function Board() {
  type onPieceDropArgs = {
    sourceSquare: string;
    targetSquare: string | null;
  };
  



  const { username, setUserName } = useContext(userContext)
  const { currentRoom,setCurrentRoom } = useContext(roomContext)
  const { color, setColor } = useContext(colorContext)

  const pieceColor = color == "white" ? "w" : "b"

  
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const [fen, setFen] = useState(chessGame.fen());
  const [isTurn,setIsTurn] = useState<boolean>(pieceColor == "w" ? true : false)


  const makeMove = (from: string, to: string, promotion: string) => {
    gameSocket.makeMove(currentRoom,username,from,to,promotion)
    console.log("Sent server move")
  }

  // Listen for move validation

  useEffect(() => {
    const handleValidation = (data: moveData) =>  {
        if (data.valid){
            setFen(chessGame.fen());
            setIsTurn(false)
            console.log("Not your turn")
                console.log(`Piece moved: \n 
                    From: ${data.from}\n
                    To: ${data.to}\n`);
        }

        else {
            chessGame.undo()
            console.log("Move not valid")
        }
    }

    gameSocket.onNotValidMove(handleValidation)

    return () => {
        gameSocket.offNotValidMove()
    }

  }, [])


  // Listen for move from opponent and update it on board

  useEffect(() => {
    const handleMove = (data: onMoveData) => {
      chessGameRef.current.load(data.fen)
      setFen(data.fen)
      setIsTurn(true)
      console.log("Got move from opponent")
    }

    gameSocket.onMove(handleMove)

    return () => {
      gameSocket.offOnMove()
    }
  })



  function onPieceDrop({ sourceSquare, targetSquare }: onPieceDropArgs) {
    // Checks if the target square is not null
    if (!targetSquare) return false;

    // Makes the move the local chess lib validates it\
    let move = null

    try {
      move = chessGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    }

    catch (error) {
      return true
    }

    if (!move) return false;
    

    makeMove(move.from,move.to, "q")
    return true
    
  }

  function isMyPiece({ square }: { square: string | null }): boolean {
    if (!square) return false;
    
    const piece = chessGame.get(square as Square)

    if (!piece) {
      return false
    }

    return piece.color === pieceColor
  }
  const chessBoardOptions = {
    onPieceDrop: isTurn ? onPieceDrop : undefined,
    position: fen,
    id: currentRoom ? `room-${currentRoom}` : undefined,
    canDragPiece: isMyPiece,
    boardOrientation: color,
  };

  return (
    <>
      <Chessboard options={chessBoardOptions} />
    </>
  );
}
