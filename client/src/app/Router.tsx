import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "../pages/game";
import About from "../pages/about";
import HomePage from "@/pages/home";
import SignUpPage from "@/pages/signUp";
import SignInPage from "@/pages/signIn";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUpPage />}/>
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}
