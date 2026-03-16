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

export type onMoveData = {
  fen: string,
}

export type onWaitingForGameData = {
  username: string,
  room: string,
  color: 'white' | 'black',
}

export type onGameOverData = {
  message: string,
  fen: string,
}


export type onPieceDropArgs = {
  sourceSquare: string,
  targetSquare: string | null,
  piece: { pieceType: string },
};



export const gameSocket = {

  joinGame: (username: string | null, mode: 'PVP' | 'PVE' | null) => {
    socket.emit("join_game", {
      username: username ?? "Guest",
      mode: mode,
    });
    console.log(`Mode is ${mode}`)
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
    mode: 'PVP' | 'PVE' | null,
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

  onNotValidMove: (callback: (data: moveData) => void) => {
    socket.on("is_move_valid", callback)
  },

  offNotValidMove: () => {
    socket.off("is_move_valid")
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

  resign: (color: "white" | "black", room: string | null) => {
    socket.emit("resign", {
      color: color,
      room: room
    })
  },

  draw: () => {
    socket.emit("draw")
  },


 





};
