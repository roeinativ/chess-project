import { Input } from "@/components/ui/input";
import { useState, useContext } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { socket } from "@/hooks/socket";
import { userContext } from "@/contexts/userContext";
import { setStoredUsername } from "@/hooks/storeUserName";

export default function SignUpPage() {
  const BASE = "http://localhost:5555";
  const [enter_username, setEnterUsername] = useState<string>("");
  const { username, setUserName } = useContext(userContext);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE}/signUp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: enter_username,
          sid: socket.id,
        }),
      });

      const data = await res.json();
      const message = data[0]

      if (res.ok) {
        setUserName(message.username);
        setStoredUsername(message.username);
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card className="w-120 text-left">
        <CardHeader className="items-start">
          <CardTitle className="text-2xl">Sign up to chess games</CardTitle>
          <CardDescription>
            Enter your username and password below to sign up
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign up</Button>
          </CardAction>
        </CardHeader>

        <form onSubmit={signUp} className="">
          <div className="flex flex-col gap-3 w-3/4 mx-auto">
            <Input
              type="text"
              placeholder="Enter username"
              value={enter_username}
              onChange={(e) => setEnterUsername(e.target.value)}
            />

            <Button
              type="submit"
              value="Submit"
              onClick={() => console.log("Submited")}
              className="!bg-green-700"
            >
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
