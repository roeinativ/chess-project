import { useState, useRef, useContext, useEffect } from "react";
import { Chessboard,fenStringToPositionObject } from "react-chessboard";
import { Chess } from "chess.js";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { gameOnContext } from "@/contexts/gameOnContext";
import { gameSocket } from "@/hooks/game.socket";
import type { Square } from "chess.js";
import type { onMoveData, moveData, onGameOverData } from "@/hooks/game.socket";

type onPieceDropArgs = {
  sourceSquare: string,
  targetSquare: string | null,
  piece: { pieceType: string },
};


type BoardProps = {
  PresentWinner: (winner: string) => void
}

export default function Board({ PresentWinner }: BoardProps) {


  const { username, setUserName } = useContext(userContext)
  const { currentRoom,setCurrentRoom } = useContext(roomContext)
  const { color, setColor } = useContext(colorContext)
  const { gameOn, setGameOn } = useContext(gameOnContext)


  const [pieceColor,setPieceColor] = useState<"w" | "b">(color == "white" ? "w" : "b")
  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;
  const [fen, setFen] = useState(chessGame.fen());
  const [isTurn,setIsTurn] = useState<boolean>(pieceColor == "w" ? true : false)

  const [showAnimations, setShowAnimations] = useState<boolean>(true)
  const [premoves, setPremoves] = useState<onPieceDropArgs[]>([])
  const preMovesRef = useRef<onPieceDropArgs[]>([])


  const makeMove = (from: string, to: string, promotion: string) => {
    gameSocket.makeMove(color,currentRoom,username,from,to,promotion)
    console.log("Sent server move")
  }

  // Handle premoves
  function handlePreMoves(){
    let move = null

    if (preMovesRef.current.length > 0){
      const premove = preMovesRef.current[0]
      try {
        move = chessGame.move({
          from: premove.sourceSquare,
          to: premove.targetSquare!,
          promotion: "q",
        })

        makeMove(move.from,move.to, "q")
         
        preMovesRef.current.splice(0,1)
        setPremoves([...preMovesRef.current])
        console.log("Made premove")
      }

      catch(error) {
        preMovesRef.current = []
        setPremoves([])

        setShowAnimations(false)

        setTimeout(() => {
          setShowAnimations(true)
        }, 50)
      }
    }
  }



  // Listen for move validation

  useEffect(() => {
    const handleValidation = (data: moveData) =>  {
        if (data.valid){
            setFen(chessGame.fen());
            setIsTurn(false)
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

      // Make premove
      handlePreMoves()

      console.log("Got move from opponent")
    }

    gameSocket.onMove(handleMove)

    return () => {
      gameSocket.offOnMove()
    }
  }, [])


  // Listen for game over 

  useEffect(() => {
    const handleGameOver = (data: onGameOverData) => {
      chessGameRef.current.load(data.fen)
      setFen(data.fen)
      setGameOn(false)
      setCurrentRoom("Home")
      PresentWinner(data.winner)
      console.log(`Winner is ${data.winner}`)
    }

    gameSocket.onGameOver(handleGameOver)

    return () => {
      gameSocket.offGameOver()
    }
  }, [])

  
  function onPieceDrop({ sourceSquare, targetSquare}: onPieceDropArgs) {
    // Checks if the target square is not null
    if (!targetSquare) return false;

    // Makes the move the local chess lib validates it\
    let move = null

    if (isTurn){
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
    }

    else {
    let pieceOnSquare = chessGame.get(sourceSquare as Square)
    
    const premoveOnSquare = preMovesRef.current.find(p => p.targetSquare === sourceSquare)
    
    if (premoveOnSquare) {

      preMovesRef.current.push({
        sourceSquare,
        targetSquare,
        piece: premoveOnSquare.piece
      })
    } 
    
    else {
      
      if (!pieceOnSquare) return false
      preMovesRef.current.push({
        sourceSquare,
        targetSquare,
        piece: { pieceType: pieceOnSquare.color + pieceOnSquare.type.toUpperCase() }
      })
    }

    setPremoves([...preMovesRef.current])
    return true
  }

    return true
  }

  function onSquareRightClick() {
    preMovesRef.current = []
    setPremoves([...preMovesRef.current])

    setShowAnimations(false)

    setTimeout(() => {
      setShowAnimations(true)
    }, 50)
  }

  function isMyPiece({ square }: { square: string | null }): boolean {
    if (!square) return false;
    
    const piece = position[square]

    if (!piece) {
      return false
    }

    return piece.pieceType[0] === pieceColor
  }

  // Render premoves

    const position = fenStringToPositionObject(fen, 8, 8);
    const squareStyles: Record<string, React.CSSProperties> = {};

  for (const premove of premoves) {
    delete position[premove.sourceSquare];
    position[premove.targetSquare!] = { pieceType: premove.piece.pieceType };
    squareStyles[premove.sourceSquare] = { backgroundColor: "rgba(255,0,0,0.2)" };
    squareStyles[premove.targetSquare!] = { backgroundColor: "rgba(255,0,0,0.2)" };
  }



  const chessBoardOptions = {
    onPieceDrop: onPieceDrop,
    canDragPiece: isMyPiece,
    onSquareRightClick,
    position: position,
    id: currentRoom ? `room-${currentRoom}` : undefined,
    boardOrientation: color,
    showAnimations,
    squareStyles,
  };


  return (
    <>
      <Chessboard options={chessBoardOptions} />
    </>
  );
}
