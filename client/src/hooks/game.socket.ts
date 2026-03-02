import { socket } from "./socket";

export type OnJoinGameData = {
  username: string;
  room: string;
};

export type moveData = {
  from: string;
  to: string;
  promotion: string;
  valid: boolean;
};

export type onNotValidMoveData = {
  from: string,
  to: string,
  promotion: string,
  valid: boolean,
}

export const gameSocket = {
  joinGame: (username: string | null, currentRoom: string) => {
    socket.emit("join_game", {
      username: username ?? "Guest",
      room: currentRoom,
      sid: socket.id,
    });
  },

  onJoinGame: (callback: (data: OnJoinGameData) => void) => {
    socket.on("join_game", callback);
  },

  offJoinGame: () => {
    socket.off("join_game");
  },

  makeMove: (
    username: string | null,
    from: string,
    to: string,
    promotion: string,
  ) => {
    socket.emit("move", {
      username: username ?? "Guest",
      from: from,
      to: to,
      promotion: promotion,
    });
  },

  onNotValidMove: (callback: (data: onNotValidMoveData) => void) => {
    socket.on("not_valid", callback)
  },

  offNotValidMove: () => {
    socket.off("not_valid")
  },
};
