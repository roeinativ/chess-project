import { Card, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import * as Types from "@/types/types";

export default function GameOverScreen({
  endingMessage,
  navHome,
  navHistory,
  StartWaiting,
}: Types.GameOverScreenType) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-1">
      <Card className="w-120">
        <CardHeader>
          <CardTitle className="text-2xl">{endingMessage}</CardTitle>
        </CardHeader>

        <CardFooter className="flex justify-center text-md">
          <div className="flex gap-5">
            <Button className="!bg-green-700" onClick={navHome}>
              Return to home
            </Button>

            <Button onClick={StartWaiting} className="!bg-green-700">
              New Game
            </Button>

            <Button onClick={navHistory} className="!bg-green-700">Game history</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
