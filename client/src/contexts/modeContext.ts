import { createContext } from "react";

type modeContextType = {
    mode: 'PVP' | 'PVE' | null,
    setMode: React.Dispatch<React.SetStateAction<'PVP' | 'PVE' | null>>,
}

export const modeContext = createContext<modeContextType>({
    mode: 'PVP',
    setMode: () => {},
})