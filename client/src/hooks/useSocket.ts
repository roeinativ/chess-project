import { useEffect, useState, useRef, useContext } from "react";
import { homeSocket, type onJoinHomeData } from "./home.socket";
import { gameSocket, type OnJoinGameData, type moveData } from "./game.socket";
import { userContext } from "@/contexts/userContext";

export default function useSocket() {
  const { username, setUserName} = useContext(userContext)
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const joined_home = useRef(false);

  useEffect(() => {
    if (!joined_home.current) {
      homeSocket.joinHome(username);
      joined_home.current = true;
    }
  }, []);

  useEffect(() => {
    const handleJoinHome = (data: onJoinHomeData) => {
      setCurrentRoom(data.room);
      console.log(data.username, "has joined to", data.room);
    };

    homeSocket.onJoinHome(handleJoinHome);

    return () => {
      homeSocket.offJoinHome();
    };
  }, []);

  useEffect(() => {
    const handleJoinGame = (data: OnJoinGameData) => {
      setCurrentRoom(data.room);
      console.log("Being added to game room number", data.room);
    };

    gameSocket.onJoinGame(handleJoinGame);

    return () => {
      gameSocket.offJoinGame();
    };
  }, []);

  const joinGame = () => {
    gameSocket.joinGame(username, currentRoom);
  };

  const makeMove = (from: string, to: string, promotion: string) => {
    gameSocket.makeMove(username,from,to,promotion)
    console.log("Sent server move")
  }



  return { joinGame: joinGame, makeMove: makeMove };
}
