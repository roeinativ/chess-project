import type { ReactNode } from "react";

type GameOverlayType = {
    children: ReactNode,
}

export default function GameOverlay({ children } : GameOverlayType) {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            {children}
        </div>
    )
}