import Router from "./Router";
import "/src/App.css";
import { userContext } from "@/contexts/userContext";
import { roomContext } from "@/contexts/roomContext";
import { colorContext } from "@/contexts/colorContext";
import { signedInContext } from "@/contexts/signedInContext";
import { useState } from "react";
import { socket } from "@/hooks/socket";

export default function App() {
  const [username, setUserName] = useState<string | null>(localStorage.getItem("username") ?? "Guest")
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [color,setColor] = useState<'white' | 'black'>('white')
  const [signedIn,setSignedIn] = useState<boolean>(username == "Guest" ? false : true)



  socket.connect()

  return (
    <>
      <userContext.Provider value={{username, setUserName}}>
        <roomContext.Provider value={{currentRoom,setCurrentRoom}}>
          <colorContext.Provider value={{color,setColor}}>
            <signedInContext.Provider value={{signedIn,setSignedIn}}>
              <Router />
            </signedInContext.Provider>
          </colorContext.Provider>
        </roomContext.Provider>
      </userContext.Provider>
    </>
  );
}
