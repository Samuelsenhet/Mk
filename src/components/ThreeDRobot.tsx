interface ThreeDRobotProps {
  className?: string;
}

export function ThreeDRobot({ className = "" }: ThreeDRobotProps) {
  return (
    <div className={`w-full h-full relative flex items-center justify-center ${className} overflow-hidden`}>
      {/* 3D Robot Container */}
      <div className="relative">
        {/* Robot Base */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-2xl blur-sm opacity-60"></div>
        
        {/* Main Robot Body - positioned and animated */}
        <div className="relative float-animation" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Robot Body - White cylindrical with segments */}
          <div className="relative w-24 h-40 mx-auto bg-gradient-to-b from-white to-gray-100 rounded-2xl shadow-xl border border-gray-200"
               style={{ 
                 transform: 'perspective(1000px) rotateX(5deg) rotateY(-10deg)',
                 boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8)'
               }}>
            
            {/* Body Segments - horizontal lines */}
            <div className="absolute top-8 left-2 right-2 h-px bg-gray-300 opacity-50"></div>
            <div className="absolute top-16 left-2 right-2 h-px bg-gray-300 opacity-50"></div>
            <div className="absolute top-24 left-2 right-2 h-px bg-gray-300 opacity-50"></div>
            <div className="absolute top-32 left-2 right-2 h-px bg-gray-300 opacity-50"></div>
          </div>

          {/* Robot Head/Face Section - Dark upper area */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-16 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-2xl"
               style={{ 
                 transform: 'perspective(1000px) rotateX(5deg) rotateY(-10deg)',
                 boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'
               }}>
            
            {/* Glowing Cyan Eyes */}
            <div className="absolute top-4 left-3 w-3 h-3 bg-cyan-400 rounded-full glow-cyan animate-pulse"></div>
            <div className="absolute top-4 right-3 w-3 h-3 bg-cyan-400 rounded-full glow-cyan animate-pulse"></div>
            
            {/* Eye Glow Effect */}
            <div className="absolute top-3 left-2 w-5 h-5 bg-cyan-400 rounded-full opacity-30 blur-sm"></div>
            <div className="absolute top-3 right-2 w-5 h-5 bg-cyan-400 rounded-full opacity-30 blur-sm"></div>
            
            {/* Small mouth indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-cyan-400 rounded-full opacity-80"></div>
          </div>

          {/* Robot Arms */}
          <div className="absolute top-12 -left-8 w-4 h-16 bg-gradient-to-b from-white to-gray-100 rounded-full shadow-lg"
               style={{ 
                 transform: 'perspective(1000px) rotateX(5deg) rotateZ(15deg)',
                 transformOrigin: 'top center'
               }}>
            {/* Left Hand */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md border border-gray-200"></div>
          </div>
          
          <div className="absolute top-12 -right-8 w-4 h-16 bg-gradient-to-b from-white to-gray-100 rounded-full shadow-lg"
               style={{ 
                 transform: 'perspective(1000px) rotateX(5deg) rotateZ(-15deg)',
                 transformOrigin: 'top center'
               }}>
            {/* Right Hand */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md border border-gray-200"></div>
          </div>

          {/* Robot Base Platform */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full shadow-xl border border-gray-300"
               style={{ 
                 transform: 'perspective(1000px) rotateX(45deg)',
                 boxShadow: '0 8px 16px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.7)'
               }}>
            {/* Cyan Accent Ring */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-cyan-400 rounded-full opacity-80 glow-cyan"></div>
          </div>

          {/* Floating Data Particles */}
          <div className="absolute -top-8 -left-12 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -top-4 -right-10 w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-8 -left-16 w-1 h-1 bg-cyan-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-16 -right-14 w-2 h-2 bg-cyan-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '3s' }}></div>
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-2xl shadow-lg border border-gray-200 text-sm max-w-40 speech-bubble">
        Hej där! 👋 Behöver du hjälp?
        <div className="absolute -bottom-2 left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
      </div>

      <style>{`
        .float-animation {
          animation: robotFloat 4s ease-in-out infinite;
        }
        
        .glow-cyan {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.6), 0 0 40px rgba(34, 211, 238, 0.3);
        }
        
        .speech-bubble {
          animation: bubbleFade 6s ease-in-out infinite;
        }
        
        @keyframes robotFloat {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-8px) rotate(1deg); 
          }
          66% { 
            transform: translateY(-3px) rotate(-0.5deg); 
          }
        }
        
        @keyframes bubbleFade {
          0%, 20% { 
            opacity: 0; 
            transform: translateY(5px) scale(0.95); 
          }
          30%, 70% { 
            opacity: 1; 
            transform: translateY(0px) scale(1); 
          }
          80%, 100% { 
            opacity: 0; 
            transform: translateY(-5px) scale(0.95); 
          }
        }
      `}</style>
    </div>
  );
}