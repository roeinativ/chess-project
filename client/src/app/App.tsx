import Router from "./Router";
import "/src/App.css";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import { useState } from "react";

export default function App() {
  const [username, setUserName] = useState<string | null>('Guest')
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)

  return (
    <>
      <userContext.Provider value={{username, setUserName}}>
        <roomContext.Provider value={{currentRoom,setCurrentRoom}}>
          <Router />
        </roomContext.Provider>
      </userContext.Provider>
    </>
  );
}
