import Board from "@/components/board";
import { useEffect, useState, useContext } from "react";
import { gameSocket } from "@/hooks/game.socket";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { gameOnContext } from "@/contexts/gameOnContext";
import { Chessboard } from "react-chessboard";
import {type onWaitingForGameData } from "@/hooks/game.socket";
import useSocket from "@/hooks/useSocket";

export default function Game() {
  const [waitingForGame,setWaitingForGame] = useState<boolean>(true)
  const [winner,setWinner] = useState<string | null>(null)  
  const navigate = useNavigate()

  const { currentRoom, setCurrentRoom } = useContext(roomContext)
  const { color, setColor } = useContext(colorContext)
  const [gameOn,setGameOn] = useState<boolean>(false)

  const { joinGame } = useSocket()

  const navHome = () => {
    navigate("/")
  }

  const cancelMatchmaking = () => {
    navHome()
    gameSocket.cancelMatchmaking(currentRoom)
  }


  const isGameOver = () => {
    return !gameOn && !waitingForGame
  }

  const StartWaiting = () => {
    joinGame()
    setWaitingForGame(true)
  }

  // Listen for when game starts and waiting screen can be removed.
  useEffect(() => {
    const handleGameStart = (data: onWaitingForGameData) => {
      setColor(data.color)
      setWaitingForGame(false)
      setGameOn(true)
      console.log("Game started")
    }

    gameSocket.onWaitingForGame(handleGameStart)

    return () => {
      gameSocket.offWaitingForGame()
    }
  }, [])


  return (
    <>
      <gameOnContext.Provider value={{gameOn,setGameOn}}>

        <div className="w-160 relative">

          { waitingForGame && 
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-1">
            <Card className="w-120">
              <CardHeader>
                <CardTitle>Waiting for opponent to join</CardTitle>
                <p>.....</p>
              </CardHeader>

              <CardFooter className="flex justify-center">
                <Button className="!bg-green-700" onClick={cancelMatchmaking}>Cancel</Button>
              </CardFooter>
            </Card>
          </div>
          }



        {isGameOver() && 
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-1">
            <Card className="w-120">
              <CardHeader>
                <CardTitle className="text-2xl"> {winner === "white" || winner === "black" ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} has won the game` : "Tie"} </CardTitle>
              </CardHeader>

              <CardFooter className="flex justify-center text-lg">
                <div className="flex gap-5">
                  <Button className="!bg-green-700" onClick={navHome}>Return to home</Button>
                  <Button onClick={StartWaiting} className="!bg-green-700">New Game</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        }

          {/*Render dummy board in background and not real board with socket listeners*/}
          {!waitingForGame ? <Board PresentWinner={(winner) => setWinner(winner)}/> : <Chessboard/>}
        </div>

      </gameOnContext.Provider>    

    </>
  );
}
