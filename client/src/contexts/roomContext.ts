import { createContext } from "react";

type roomContextType = {
  currentRoom: string | null;
  setCurrentRoom: React.Dispatch<React.SetStateAction<string | null>>;
};

export const roomContext = createContext<roomContextType>({
  currentRoom: null,
  setCurrentRoom: () => {},
});
