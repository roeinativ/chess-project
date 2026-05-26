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
import * as Types from "@/types/types";

export default function ResignDialog({ resign }: Types.ResignDialogType) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer border"
          style={{ background: "rgba(239,68,68,0.08)", color: "rgb(252,165,165)", borderColor: "rgba(239,68,68,0.25)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}
        >
          Resign
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#111] border-[#c8a96e]/20 text-white max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-lg">Resign the game?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/40">
            You will lose the game. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center gap-3 w-full sm:justify-center">
          <AlertDialogCancel
            className="flex-1 rounded-lg border cursor-pointer transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#fff", borderColor: "rgba(255,255,255,0.12)" }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={resign}
            className="flex-1 rounded-lg cursor-pointer transition-all border-0"
            style={{ background: "rgba(239,68,68,0.15)", color: "rgb(252,165,165)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
          >
            Resign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}