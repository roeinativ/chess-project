import { io, Socket } from "socket.io-client"
import { getStoredUsername } from "./storeUserName";

export const socket: Socket = io(`http://${window.location.hostname}:5555`, {
    autoConnect: false
});

socket.on("connect", () => {
    console.log("Client connected", socket.id)

    const username = getStoredUsername()
    console.log(`Current stored username is ${username}`)
    
    if (username !== "Guest"){
        socket.emit("update_connection", {
            username: username,
            new_sid: socket.id
        })
        console.log("Emited update connection")
    }
})

