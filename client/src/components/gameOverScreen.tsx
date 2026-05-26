import * as Types from "@/types/types";

export default function GameOverScreen({
  endingMessage,
  navHome,
  navHistory,
  StartWaiting,
}: Types.GameOverScreenType) {
  return (
    <div className="w-full max-w-sm mx-4 rounded-2xl border border-[#c8a96e]/25 bg-[#0f0f0f]/95 backdrop-blur-md shadow-2xl p-8 text-center">
      <div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 16px rgba(200,169,110,0.4))" }}>♟</div>

      <h2
        className="text-2xl font-bold text-white mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Game Over
      </h2>
      <p className="text-base mb-8" style={{ color: "#c8a96e" }}>
        {endingMessage}
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={StartWaiting}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          style={{ background: "#c8a96e", color: "#0a0a0a", boxShadow: "0 0 20px rgba(200,169,110,0.2)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#d4ba85"; e.currentTarget.style.boxShadow = "0 0 32px rgba(200,169,110,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#c8a96e"; e.currentTarget.style.boxShadow = "0 0 20px rgba(200,169,110,0.2)"; }}
        >
          Play Again
        </button>

        <button
          onClick={navHistory}
          className="w-full py-3 rounded-lg text-sm font-medium transition-all cursor-pointer border"
          style={{ background: "rgba(255,255,255,0.05)", color: "#fff", borderColor: "rgba(255,255,255,0.1)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          Game History
        </button>

        <button
          onClick={navHome}
          className="w-full py-2 text-sm transition-colors cursor-pointer bg-transparent border-none"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}