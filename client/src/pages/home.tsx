import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { userContext } from "@/contexts/userContext";
import { modeContext } from "@/contexts/modeContext";
import { signedInContext } from "@/contexts/signedInContext";
import { removeStoredUsername } from "@/hooks/storeUserName";
import { socket } from "@/hooks/socket";


export default function HomePage() {
  const { username, setUserName } = useContext(userContext);
  const { signedIn, setSignedIn } = useContext(signedInContext);

  const { mode, setMode } = useContext(modeContext);

  const navigate = useNavigate();

  const navGame = () => {
    navigate("/game");
  };
  
  const navHistory = () => {
    navigate("/history")
  }

  const navSignUp = () => {
    navigate("/sign-up")
  }

    const navSignIn = () => {
    navigate("/sign-in")
  }

  // Mount socket listeners
  const { joinGame } = useSocket();

  const enterGame = (mode: "PVP" | "PVE") => {
    setMode(mode);
    joinGame(mode);
    navGame();
  };

  const signOut = () => {
    socket.emit("sign_out");
    setSignedIn(false);
    removeStoredUsername();
    console.log("Emited sign out");
  };

  return (
    <main>
      <h1>Welcome to chess games</h1>
      <div className="flex justify-center gap-5">
        <Button onClick={() => enterGame("PVP")} className="!bg-green-700">
          Play against player
        </Button>

        <Button onClick={() => enterGame("PVE")} className="!bg-green-700">
          Play against computer
        </Button>

        <Button onClick={navHistory}>Game History</Button>

        {!signedIn && (
          <div>
            <Button onClick={navSignUp}>Sign up</Button>
            <Button onClick={navSignIn}>Sign in</Button>
          </div>
        )}


        {signedIn && (
          <Button onClick={signOut} className="!bg-green-700">
            Sign out
          </Button>
        )}
      </div>
    </main>
  );
}
