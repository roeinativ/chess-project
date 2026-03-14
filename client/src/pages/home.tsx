import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useSocket from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { userContext } from "@/contexts/userContext";
import { modeContext } from "@/contexts/modeContext";
import { signedInContext } from "@/contexts/signedInContext";
import { removeStoredUsername } from "@/hooks/storeUserName";
import { socket } from "@/hooks/socket";

export default function HomePage() {
  const { username, setUserName} = useContext(userContext)
  const { signedIn,setSignedIn } = useContext(signedInContext)

  const { mode, setMode } = useContext(modeContext)
  

  const navigate = useNavigate();

  const navGame = () => {
    navigate("/game");
  };

  // Mount socket listeners
  const { joinGame } = useSocket();

  const enterGame = (mode: 'PVP' | 'PVE') => {
    setMode(mode)
    joinGame(mode);
    navGame();
  };



  const signOut = () => {
    socket.emit("sign_out")
    setSignedIn(false)
    removeStoredUsername()
    console.log("Emited sign out")
  }

  return (
    <>
      <h1>Welcome to chess games</h1>
      <div className="flex justify-center gap-5">      
        <Button onClick={() => enterGame('PVP')} className="!bg-green-700">Play against player</Button>

        <Button onClick={() => enterGame('PVE')} className="!bg-green-700">Play against computer</Button>
        
        { signedIn &&
        <Button onClick={signOut} className="!bg-green-700">Sign out</Button>}
      </div>

    </>
  );
}
