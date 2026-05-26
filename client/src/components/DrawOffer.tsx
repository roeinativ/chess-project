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
    <AlertDialog open={drawOffer}>
      <AlertDialogContent className="bg-[#111] border-[#c8a96e]/20 text-white max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-lg">Draw Offered</AlertDialogTitle>
          <AlertDialogDescription className="text-white/40">
            Your opponent is offering a draw. Do you accept?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center gap-3 w-full sm:justify-center">
          <AlertDialogCancel
            onClick={() => handleResponse("decline")}
            className="flex-1 rounded-lg border cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", color: "#fff", borderColor: "rgba(255,255,255,0.12)" }}
          >
            Decline
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleResponse("accept")}
            className="flex-1 rounded-lg cursor-pointer border-0"
            style={{ background: "#c8a96e", color: "#0a0a0a" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#d4ba85")}
            onMouseLeave={e => (e.currentTarget.style.background = "#c8a96e")}
          >
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}