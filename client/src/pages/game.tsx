import Board from "@/components/board";
import { useEffect, useState, useContext } from "react";
import { gameSocket } from "@/hooks/game.socket";
import { useNavigate } from "react-router-dom";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { gameOnContext } from "@/contexts/gameOnContext";
import { modeContext } from "@/contexts/modeContext";
import { signedInContext } from "@/contexts/signedInContext";
import { Chessboard } from "react-chessboard";
import useSocket from "@/hooks/useSocket";
import DigitalClock from "@/components/digitalClock";
import ResignDialog from "@/components/ResignDialog";
import DrawDialog from "@/components/DrawDialog";
import WaitingForOpponentScreen from "@/components/watingForOponnent";
import GameOverScreen from "@/components/gameOverScreen";
import DrawOffer from "@/components/DrawOffer";
import * as Types from "@/types/types";

export default function Game() {
  const [waitingForGame, setWaitingForGame] = useState<boolean>(true);
  const [endingMessage, setEndingMessage] = useState<string | null>("");
  const navigate = useNavigate();

  const { currentRoom, setCurrentRoom } = useContext(roomContext);
  const { color, setColor } = useContext(colorContext);
  const { mode } = useContext(modeContext);
  const { signedIn } = useContext(signedInContext);

  const [gameOn, setGameOn] = useState<boolean>(false);
  const [drawOffer, setDrawOffer] = useState<boolean>(false);

  const pieceColor = color === "white" ? "w" : "b";
  const [isTurn, setIsTurn] = useState<boolean>(false);

  useEffect(() => { setIsTurn(color === "white"); }, [color]);

  // Must be called before the game start listener so draw works
  useSocket({ setDrawOffer });

  const navHome    = () => navigate("/");
  const navHistory = () => signedIn ? navigate("/history") : navigate("/sign-in");
  const cancelMatchmaking = () => { navHome(); gameSocket.cancelMatchmaking(currentRoom); };
  const isGameOver = () => !gameOn && !waitingForGame;
  const StartWaiting = () => { gameSocket.joinGame(null, mode); setWaitingForGame(true); setGameOn(false); };
  const isModePVP = () => mode === "PVP";

  // Listen for game start — must be registered early, server may respond immediately for PVE
  useEffect(() => {
    const handleGameStart = (data: Types.OnWaitingForGameData) => {
      setColor(data.color);
      setWaitingForGame(false);
      setGameOn(true);
    };
    gameSocket.onWaitingForGame(handleGameStart);
    return () => { gameSocket.offWaitingForGame(); };
  }, []);

  return (
    <gameOnContext.Provider value={{ gameOn, setGameOn }}>
      <main className="min-h-screen w-full bg-[#0a0a0a] relative">

        {/* Chess BG */}
        <div
          aria-hidden="true"
          className="fixed inset-0 opacity-[0.04] pointer-events-none"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8,1fr)",
            gridTemplateRows: "repeat(8,1fr)",
            transform: "rotate(-12deg) scale(1.6)",
          }}
        >
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} style={{ background: (Math.floor(i / 8) + (i % 8)) % 2 === 0 ? "#c8a96e" : "#2e1b0e" }} />
          ))}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
          * { font-family: 'DM Sans', sans-serif; }
        `}</style>

        {/* Overlays — z-50 so they always appear above the board */}
        {waitingForGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <WaitingForOpponentScreen cancelMatchmaking={cancelMatchmaking} />
          </div>
        )}
        {isGameOver() && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <GameOverScreen
              endingMessage={endingMessage}
              navHome={navHome}
              navHistory={navHistory}
              StartWaiting={StartWaiting}
            />
          </div>
        )}

        {/* Top bar */}
        <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#c8a96e]/10">
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ color: "#c8a96e", filter: "drop-shadow(0 0 8px rgba(200,169,110,0.5))" }}>♟</span>
            <span className="text-white/30 text-sm hidden sm:inline">
              {isModePVP() ? "Player vs Player" : "Player vs Computer"}
            </span>
          </div>
        </header>

        {/* Board layout */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-65px)] px-2 sm:px-6 py-6">
          {!waitingForGame ? (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full max-w-5xl">

              {/* Controls — row on mobile, column on desktop */}
              <div className="flex flex-row lg:flex-col gap-3 items-center order-2 lg:order-1">
                <ResignDialog resign={() => gameSocket.resign(color, currentRoom, mode)} />
                {isModePVP() && (
                  <>
                    <DrawDialog draw={() => gameSocket.emitDraw(currentRoom, "offer", mode)} />
                    <DrawOffer
                      drawOffer={drawOffer}
                      response={msg => gameSocket.emitDraw(currentRoom, msg, mode)}
                      setDrawOffer={setDrawOffer}
                    />
                  </>
                )}
              </div>

              {/* Board — NOT touched at all, just wrapped for sizing */}
              <div className="order-1 lg:order-2 w-full" style={{ maxWidth: "min(85vw, 580px)" }}>
                <Board
                  setEndingMessage={setEndingMessage}
                  isTurn={isTurn}
                  setIsTurn={setIsTurn}
                />
              </div>

              {/* Clocks */}
              {isModePVP() && (
                <div className="flex flex-row lg:flex-col justify-center gap-6 order-3">
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
            <div style={{ maxWidth: "min(85vw, 580px)", width: "100%" }}>
              <Chessboard />
            </div>
          )}
        </div>
      </main>
    </gameOnContext.Provider>
  );
}