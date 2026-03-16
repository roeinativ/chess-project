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
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import * as Types from "@/types/types";

export default function ResignDialog({ resign }: Types.ResignDialogType) {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-80 !bg-green-700">Resign</Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to resign?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will mean you will lose the game. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="flex flex-row justify-center gap-10 w-full">
              <AlertDialogCancel className="!bg-green-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={resign} className="!bg-green-700">
                Continue
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
