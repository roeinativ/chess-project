import {
  Table, TableBody, TableCaption, TableHeader,
  TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useEffect, useState } from "react";
import { userContext } from "@/contexts/userContext";
import { historyFetch } from "@/services/historyFetch";
import { useNavigate } from "react-router-dom";

type History = { turn: number; white_move: string | null; black_move: string | null };
type GameHistoryType = { first_username: string; second_username: string; winner: string; history: History[] };

export default function GameHistory() {
  const { username } = useContext(userContext);
  const [games, setGames] = useState<GameHistoryType[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameHistoryType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    historyFetch(username).then(data => setGames(data.games)).catch(console.log);
  }, []);

  const resultLabel = (game: GameHistoryType) => {
    const iWon =
      (game.winner === "white" && game.first_username === username) ||
      (game.winner === "black" && game.second_username === username);
    const iLost =
      (game.winner === "white" && game.first_username !== username) ||
      (game.winner === "black" && game.second_username !== username);
    if (iWon)  return { label: "Victory", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
    if (iLost) return { label: "Defeat",  cls: "text-red-400 bg-red-400/10 border-red-400/20" };
    return       { label: "Draw",    cls: "text-white/40 bg-white/5 border-white/10" };
  };

  return (
    <main className="min-h-screen w-full bg-[#0a0a0a] relative overflow-x-hidden">

      {/* Chess BG */}
      <div
        aria-hidden="true"
        className="fixed inset-0 opacity-[0.04] [transform:rotate(-12deg)_scale(1.6)] pointer-events-none"
        style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gridTemplateRows:"repeat(8,1fr)" }}
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} style={{ background:(Math.floor(i/8)+(i%8))%2===0 ? "#c8a96e" : "#2e1b0e" }} />
        ))}
      </div>
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse at 50% 30%, transparent 30%, #0a0a0a 80%)" }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        .gh-root { font-family: 'DM Sans', sans-serif; }
        .gh-title { font-family: 'Playfair Display', serif; }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)}  to{opacity:1;transform:translateY(0)} }
        .anim-hdr  { animation: fadeDown 0.5s ease both; }
        .anim-body { animation: fadeUp  0.5s 0.15s ease both; }
        .game-row:hover { background: rgba(200,169,110,0.05) !important; cursor: pointer; }
      `}</style>

      <div className="gh-root relative z-10 max-w-3xl mx-auto px-4 sm:px-8 py-8">

        {/* Header */}
        <header className="anim-hdr flex items-center justify-between mb-10 pb-5 border-b border-[#c8a96e]/15">
          <div className="flex items-center gap-3">
            <span className="text-2xl" style={{ color:"#c8a96e", filter:"drop-shadow(0 0 8px rgba(200,169,110,0.5))" }}>♟</span>
            <h1 className="gh-title text-2xl sm:text-3xl font-bold text-white">Game History</h1>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-white/40 hover:text-white transition-colors bg-transparent border-none cursor-pointer px-3 py-1.5"
          >
            ← Home
          </button>
        </header>

        {/* Stats row */}
        {games.length > 0 && (
          <div className="anim-body grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "Games",   value: games.length, cls: "text-white" },
              { label: "Wins",    value: games.filter(g => resultLabel(g).label === "Victory").length, cls: "text-emerald-400" },
              { label: "Defeats", value: games.filter(g => resultLabel(g).label === "Defeat").length,  cls: "text-red-400" },
            ].map(s => (
              <div key={s.label} className="rounded-lg border border-[#c8a96e]/15 bg-white/[0.02] p-4 text-center">
                <div className={`text-2xl font-bold ${s.cls}`}>{s.value}</div>
                <div className="text-xs text-white/30 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="anim-body rounded-xl border border-[#c8a96e]/15 bg-white/[0.02] overflow-hidden">
          {games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/20">
              <span className="text-5xl mb-4">♟</span>
              <p className="text-sm">No games played yet.</p>
            </div>
          ) : (
            <Table>
              <TableCaption className="text-white/20 pb-4">Click a row to view move history</TableCaption>
              <TableHeader>
                <TableRow className="border-[#c8a96e]/10 hover:bg-transparent">
                  <TableHead className="text-[#c8a96e] text-xs uppercase tracking-widest font-semibold">#</TableHead>
                  <TableHead className="text-[#c8a96e] text-xs uppercase tracking-widest font-semibold">White</TableHead>
                  <TableHead className="text-[#c8a96e] text-xs uppercase tracking-widest font-semibold">Black</TableHead>
                  <TableHead className="text-[#c8a96e] text-xs uppercase tracking-widest font-semibold text-right">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game, i) => {
                  const { label, cls } = resultLabel(game);
                  return (
                    <TableRow
                      key={i}
                      className="game-row border-[#c8a96e]/10 transition-colors"
                      onClick={() => setSelectedGame(game)}
                    >
                      <TableCell className="text-white/30 text-sm">{i + 1}</TableCell>
                      <TableCell className="text-white/80 text-sm">{game.first_username}</TableCell>
                      <TableCell className="text-white/80 text-sm">{game.second_username}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded border ${cls}`}>
                          {label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Move history dialog */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="bg-[#111] border-[#c8a96e]/20 text-white max-w-md max-h-[80vh] overflow-y-auto">
          <DialogTitle className="gh-title text-xl font-bold text-white">
            {selectedGame?.first_username} vs {selectedGame?.second_username}
          </DialogTitle>
          <DialogDescription className="text-white/30 text-sm mb-4">
            Full move list · Winner: <span style={{ color:"#c8a96e" }}>{selectedGame?.winner}</span>
          </DialogDescription>

          <div className="flex flex-col gap-1">
            {/* Column headers */}
            <div className="grid grid-cols-[2rem_1fr_1fr] gap-2 px-2 pb-2 border-b border-white/10">
              <span className="text-[#c8a96e] text-xs uppercase tracking-wider">#</span>
              <span className="text-[#c8a96e] text-xs uppercase tracking-wider">White</span>
              <span className="text-[#c8a96e] text-xs uppercase tracking-wider">Black</span>
            </div>
            {selectedGame?.history.map((move, i) => (
              <div
                key={i}
                className="grid grid-cols-[2rem_1fr_1fr] gap-2 px-2 py-1.5 rounded text-sm"
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}
              >
                <span className="text-[#c8a96e]/60 font-mono">{move.turn}</span>
                <span className="text-white/80 font-mono">{move.white_move ?? "—"}</span>
                <span className="text-white/80 font-mono">{move.black_move ?? "—"}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}