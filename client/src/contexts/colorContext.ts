import { createContext } from "react";

type colorContextType = {
    color: 'white' | 'black',
    setColor: React.Dispatch<React.SetStateAction<'white' | 'black'>>,
}

export const colorContext = createContext<colorContextType>({
    color: 'white',
    setColor: () => {},
})