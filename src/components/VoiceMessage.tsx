import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

interface VoiceMessageProps {
  audioUrl: string;
  duration: number;
  isOwn: boolean;
  timestamp: string;
  senderName?: string;
}

export function VoiceMessage({ audioUrl, duration, isOwn, timestamp, senderName }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedData = () => setIsLoaded(true);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs ${isOwn ? 'bg-primary text-white' : 'bg-white border'} rounded-2xl p-3 space-y-2`}>
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          className="hidden"
        />
        
        {/* Header */}
        {!isOwn && senderName && (
          <div className="text-xs text-gray-600 mb-1">{senderName}</div>
        )}
        
        {/* Voice Message Content */}
        <div className="flex items-center space-x-3">
          {/* Play Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayback}
            disabled={!isLoaded}
            className={`p-2 rounded-full ${
              isOwn 
                ? 'hover:bg-white/20 text-white' 
                : 'hover:bg-gray-100 text-primary'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          {/* Waveform/Progress */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <Volume2 className={`w-3 h-3 ${isOwn ? 'text-white/70' : 'text-gray-400'}`} />
              <div className="text-xs">Röstmeddelande</div>
            </div>
            
            {/* Progress Bar */}
            <div className={`w-full h-1 rounded-full ${isOwn ? 'bg-white/30' : 'bg-gray-200'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-100 ${
                  isOwn ? 'bg-white' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Time Display */}
            <div className={`text-xs ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
              {isPlaying ? formatTime(currentTime) : formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className={`text-xs ${isOwn ? 'text-white/70' : 'text-gray-500'} text-right`}>
          {timestamp}
        </div>
      </div>
    </div>
  );
}