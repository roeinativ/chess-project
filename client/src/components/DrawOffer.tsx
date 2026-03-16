import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import * as Types from "@/types/types";

export default function DrawOffer({
  drawOffer,
  response,
  setDrawOffer,
}: Types.DrawOfferType) {
  const handleResponse = (value: string) => {
    response(value);
    setDrawOffer(false);
  };

  return (
    <>
      <AlertDialog open={drawOffer}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Would you accept opponents offer for a draw?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action can not be undone
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="flex flex-row justify-center w-full gap-10">
              <AlertDialogCancel
                onClick={() => handleResponse("decline")}
                className="!bg-green-700"
              >
                Decline
              </AlertDialogCancel>
              <AlertDialogAction
                className="!bg-green-700"
                onClick={() => handleResponse("accept")}
              >
                Accept
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
