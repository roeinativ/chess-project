import { createContext } from "react";

type userContextType = {
    username: string | null,
    setUserName: React.Dispatch<React.SetStateAction<string | null>>,
}

export const userContext = createContext<userContextType>({
    username: null,
    setUserName: () => {},
})