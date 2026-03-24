import type React from "react";
import type { SetStateAction } from "react";

export interface OnJoinGameData {
  username: string;
  room: string;
}

export interface OnWaitingForGameData extends OnJoinGameData {
  color: "white" | "black";
}

export type MoveData = {
  from: string;
  to: string;
  promotion: string;
  valid: boolean;
};

export interface OnMoveData {
  color: string
  valid: boolean
  fen: string;
}

export interface OnGameOverData extends OnMoveData {
  message: string;
}

export type OnPieceDropArgs = {
  sourceSquare: string;
  targetSquare: string | null;
  piece: { pieceType: string };
};

export type DigitalClockProps = {
  isTurn: boolean;
  pieceColor: "w" | "b";
  isGameOver: () => {};
};

export type DrawOfferType = {
  drawOffer: boolean;
  response: (value: string) => void;
  setDrawOffer: React.Dispatch<SetStateAction<boolean>>;
};

export type GameOverScreenType = {
  endingMessage: string | null;
  navHome: () => void;
  navHistory: () => void
  StartWaiting: () => void;
};

export type ResignDialogType = {
  resign: () => void;
};

export type WaitingForOpponentScreenType = {
  cancelMatchmaking: () => void;
};

export interface AuthFetchType {
  endpoint: string
  enterUsername: string
  password: string
}

export interface AuthType {
  enterUsername: string
  setEnterUsername: React.Dispatch<SetStateAction<string>>
  password: string
  setPassword: React.Dispatch<SetStateAction<string>>
  errorMessage: string
}

export interface SignInType extends AuthType {
  navSignUp: () => void
  signIn: React.FormEventHandler

}

export interface SignUpType extends AuthType {
  navSignIn: () => void
  signUp: React.FormEventHandler
}
