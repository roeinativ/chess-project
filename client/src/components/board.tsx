import { useState, useRef, useContext } from "react";
import { Chessboard, fenStringToPositionObject, type SquareHandlerArgs, defaultPieces, type PieceRenderObject } from "react-chessboard";
import { Chess } from "chess.js";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { gameOnContext } from "@/contexts/gameOnContext";
import { gameSocket } from "@/hooks/game.socket";
import type { PieceSymbol, Square } from "chess.js";
import type { onPieceDropArgs } from "@/hooks/game.socket";
import { useChessGame } from "@/hooks/listenForMoves";




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

  const [moveFrom,setMoveFrom] = useState<string>('')
  const [optionSquares, setOptionSquares] = useState<Record<string, React.CSSProperties>>({});

  const [promotionMove, setPromotionMove] = useState<{ sourceSquare: string, targetSquare: string } | null>(null);
  


  // Mount socket listeners
  useChessGame({
    chessGameRef,
    setFen,
    setIsTurn,
    setGameOn,
    setCurrentRoom,
    PresentWinner,
    handlePreMoves,
  })


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
          promotion: "",
        })

        makeMove(move.from,move.to, "")
         
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

  
  // Handle dragging a piece

  function onPieceDrop({ sourceSquare, targetSquare}: onPieceDropArgs) {
    // Checks if the target square is not null
    if (!targetSquare) return false;


    const promotionRank = pieceColor === "w" ? "8" : "1"
    if (targetSquare.endsWith(promotionRank)){
      const possibleMoves = chessGame.moves({ square: sourceSquare as Square });
      if (possibleMoves.some(move => move.includes("="))) {
        setPromotionMove({ sourceSquare, targetSquare });
        return true; 
      }
    }
    

    // Makes the move the local chess lib validates it
    let move = null

    if (isTurn){
      try {
        move = chessGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "",
        });
      }
    
      catch (error) {
        return true
      }
    
      if (!move) return false;
    
      makeMove(move.from,move.to, "")
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


  // A function that clears all premoves when right clicks

  function onSquareRightClick() {
    preMovesRef.current = []
    setPremoves([...preMovesRef.current])

    setMoveFrom('')
    setOptionSquares({})

    setShowAnimations(false)

    setTimeout(() => {
      setShowAnimations(true)
    }, 50)
  }

  // A function allows the player to drag only his own pieces 

  function isMyPiece({ square }: { square: string | null }): boolean {
    if (!square) return false;
    
    const piece = position[square]

    if (!piece) {
      return false
    }

    return piece.pieceType[0] === pieceColor
  }


  // Add click to move
function onSquareClick({ square, piece }: SquareHandlerArgs) {
  if (!isTurn) return;

  if (!moveFrom && piece && piece.pieceType[0] === pieceColor) {
    const moves = chessGame.moves({ square: square as Square, verbose: true });
    if (moves.length === 0) return;

    const newSquares: Record<string, React.CSSProperties> = {};
    for (const move of moves) {
      newSquares[move.to] = {
        background: chessGame.get(move.to as Square)
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
    }
    newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };

    setMoveFrom(square);
    setOptionSquares(newSquares);
    return;
  }

  if (moveFrom) {

    // Check if it's a promotion move before attempting it
    const promotionRank = pieceColor === "w" ? "8" : "1";
    if (square.endsWith(promotionRank)) {
      const possibleMoves = chessGame.moves({ square: moveFrom as Square });
      if (possibleMoves.some(m => m.includes("="))) {
        setPromotionMove({ sourceSquare: moveFrom, targetSquare: square });
        setMoveFrom('');
        setOptionSquares({});
        return; // wait for user to pick promotion piece
      }
    }

    let move = null;
    try {
      move = chessGame.move({ from: moveFrom, to: square, promotion: "" });
    } catch {
      const moves = chessGame.moves({ square: square as Square, verbose: true });
      if (moves.length > 0 && piece?.pieceType[0] === pieceColor) {
        setMoveFrom(square);
      } else {
        setMoveFrom('');
        setOptionSquares({});
      }
      return;
    }

    makeMove(move.from, move.to, "");
    setMoveFrom('');
    setOptionSquares({});
  }
}

function onPromotionPieceSelect(piece: "q" | "r" | "n" | "b") {
  if (!promotionMove) return;

  // Make move locally
  let move = null;
  try {
    move = chessGame.move({
      from: promotionMove.sourceSquare,
      to: promotionMove.targetSquare,
      promotion: piece,
    });
  } catch (e) {
    console.log("Local chess.js error:", e);
    console.log("FEN:", chessGame.fen());
    console.log("From:", promotionMove.sourceSquare, "To:", promotionMove.targetSquare);
    setPromotionMove(null);
    return;
  }


  makeMove(move.from, move.to, piece);
  setPromotionMove(null);
}



  // Render premoves

    const position = fenStringToPositionObject(fen, 8, 8);
    const squareStyles: Record<string, React.CSSProperties> = { ...optionSquares };

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
    onSquareClick,
    position: position,
    id: currentRoom ? `room-${currentRoom}` : undefined,
    boardOrientation: color,
    showAnimations,
    squareStyles,
  };


return (
  <div style={{ position: "relative" }}>
    {promotionMove && (
      <div
        onClick={() => setPromotionMove(null)}
        onContextMenu={(e) => { e.preventDefault(); setPromotionMove(null); }}
        style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        }}
      />
    )}

    {promotionMove && (
      <div style={{
        position: "absolute",
        top: pieceColor === "w" ? 0 : "auto",
        bottom: pieceColor === "b" ? 0 : "auto",
        left: `${(promotionMove.targetSquare.charCodeAt(0) - 97) * 12.5}%`,
        width: "12.5%",
        backgroundColor: "white",
        zIndex: 1001,
        display: "flex",
        flexDirection: "column",
      }}>
        {(["q", "r", "n", "b"] as const).map((piece) => (
          <button
            key={piece}
            onClick={() => onPromotionPieceSelect(piece)}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              width: "100%", aspectRatio: "1", border: "none",
              cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: "white",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
          >
            {defaultPieces[`${pieceColor}${piece.toUpperCase()}` as keyof PieceRenderObject]()}
          </button>
        ))}
      </div>
    )}

    <Chessboard options={chessBoardOptions} />
  </div>
);
}
