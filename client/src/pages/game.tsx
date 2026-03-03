import Board from "@/components/board";
import { useEffect, useState, useContext } from "react";
import { gameSocket } from "@/hooks/game.socket";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";

import {type onWaitingForGameData } from "@/hooks/game.socket";

export default function Game() {
  const [waitingForGame,setWaitingForGame] = useState<boolean>(true)
  const navigate = useNavigate()
  const { currentRoom, setCurrentRoom } = useContext(roomContext)
  const { color, setColor } = useContext(colorContext)

  const navHome = () => {
    navigate("/")
  }

  const cancelMatchmaking = () => {
    navHome()
    gameSocket.cancelMatchmaking(currentRoom)
  }

  // Listen for when game starts and waiting screen can be removed.
  useEffect(() => {
    const handleGameStart = (data: onWaitingForGameData) => {
      setColor(data.color)
      setWaitingForGame(false)
      console.log("Game started")
    }

    gameSocket.onWaitingForGame(handleGameStart)

    return () => {
      gameSocket.offWaitingForGame()
    }
  }, [])

  return (
    <>
      <div className="w-160">
        
        { waitingForGame && <Card>
          <CardHeader>
            <CardTitle>Waiting for opponent to join</CardTitle>
            <p>.....</p>
          </CardHeader>

          <CardFooter className="flex justify-center">
            <Button onClick={cancelMatchmaking}>Cancel</Button>
          </CardFooter>
        </Card>}

        {!waitingForGame && <Board />}
      </div>
    </>
  );
}
