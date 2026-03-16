import { socket } from "./socket";

import * as Types from "@/types/types"

export const homeSocket = {
  joinHome: (username: string | null) => {
    socket.emit("join_home", {
      username: username ?? "Guest",
      sid: socket.id,
    });
    console.log("Emited join home")
  },

  onJoinHome: (callback: (data: Types.OnJoinGameData) => void) => {
    socket.on("join_home", callback);
  },

  offJoinHome: () => {
    socket.off("join_home");
  },
};
