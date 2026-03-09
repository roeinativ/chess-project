import { createContext } from "react";

type userContextType = {
    username: string,
    setUserName: React.Dispatch<React.SetStateAction<string>>,
}

export const userContext = createContext<userContextType>({
    username: '',
    setUserName: () => {},
})

