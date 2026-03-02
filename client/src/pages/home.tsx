import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useSocket from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { userContext } from "@/contexts/userContext";

export default function HomePage() {
  const { username, setUserName} = useContext(userContext)

  const navigate = useNavigate();

  const navGame = () => {
    navigate("/game");
  };

  // Mount socket listeners
  const { joinGame } = useSocket();

  const enterGame = () => {
    joinGame();
    navGame();
  };

  return (
    <>
      <h1>Welcome to chess games</h1>
      <Button onClick={enterGame}>Join Game</Button>
    </>
  );
}
