import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, Play, Pause, Send, X } from "lucide-react";

interface VoiceRecorderProps {
  onSendVoiceMessage: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function VoiceRecorder({ onSendVoiceMessage, onCancel, isOpen }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRecording(false);
      setIsPlaying(false);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Kunde inte komma åt mikrofonen. Kontrollera dina inställningar.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSendVoiceMessage(audioBlob, recordingTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full max-w-md mx-auto bg-white rounded-t-2xl p-6 space-y-6">
        <div className="text-center">
          <h3 className="text-lg mb-2">Röstmeddelande</h3>
          <p className="text-sm text-gray-600">
            {isRecording ? "Spelar in..." : audioBlob ? "Förhandsgranska din inspelning" : "Tryck och håll för att spela in"}
          </p>
        </div>

        {/* Recording Time Display */}
        <div className="text-center">
          <div className="text-3xl text-primary mb-2">
            {formatTime(recordingTime)}
          </div>
          {isRecording && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-500">REC</span>
            </div>
          )}
        </div>

        {/* Audio Preview */}
        {audioUrl && (
          <div className="bg-gray-50 rounded-lg p-4">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? pauseAudio : playAudio}
                className="flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? "Pausa" : "Spela"}</span>
              </Button>
              <span className="text-sm text-gray-600">
                {formatTime(recordingTime)}
              </span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!audioBlob ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onCancel}
                className="flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Avbryt</span>
              </Button>
              
              <Button
                size="lg"
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center space-x-2 ${
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span>{isRecording ? "Stoppa" : "Spela in"}</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setAudioBlob(null);
                  setAudioUrl(null);
                  setRecordingTime(0);
                }}
                className="flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Ta om</span>
              </Button>
              
              <Button
                size="lg"
                onClick={handleSend}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
              >
                <Send className="w-5 h-5" />
                <span>Skicka</span>
              </Button>
            </>
          )}
        </div>

        {/* Tips */}
        <div className="text-center text-xs text-gray-500">
          <p>Maximal längd: 2 minuter</p>
          <p>Röstmeddelanden gör konversationer mer personliga</p>
        </div>
      </div>
    </div>
  );
}