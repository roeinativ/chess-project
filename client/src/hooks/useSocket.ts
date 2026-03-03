import { useEffect, useRef, useContext } from "react";
import { homeSocket, type onJoinHomeData } from "./home.socket";
import { gameSocket, type OnJoinGameData } from "./game.socket";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import { socket } from "./socket";

export default function useSocket() {
  const { username, setUserName } = useContext(userContext)
  const { currentRoom, setCurrentRoom } = useContext(roomContext) 
  const joined_home = useRef(false);

  // Join home once when connecting
  useEffect(() => {
    const handleConnect = () => {
      if (!joined_home.current) {
        homeSocket.joinHome(username);
        joined_home.current = true;
      }
    }

    socket.once("connect", handleConnect);
    
  }, []);

  // Handle join home 
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

  // Handle join game 
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


  // Send server to join a game
  const joinGame = () => {
    gameSocket.joinGame(username, currentRoom);
  };

  // Send server your move




  return { joinGame: joinGame };
}
