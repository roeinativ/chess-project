import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://localhost:5555", {
    autoConnect: false,
});

socket.on("connect", () => {
    console.log("Client connected", socket.id)
})

