import Board from "@/components/board";
import { useEffect, useState, useContext } from "react";
import { gameSocket } from "@/hooks/game.socket";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { gameOnContext } from "@/contexts/gameOnContext";

import {type onWaitingForGameData } from "@/hooks/game.socket";

export default function Game() {
  const [waitingForGame,setWaitingForGame] = useState<boolean>(true)
  const [winner,setWinner] = useState<string | null>(null)  
  const navigate = useNavigate()

  const { currentRoom, setCurrentRoom } = useContext(roomContext)
  const { color, setColor } = useContext(colorContext)
  const [gameOn,setGameOn] = useState<boolean>(false)

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
        {isGameOver() && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-1">
            <Card className="w-120">
              <CardHeader>
                <CardTitle className="text-2xl"> {winner === "white" || winner === "black" ? `${winner} has won the game` : "Tie"} </CardTitle>
              </CardHeader>

              <CardFooter className="flex justify-center text-lg">
                <div className="flex gap-5">
                  <Button className="!bg-green-700" onClick={navHome}>Return to home</Button>
                  <Button className="!bg-green-700">New Game</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}



          { waitingForGame && <Card>
            <CardHeader>
              <CardTitle>Waiting for opponent to join</CardTitle>
              <p>.....</p>
            </CardHeader>

            <CardFooter className="flex justify-center">
              <Button onClick={cancelMatchmaking}>Cancel</Button>
            </CardFooter>
          </Card>}


          {!waitingForGame && <Board PresentWinner={(winner) => setWinner(winner)}/>}
        </div>

      </gameOnContext.Provider>    

    </>
  );
}
