import { useState, useContext } from "react";
import { socket } from "@/hooks/socket";
import { userContext } from "@/contexts/userContext";
import { setStoredUsername } from "@/hooks/storeUserName";
import { useNavigate } from "react-router-dom";
import { signedInContext } from "@/contexts/signedInContext";
import { authFetch } from "@/services/authFetch";
import SignInComponent from "@/components/SignInComponent";

export default function SignInPage() {
  const [enterUsername, setEnterUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage,setErrorMessage] = useState('')
  const { username, setUserName } = useContext(userContext);
  const { signedIn, setSignedIn } = useContext(signedInContext);
  const endpoint = "signIn"

  const navigate = useNavigate();

  const navHome = () => {
    navigate("/");
  };

  const navSignUp = () => {
    navigate("/sign-up");
  };

  const emitSignIn = (username: string) => {
    socket.emit("sign_in", {
      username: username,
    });
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await authFetch({endpoint,enterUsername, password});

      setSignedIn(true);
      setUserName(data.username);
      setStoredUsername(data.username);
      emitSignIn(data.username);
      navHome();
    } 
    
    catch (error) {
      setErrorMessage((error as Error).message)
      console.log(error);
    }
  };

  return (
    <>
      <SignInComponent 
        navSignUp={navSignUp}
        signIn={signIn}
        enterUsername={enterUsername}
        setEnterUsername={setEnterUsername}
        password={password}
        setPassword={setPassword}
        errorMessage={errorMessage}
      />
    </>
  );
}
