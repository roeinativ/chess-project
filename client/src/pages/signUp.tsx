import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "@/contexts/userContext";
import { authFetch } from "@/services/authFetch";
import SignUpComponent from "@/components/SignUpComponent";

export default function SignUpPage() {
  const [enterUsername, setEnterUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { username, setUserName } = useContext(userContext);
  const endpoint = "signUp"

  const navigate = useNavigate();

  const navSignIn = () => {
    navigate("/sign-in");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authFetch({endpoint,enterUsername, password});
      navSignIn();
    } 
    
    catch (error) {
      setErrorMessage((error as Error).message)
      console.log(error);
    }
  };

  return (
    <>
      <SignUpComponent 
        navSignIn={navSignIn}
        signUp={signUp}
        enterUsername={enterUsername}
        setEnterUsername={setEnterUsername}
        password={password}
        setPassword={setPassword}
        errorMessage={errorMessage}
      />
    </>
  );
}
