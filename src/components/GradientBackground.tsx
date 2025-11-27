import { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  variant?: 'light' | 'dark' | 'primary';
  className?: string;
}

export function GradientBackground({ 
  children, 
  variant = 'light', 
  className = '' 
}: GradientBackgroundProps) {
  const gradientClasses = {
    light: 'bg-gradient-to-br from-[#A8E6CF] to-[#FFD3E0]',
    dark: 'bg-gradient-to-br from-[#2C3E50] to-[#8E44AD]',
    primary: 'bg-gradient-to-br from-primary to-secondary'
  };

  return (
    <div className={`min-h-screen ${gradientClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

// Wave animation component for matching system
export function WaveBackground({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated waves */}
      <div className="absolute inset-0">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M0,400L1440,380L1440,800L0,800Z"
            fill="url(#wave1)"
            opacity="0.1"
            className="wave-animation"
          />
          <path
            d="M0,450L1440,430L1440,800L0,800Z"
            fill="url(#wave2)"
            opacity="0.08"
            className="wave-animation"
            style={{ animationDelay: '1s' }}
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A8E6CF" stopOpacity={1} />
              <stop offset="100%" stopColor="#FFD3E0" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD3E0" stopOpacity={1} />
              <stop offset="100%" stopColor="#A8E6CF" stopOpacity={1} />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Floating particles for 3D effect
export function ParticleBackground({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#A8E6CF]/20 to-[#FFD3E0]/20">
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full float-animation"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}