import { socket } from "./socket";
import { Chess } from "chess.js";

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

export type onMoveData = {
  fen: string,
}

export type onWaitingForGameData = {
  username: string,
  room: string,
  color: 'white' | 'black',
}

export type onGameOverData = {
  winner: "w" | "b" | "t",
  fen: string,
}


export type onPieceDropArgs = {
  sourceSquare: string,
  targetSquare: string | null,
  piece: { pieceType: string },
};



export const gameSocket = {

  joinGame: (username: string | null, currentRoom: string | null) => {
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
    color: "white" | "black",
    room: string | null,
    username: string | null,
    from: string,
    to: string,
    promotion: string,
  ) => {
    socket.emit("move", {
      sid: socket.id,
      color: color,
      room: room,
      username: username ?? "Guest",
      from: from,
      to: to,
      promotion: promotion,
    });
  },

  onNotValidMove: (callback: (data: moveData) => void) => {
    socket.on("is_move_valid", callback)
  },

  offNotValidMove: () => {
    socket.off("not_valid")
  },

  onWaitingForGame: (callback: (data: onWaitingForGameData) => void) => {
    socket.on("start_game",callback)
  },

  offWaitingForGame: () => {
    socket.off("start_game")
  },

  cancelMatchmaking: (currentRoom: string | null) => {
    socket.emit("cancel_matchmaking", {
      room: currentRoom,
      sid: socket.id,
    })
  },

  onMove : (callback: (data: onMoveData) => void) => {
    socket.on("move",callback)
  },

  offOnMove: () => {
    socket.off("move")
  },

  onGameOver: (callback: (data: onGameOverData) => void) => {
    socket.on("game_over",callback)
  },

  offGameOver: () => {
    socket.off("game_over")
  },


 





};
