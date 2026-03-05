import { createContext } from "react";

type gameOnContextData = {
    gameOn: boolean,
    setGameOn: React.Dispatch<React.SetStateAction<boolean>>,
}

export const gameOnContext = createContext<gameOnContextData>({
    gameOn: false,
    setGameOn: () => {},
})