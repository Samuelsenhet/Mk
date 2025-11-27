import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { ThreeDRobot } from "./ThreeDRobot";

export function WelcomeScreen({ onGetStarted, onLogin }: { 
  onGetStarted: () => void;
  onLogin: () => void;
}) {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex flex-col relative overflow-hidden">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d={`M0,${400 + Math.sin(waveOffset * 0.02) * 20}L1440,${380 + Math.sin(waveOffset * 0.02 + 1) * 15}L1440,800L0,800Z`}
            fill="url(#wave1)"
            opacity="0.1"
          />
          <path
            d={`M0,${450 + Math.sin(waveOffset * 0.03) * 25}L1440,${430 + Math.sin(waveOffset * 0.03 + 0.5) * 20}L1440,800L0,800Z`}
            fill="url(#wave2)"
            opacity="0.08"
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#4ECDC4', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#4ECDC4', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="text-center mb-12">
          {/* 3D AI Companion */}
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto mb-4 rounded-[25px] overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 to-secondary/10">
              <ThreeDRobot className="float-animation" />
            </div>
            <h1 className="text-4xl mb-2 text-primary font-semibold tracking-tight">
              Välkommen till MÄÄK
            </h1>
            <p className="text-lg text-gray-700 font-medium">
              Flöda med din sanna natur
            </p>
          </div>
          
          {/* Value Propositions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-[25px] p-6 shadow-lg border border-white/20 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs">🧠</span>
                </div>
                <span className="text-gray-800 font-medium">30-frågor personlighetstest med 16 arketyper</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs">💝</span>
                </div>
                <span className="text-gray-800 font-medium">Ingen swipe - smart personlighetsbaserad matchning</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs">🤖</span>
                </div>
                <span className="text-gray-800 font-medium">AI-coach som hjälper dig bryta isen</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs">🌊</span>
                </div>
                <span className="text-gray-800 font-medium">Community & PairingHub för djupare kopplingar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative px-6 pb-8 space-y-4">
        <Button 
          className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-[25px] shadow-xl font-semibold tracking-wide transition-all duration-300 transform hover:scale-[1.02]"
          onClick={onGetStarted}
        >
          Kom igång
        </Button>
        <Button 
          variant="outline" 
          className="w-full h-14 border-2 border-primary/30 text-primary hover:bg-primary/10 rounded-[25px] shadow-lg font-semibold tracking-wide transition-all duration-300"
          onClick={onLogin}
        >
          Har redan konto? Logga in
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed px-4">
          Genom att fortsätta godkänner du våra{" "}
          <span className="text-primary underline font-medium">användarvillkor</span> och{" "}
          <span className="text-primary underline font-medium">integritetspolicy</span>.
        </p>
      </div>
    </div>
  );
}