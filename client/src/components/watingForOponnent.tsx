import { Card, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import * as Types from "@/types/types";

export default function WaitingForOpponentScreen({
  cancelMatchmaking,
}: Types.WaitingForOpponentScreenType) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-1">
      <Card className="w-120">
        <CardHeader>
          <CardTitle>Waiting for opponent to join</CardTitle>
          <p>.....</p>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button className="!bg-green-700" onClick={cancelMatchmaking}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
