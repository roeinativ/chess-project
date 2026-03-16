import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

import { Button } from "./ui/button";
import { useState } from "react";

type DrawDialogType = {
  draw: () => void;
};

export default function DrawDialog({ draw }: DrawDialogType) {
  const [cooldown, setCooldown] = useState(false);

  const handleDraw = () => {
    draw();
    setCooldown(true);

    setTimeout(() => {
      setCooldown(false);
    }, 10000);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-80 !bg-green-700" disabled={cooldown}>
            Draw
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to offer draw?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action can not be undone
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="flex flex-row justify-center w-full gap-10">
              <AlertDialogCancel className="!bg-green-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction className="!bg-green-700" onClick={handleDraw}>
                Continue
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
