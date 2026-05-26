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
import { useState } from "react";

type DrawDialogType = {
  draw: () => void;
};

export default function DrawDialog({ draw }: DrawDialogType) {
  const [cooldown, setCooldown] = useState(false);

  const handleDraw = () => {
    draw();
    setCooldown(true);
    setTimeout(() => setCooldown(false), 10000);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={cooldown}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "rgba(200,169,110,0.08)", color: "#c8a96e", borderColor: "rgba(200,169,110,0.25)" }}
          onMouseEnter={e => { if (!cooldown) { e.currentTarget.style.background = "rgba(200,169,110,0.18)"; e.currentTarget.style.borderColor = "rgba(200,169,110,0.5)"; }}}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(200,169,110,0.08)"; e.currentTarget.style.borderColor = "rgba(200,169,110,0.25)"; }}
        >
          {cooldown ? "Offer Sent…" : "Offer Draw"}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#111] border-[#c8a96e]/20 text-white max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-lg">Offer a draw?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/40">
            Your opponent will be asked to accept or decline.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center gap-3 w-full sm:justify-center">
          <AlertDialogCancel
            className="flex-1 rounded-lg border cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", color: "#fff", borderColor: "rgba(255,255,255,0.12)" }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDraw}
            className="flex-1 rounded-lg cursor-pointer border-0"
            style={{ background: "#c8a96e", color: "#0a0a0a" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#d4ba85")}
            onMouseLeave={e => (e.currentTarget.style.background = "#c8a96e")}
          >
            Send Offer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}