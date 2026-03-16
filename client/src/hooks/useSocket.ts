import { useEffect, useContext, type SetStateAction } from "react";
import { homeSocket } from "./home.socket";
import { gameSocket } from "./game.socket";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import * as Types from "@/types/types";

type listenForDrawType = {
  setDrawOffer?: React.Dispatch<SetStateAction<boolean>>;
};

export default function useSocket({ setDrawOffer }: listenForDrawType = {}) {
  const { username, setUserName } = useContext(userContext);
  const { currentRoom, setCurrentRoom } = useContext(roomContext);

  // Handle join home
  useEffect(() => {
    const handleJoinHome = (data: Types.OnJoinGameData) => {
      setCurrentRoom(data.room);
      console.log(data.username, "has joined to", data.room);
    };

    homeSocket.onJoinHome(handleJoinHome);

    return () => {
      homeSocket.offJoinHome();
    };
  }, []);

  // Handle join game
  useEffect(() => {
    const handleJoinGame = (data: Types.OnJoinGameData) => {
      setCurrentRoom(data.room);
      console.log("Being added to game room number", data.room);
    };

    gameSocket.onJoinGame(handleJoinGame);

    return () => {
      gameSocket.offJoinGame();
    };
  }, []);

  // Listen for draw offer
  useEffect(() => {
    const handleDrawOffer = () => {
      setDrawOffer?.(true);
    };

    gameSocket.listenForDraw(handleDrawOffer);

    return () => {
      gameSocket.offListenForDraw();
    };
  }, []);

  // Send server to join a game
  const joinGame = (mode: "PVP" | "PVE" | null) => {
    gameSocket.joinGame(username, mode);
  };

  return { joinGame: joinGame };
}
