import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "../pages/game";
import About from "../pages/about";
import HomePage from "@/pages/home";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
