import * as Types from "@/types/types";

export default function WaitingForOpponentScreen({
  cancelMatchmaking,
}: Types.WaitingForOpponentScreenType) {
  return (
    <div className="w-full max-w-sm mx-4 rounded-2xl border border-[#c8a96e]/25 bg-[#0f0f0f]/95 backdrop-blur-md shadow-2xl p-8 text-center">
      <div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 16px rgba(200,169,110,0.4))" }}>♟</div>

      <h2
        className="text-2xl font-bold text-white mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Finding Opponent
      </h2>

      {/* Animated dots */}
      <div className="flex justify-center gap-1.5 my-5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full"
            style={{
              background: "#c8a96e",
              animation: `waitPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="text-white/30 text-sm mb-8">Waiting for another player to join…</p>

      <button
        onClick={cancelMatchmaking}
        className="w-full py-3 rounded-lg text-sm font-medium transition-all cursor-pointer border"
        style={{ background: "rgba(255,255,255,0.05)", color: "#fff", borderColor: "rgba(255,255,255,0.1)" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
      >
        Cancel
      </button>

      <style>{`
        @keyframes waitPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}