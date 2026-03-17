import { socket } from "./socket";

import * as Types from "@/types/types";

export const gameSocket = {
  joinGame: (username: string | null, mode: "PVP" | "PVE" | null) => {
    socket.emit("join_game", {
      username: username ?? "Guest",
      mode: mode,
    });
    console.log(`Mode is ${mode}`);
  },

  onJoinGame: (callback: (data: Types.OnJoinGameData) => void) => {
    socket.on("join_game", callback);
  },

  offJoinGame: () => {
    socket.off("join_game");
  },

  makeMove: (
    color: "white" | "black",
    room: string | null,
    username: string | null,
    from: string,
    to: string,
    promotion: string,
    mode: "PVP" | "PVE" | null,
  ) => {
    socket.emit("move", {
      color: color,
      room: room,
      username: username ?? "Guest",
      from: from,
      to: to,
      promotion: promotion,
      mode: mode,
    });
  },

  onNotValidMove: (callback: (data: Types.MoveData) => void) => {
    socket.on("is_move_valid", callback);
  },

  offNotValidMove: () => {
    socket.off("is_move_valid");
  },

  onWaitingForGame: (callback: (data: Types.OnWaitingForGameData) => void) => {
    socket.on("start_game", callback);
  },

  offWaitingForGame: () => {
    socket.off("start_game");
  },

  cancelMatchmaking: (currentRoom: string | null) => {
    socket.emit("cancel_matchmaking", {
      room: currentRoom,
    });
  },

  onMove: (callback: (data: Types.OnMoveData) => void) => {
    socket.on("move", callback);
  },

  offOnMove: () => {
    socket.off("move");
  },

  onGameOver: (callback: (data: Types.OnGameOverData) => void) => {
    socket.on("game_over", callback);
  },

  offGameOver: () => {
    socket.off("game_over");
  },

  resign: (color: "white" | "black", room: string | null, mode: "PVE" | "PVP" | null) => {
    socket.emit("resign", {
      color: color,
      room: room,
      mode: mode,
    });
  },

  emitDraw: (room: string | null, status: string, mode: "PVE" | "PVP" | null) => {
    socket.emit("draw", {
      room: room,
      status: status,
      mode: mode,
    });
  },

  listenForDraw: (callback: () => void) => {
    socket.on("draw", callback);
  },

  offListenForDraw: () => {
    socket.off("draw");
  },
};
