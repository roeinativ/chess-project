import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import * as Types from "@/types/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputGroup, InputGroupButton, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function SignInComponent({
  navSignUp, signIn, enterUsername, setEnterUsername, password, setPassword, errorMessage
}: Types.SignInType) {
  const navigate = useNavigate();
  const [passwordHidden, setPasswordHidden] = useState(true);


  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">

      {/* Chess BG */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05] [transform:rotate(-12deg)_scale(1.6)]"
        style={{ display:"grid", gridTemplateColumns:"repeat(8,1fr)", gridTemplateRows:"repeat(8,1fr)" }}
      >
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} style={{ background:(Math.floor(i/8)+(i%8))%2===0 ? "#c8a96e" : "#2e1b0e" }} />
        ))}
      </div>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse at 50% 50%, transparent 20%, #0a0a0a 75%)" }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-card { font-family: 'DM Sans', sans-serif; }
        .auth-title { font-family: 'Playfair Display', serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .auth-card { animation: fadeUp 0.5s ease both; }
      `}</style>

      {/* Home link */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-5 right-6 z-20 text-sm text-white/30 hover:text-white transition-colors bg-transparent border-none cursor-pointer"      >
        ← Home
      </button>

      {/* Card */}
      <div className="auth-card relative z-10 w-full max-w-sm rounded-xl border border-[#c8a96e]/20 bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <span className="text-4xl" style={{ color:"#c8a96e", filter:"drop-shadow(0 0 12px rgba(200,169,110,0.5))" }}>♟</span>
        </div>

        <h1 className="auth-title text-2xl font-bold text-white text-center mb-1">Welcome back</h1>
        <p className="text-white/40 text-sm text-center mb-8">Sign in to continue playing</p>

        <form onSubmit={signIn} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="text-white/60 text-xs tracking-widest uppercase">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={enterUsername}
              onChange={e => setEnterUsername(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#c8a96e]/50 focus:ring-[#c8a96e]/20 h-11"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-white/60 text-xs tracking-widest uppercase">Password</Label>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={passwordHidden ? "password" : "text"}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-[#c8a96e]/50 h-11"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  className="!bg-transparent text-white/40 hover:text-white"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setPasswordHidden(p => !p)}
                >
                  {passwordHidden ? <EyeIcon /> : <EyeOffIcon />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-md text-sm font-semibold cursor-pointer transition-all mt-1"
            style={{ background:"#c8a96e", color:"#0a0a0a", boxShadow:"0 0 20px rgba(200,169,110,0.2)" }}
            onMouseEnter={e => { e.currentTarget.style.background="#d4ba85"; e.currentTarget.style.boxShadow="0 0 32px rgba(200,169,110,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="#c8a96e"; e.currentTarget.style.boxShadow="0 0 20px rgba(200,169,110,0.2)"; }}
          >
            Sign In
          </button>

          {errorMessage !== "" && (
            <Alert variant="destructive" className="border-red-500/30 bg-red-500/10">
              <AlertCircleIcon className="text-red-400" />
              <AlertTitle className="text-red-400">Sign in failed</AlertTitle>
              <AlertDescription className="text-red-300/80">{errorMessage}</AlertDescription>
            </Alert>
          )}
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          No account?{" "}
          <button onClick={navSignUp} className="text-[#c8a96e] hover:text-[#d4ba85] transition-colors bg-transparent border-none cursor-pointer underline underline-offset-2">
            Sign up
          </button>
        </p>
      </div>
    </main>
  );
}