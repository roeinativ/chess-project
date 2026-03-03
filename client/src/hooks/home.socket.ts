import { socket } from "./socket";

export type onJoinHomeData = {
  username: string;
  room: string;
};

export const homeSocket = {
  joinHome: (username: string | null) => {
    socket.emit("join_home", {
      username: username ?? "Guest",
      sid: socket.id,
    });
    console.log("Emited join home")
  },

  onJoinHome: (callback: (data: onJoinHomeData) => void) => {
    socket.on("join_home", callback);
  },

  offJoinHome: () => {
    socket.off("join_home");
  },
};
