import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import useSocket from "@/hooks/useSocket";
import { userContext } from "@/contexts/userContext";
import { modeContext } from "@/contexts/modeContext";
import { signedInContext } from "@/contexts/signedInContext";
import { removeStoredUsername } from "@/hooks/storeUserName";
import { socket } from "@/hooks/socket";

export default function HomePage() {
  const { username } = useContext(userContext);
  const { signedIn, setSignedIn } = useContext(signedInContext);
  const { setMode } = useContext(modeContext);
  const navigate = useNavigate();
  const { joinGame } = useSocket();

  const enterGame = (mode: "PVP" | "PVE") => {
    setMode(mode);
    joinGame(mode);
    navigate("/game");
  };

  const signOut = () => {
    socket.emit("sign_out");
    setSignedIn(false);
    removeStoredUsername();
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0a0a0a] font-sans">

      {/* Chessboard BG */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [transform:rotate(-12deg)_scale(1.5)]"
        style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gridTemplateRows: "repeat(8,1fr)" }}
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <div
            key={i}
            style={{ background: (Math.floor(i / 8) + (i % 8)) % 2 === 0 ? "#c8a96e" : "#2e1b0e" }}
          />
        ))}
      </div>

      {/* Vignette — centred so hero text is readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 10%, #0a0a0a 72%)" }}
      />

      {/* Floating pieces */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        {[
          { ch: "♜", style: { right:"8%",  top:"8%",  fontSize:"clamp(7rem,14vw,14rem)", color:"rgba(200,169,110,0.09)", animation:"floatPiece 18s ease-in-out infinite" } },
          { ch: "♛", style: { right:"36%", top:"52%", fontSize:"clamp(5rem,11vw,11rem)", color:"rgba(200,169,110,0.06)", animation:"floatPiece 22s ease-in-out infinite -4s" } },
          { ch: "♞", style: { right:"18%", top:"68%", fontSize:"clamp(3rem,7vw,7rem)",   color:"rgba(200,169,110,0.06)", animation:"floatPiece 15s ease-in-out infinite -8s" } },
          { ch: "♝", style: { right:"54%", top:"18%", fontSize:"clamp(4rem,9vw,9rem)",   color:"rgba(200,169,110,0.04)", animation:"floatPiece 20s ease-in-out infinite -2s" } },
          { ch: "♚", style: { right:"4%",  top:"52%", fontSize:"clamp(6rem,13vw,13rem)", color:"rgba(200,169,110,0.05)", animation:"floatPiece 25s ease-in-out infinite -12s" } },
        ].map(({ ch, style }, i) => (
          <span key={i} className="absolute select-none" style={style}>{ch}</span>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes floatPiece {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-28px) rotate(4deg); }
        }
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .anim-header  { animation: fadeDown 0.55s ease both; }
        .anim-eyebrow { animation: fadeUp 0.55s 0.10s ease both; }
        .anim-title   { animation: fadeUp 0.55s 0.20s ease both; }
        .anim-sub     { animation: fadeUp 0.55s 0.30s ease both; }
        .anim-btns    { animation: fadeUp 0.55s 0.40s ease both; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-dm      { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* Main content — centred column */}
      <div className="relative z-10 flex flex-col h-full px-4 sm:px-10 font-dm">

        {/* Header */}
        <header className="anim-header flex items-center justify-between py-6 border-b border-[#c8a96e]/15">
          <span className="text-3xl" style={{ color:"#c8a96e", filter:"drop-shadow(0 0 10px rgba(200,169,110,0.5))" }}>♟</span>
          <div className="flex items-center gap-3">
            {signedIn ? (
              <>
                <span className="text-sm text-white/40 tracking-wide hidden sm:inline">@{username}</span>
                <button
                  onClick={signOut}
                  className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 cursor-pointer bg-transparent border-none"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/sign-in")}
                  className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 cursor-pointer bg-transparent border-none"
                >
                  Sign in
                </button>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="text-sm px-4 py-1.5 rounded border cursor-pointer transition-all"
                  style={{ color:"#c8a96e", borderColor:"rgba(200,169,110,0.4)", background:"transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,169,110,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </header>

        {/* Hero — centred */}
        <section className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="anim-eyebrow text-xs tracking-[0.25em] uppercase mb-5" style={{ color:"#c8a96e" }}>
            Your move.
          </p>

          <h1
            className="anim-title font-playfair font-black leading-none text-white mb-6"
            style={{ fontSize:"clamp(3.2rem,10vw,7rem)" }}
          >
            Chess,<br />
            <span style={{ color:"#c8a96e", fontStyle:"italic" }}>Elevated.</span>
          </h1>

          <p className="anim-sub text-white/40 font-light leading-relaxed mb-10 max-w-md" style={{ fontSize:"clamp(0.9rem,2vw,1.05rem)" }}>
            Challenge a friend or test your wits against the machine.<br className="hidden sm:block" />
            The board is set. Are you ready?
          </p>

          {/* Buttons — centred */}
          <div className="anim-btns flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => enterGame("PVP")}
              className="flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all"
              style={{ background:"#c8a96e", color:"#0a0a0a", boxShadow:"0 0 24px rgba(200,169,110,0.25)" }}
              onMouseEnter={e => { e.currentTarget.style.background="#d4ba85"; e.currentTarget.style.boxShadow="0 0 36px rgba(200,169,110,0.45)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#c8a96e"; e.currentTarget.style.boxShadow="0 0 24px rgba(200,169,110,0.25)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <span>⚔️</span> Play vs Player
            </button>

            <button
              onClick={() => enterGame("PVE")}
              className="flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all border"
              style={{ background:"rgba(255,255,255,0.07)", color:"#fff", borderColor:"rgba(255,255,255,0.12)" }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <span>🤖</span> Play vs Computer
            </button>

            <button
              onClick={() => navigate("/history")}
              className="text-sm px-4 py-3 cursor-pointer transition-colors bg-transparent border-none"
              style={{ color:"rgba(255,255,255,0.4)", textDecoration:"underline", textUnderlineOffset:"3px", textDecorationColor:"rgba(255,255,255,0.2)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              Game History
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}