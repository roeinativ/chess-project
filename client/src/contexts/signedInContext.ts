import { createContext } from "react";

type signedInContext = {
    signedIn: boolean,
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>,
}

export const signedInContext = createContext<signedInContext>({
    signedIn: false,
    setSignedIn: () => {},
})