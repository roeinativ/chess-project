import Board from "@/components/board";
import { useEffect, useState, useContext } from "react";
import { gameSocket } from "@/hooks/game.socket";
import { useNavigate } from "react-router-dom";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { gameOnContext } from "@/contexts/gameOnContext";
import { modeContext } from "@/contexts/modeContext";
import { Chessboard } from "react-chessboard";
import { type onWaitingForGameData } from "@/hooks/game.socket";
import useSocket from "@/hooks/useSocket";
import DigitalClock from "@/components/digitalClock";
import ResignDialog from "@/components/ResignDialog";
import DrawDialog from "@/components/DrawDialog";
import WaitingForOpponentScreen from "@/components/watingForOponnent";
import GameOverScreen from "@/components/gameOverScreen";
import DrawOffer from "@/components/DrawOffer";

export default function Game() {
  const [waitingForGame, setWaitingForGame] = useState<boolean>(true);
  const [endingMessage, setEndingMessage] = useState<string | null>("");
  const navigate = useNavigate();

  const { currentRoom, setCurrentRoom } = useContext(roomContext);
  const { color, setColor } = useContext(colorContext);
  const { mode, setMode } = useContext(modeContext);

  const [gameOn, setGameOn] = useState<boolean>(false);
  const [drawOffer, setDrawOffer] = useState<boolean>(false);

  const pieceColor = color === "white" ? "w" : "b";
  const [isTurn, setIsTurn] = useState<boolean>(false);

  useEffect(() => {
    setIsTurn(color === "white");
  }, [color]);

  const { joinGame } = useSocket({ setDrawOffer });

  const navHome = () => {
    navigate("/");
  };

  const cancelMatchmaking = () => {
    navHome();
    gameSocket.cancelMatchmaking(currentRoom);
  };

  const isGameOver = () => {
    return !gameOn && !waitingForGame;
  };

  const StartWaiting = () => {
    joinGame(mode);
    setWaitingForGame(true);
  };

  const isModePVP = () => {
    return mode === "PVP";
  };

  useEffect(() => {
    const handleGameStart = (data: onWaitingForGameData) => {
      setColor(data.color);
      setWaitingForGame(false);
      setGameOn(true);
    };

    gameSocket.onWaitingForGame(handleGameStart);

    return () => {
      gameSocket.offWaitingForGame();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center">
      <gameOnContext.Provider value={{ gameOn, setGameOn }}>
        <div className="relative">
          {waitingForGame && (
            <WaitingForOpponentScreen cancelMatchmaking={cancelMatchmaking} />
          )}

          {isGameOver() && (
            <GameOverScreen
              endingMessage={endingMessage}
              navHome={navHome}
              StartWaiting={StartWaiting}
            />
          )}

          {!waitingForGame ? (
            <div className="flex gap-4 items-stretch pl-50">
              {isModePVP() && (
                <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-10 pl-10 items-start">
                  <ResignDialog
                    resign={() => gameSocket.resign(color, currentRoom)}
                  />
                  <DrawDialog
                    draw={() => gameSocket.emitDraw(currentRoom, "offer")}
                  />

                  <DrawOffer
                    drawOffer={drawOffer}
                    response={(drawResponseMessage) =>
                      gameSocket.emitDraw(currentRoom, drawResponseMessage)
                    }
                    setDrawOffer={setDrawOffer}
                  />
                </div>
              )}

              <div className="relative w-160">
                <Board
                  setEndingMessage={(endingMessage) =>
                    setEndingMessage(endingMessage)
                  }
                  isTurn={isTurn}
                  setIsTurn={setIsTurn}
                />
              </div>

              {isModePVP() && (
                <div className="flex flex-col justify-between">
                  <DigitalClock
                    isTurn={!isTurn}
                    pieceColor={pieceColor === "w" ? "b" : "w"}
                    isGameOver={isGameOver}
                  />
                  <DigitalClock
                    isTurn={isTurn}
                    pieceColor={pieceColor === "w" ? "w" : "b"}
                    isGameOver={isGameOver}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="w-160">
              <Chessboard />
            </div>
          )}
        </div>
      </gameOnContext.Provider>
    </div>
  );
}
