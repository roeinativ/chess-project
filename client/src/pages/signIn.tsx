import { useState, useContext } from "react";
import { socket } from "@/hooks/socket";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userContext } from "@/contexts/userContext";
import { setStoredUsername } from "@/hooks/storeUserName";
import { useNavigate } from "react-router-dom";
import { signedInContext } from "@/contexts/signedInContext";
import { signInFetch } from "@/services/signInFetch";

export default function SignInPage() {
  const [enterUsername, setEnterUsername] = useState("");
  const [password, setPassword] = useState("");
  const { username, setUserName } = useContext(userContext);
  const { signedIn, setSignedIn } = useContext(signedInContext);

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
      const data = await signInFetch(enterUsername, password);

      setSignedIn(true);
      setUserName(data.username);
      setStoredUsername(data.username);
      emitSignIn(data.username);
      navHome();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card className="w-120 text-left">
        <CardHeader className="items-start">
          <CardTitle className="text-2xl">Sign in to chess games</CardTitle>
          <CardDescription>
            Enter your username and password below to sign in
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="!border-none !bg-transparent"
              onClick={navSignUp}
            >
              Sign up
            </Button>
          </CardAction>
        </CardHeader>

        <form onSubmit={signIn} className="">
          <div className="flex flex-col gap-3 w-3/4 mx-auto">
            <Input
              type="text"
              placeholder="Enter username"
              value={enterUsername}
              onChange={(e) => setEnterUsername(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" value="Submit" className="!bg-green-700">
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
