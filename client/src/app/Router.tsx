import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "../pages/game";
import GameHistory from "@/pages/gameHistory";
import HomePage from "@/pages/home";
import SignUpPage from "@/pages/signUp";
import SignInPage from "@/pages/signIn";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/history" element={<GameHistory />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}
