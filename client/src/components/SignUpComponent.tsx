import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  InputGroup,
  InputGroupButton,
  InputGroupAddon,
  InputGroupInput,
} from "./ui/input-group";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import * as Types from "@/types/types";

export default function SignUpComponent({
  navSignIn,
  signUp,
  enterUsername,
  setEnterUsername,
  password,
  setPassword,
  errorMessage,
}: Types.SignUpType) {
  const [passwordHidden, setPasswordHidden] = useState<boolean>(true);

  const togglePassword = () => {
    return passwordHidden ? false : true;
  };

  return (
    <main>
      <Card className="w-120 text-left">
        <CardHeader className="items-start">
          <CardTitle className="text-2xl">Sign up to chess games</CardTitle>
          <CardDescription>
            Enter your username and password below to sign up
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="!border-none !bg-transparent"
              onClick={navSignIn}
            >
              Sign in
            </Button>
          </CardAction>
        </CardHeader>

        <form onSubmit={signUp}>
          <div className="flex flex-col gap-4 w-3/4 mx-auto">
            <div className="flex flex-col gap-4">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={enterUsername}
                onChange={(e) => setEnterUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-4 mt-3">
              <Label htmlFor="password">Password</Label>

              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={passwordHidden ? "password" : "text"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputGroupAddon align={"inline-end"}>
                  <InputGroupButton
                    className="!bg-transparent"
                    variant={"ghost"}
                    size={"icon-xs"}
                    onClick={() => setPasswordHidden(togglePassword)}
                  >
                    {passwordHidden ? <EyeIcon /> : <EyeOffIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <Button
              type="submit"
              value="Submit"
              onClick={() => console.log("Submited")}
              className="!bg-green-700"
            >
              Sign Up
            </Button>


            {errorMessage != "" &&
              <Alert variant={"destructive"}>
                <AlertCircleIcon/>
                <AlertTitle>Sign up failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            }

          </div>
        </form>
      </Card>
    </main>
  );
}
