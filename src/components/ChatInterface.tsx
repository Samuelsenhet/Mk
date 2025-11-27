import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Send, Mic, Phone, Video, MoreVertical, Smile, ArrowLeft, ThumbsUp, RotateCcw, Plus, Image as ImageIcon, Sparkles, Heart, Star, Camera } from "lucide-react";
import { VoiceRecorder } from "./VoiceRecorder";
import { VoiceMessage } from "./VoiceMessage";

interface Message {
  id: string;
  text?: string;
  timestamp: Date;
  isOwn: boolean;
  type: "text" | "voice" | "image" | "ai_suggestion";
  voiceDuration?: number;
  voiceUrl?: string;
  images?: string[];
  aiSuggestion?: string;
  status: "sent" | "delivered" | "read";
}

interface ChatProps {
  matchProfile: any;
  onBack: () => void;
}

export function ChatInterface({ matchProfile, onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: `Hej! Så kul att vi matchade med ${matchProfile.compatibilityScore}% kompatibilitet! 🎉`,
      timestamp: new Date(Date.now() - 1800000), // 30 min sedan
      isOwn: false,
      type: "text",
      status: "read"
    },
    {
      id: "ai_intro",
      type: "ai_suggestion",
      aiSuggestion: `Som ${matchProfile.archetype?.name} (${matchProfile.archetype?.type}) kanske ni skulle kunna diskutera ${
        matchProfile.matchType === 'similarity' ? 'era gemensamma värderingar och intressen' : 'hur era olika perspektiv kan komplettera varandra'
      }?`,
      timestamp: new Date(Date.now() - 1740000),
      isOwn: false,
      status: "read"
    },
    {
      id: "user_response", 
      text: `Hej ${matchProfile.name}! Ja, jag såg att vi har ${matchProfile.matchType === 'similarity' ? 'så mycket gemensamt' : 'intressanta skillnader som kan komplettera varandra'}. Vad gillar du mest med ${matchProfile.archetype?.name}-personligheten? 😊`,
      timestamp: new Date(Date.now() - 1620000),
      isOwn: true,
      type: "text",
      status: "read"
    },
    {
      id: "voice_response",
      timestamp: new Date(Date.now() - 1500000),
      isOwn: false,
      type: "voice",
      voiceDuration: 45,
      voiceUrl: "mock-audio-url",
      status: "read"
    },
    {
      id: "latest_message",
      text: "Det låter fantastiskt! Jag skulle älska att träffas och prata mer om det. Vad sägs om en fika denna helg? ☕",
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
      type: "text",
      status: "delivered"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      timestamp: new Date(),
      isOwn: true,
      type: "text",
      status: "sent"
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate typing and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      let response = "Det låter jättebra! 😊";
      if (newMessage.toLowerCase().includes("träffa") || newMessage.toLowerCase().includes("träffas")) {
        response = "Ja, absolut! Jag skulle älska att träffas. Har du någon favorit-plats i stan?";
      } else if (newMessage.toLowerCase().includes("kaffe") || newMessage.toLowerCase().includes("fika")) {
        response = "Perfekt! Jag känner till ett mysigt kafé nära centrum. Passar lördag eftermiddag?";
      }

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        timestamp: new Date(),
        isOwn: false,
        type: "text",
        status: "delivered"
      };

      setMessages(prev => [...prev, responseMessage]);
    }, 1500 + Math.random() * 2000);
  };

  const sendVoiceMessage = (audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const voiceMessage: Message = {
      id: Date.now().toString(),
      timestamp: new Date(),
      isOwn: true,
      type: "voice",
      voiceDuration: duration,
      voiceUrl: audioUrl,
      status: "sent"
    };

    setMessages(prev => [...prev, voiceMessage]);
    setShowVoiceRecorder(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getArchetypeColor = (category: string) => {
    switch (category) {
      case 'Diplomater': return 'from-purple-500 to-purple-600';
      case 'Byggare': return 'from-green-500 to-green-600';      
      case 'Upptäckare': return 'from-yellow-500 to-yellow-600'; 
      case 'Strateger': return 'from-blue-500 to-blue-600';      
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const quickReplies = [
    "Absolut! 😊",
    "Låter perfekt! ✨", 
    "Jag skulle älska det! 💕",
    "När passar dig? 🤔",
    "Vilken bra idé! 💡"
  ];

  return (
    <div className="max-w-md mx-auto flex flex-col h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* MÄÄK Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            
            {/* MÄÄK Profile Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`p-0.5 bg-gradient-to-br ${getArchetypeColor(matchProfile.archetype?.category)} rounded-full`}>
                  <Avatar className="w-10 h-10 border-2 border-white">
                    <AvatarImage src={matchProfile.photos?.[0]} />
                    <AvatarFallback className="bg-gray-100">{matchProfile.name?.[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{matchProfile.name}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500">
                    {isTyping ? "skriver..." : "online nu"}
                  </p>
                  <Badge className="text-xs px-2 py-0 bg-gradient-to-r from-primary to-secondary text-white border-0">
                    {matchProfile.compatibilityScore}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* MÄÄK Match Info Banner */}
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-[15px] p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">
                {matchProfile.matchType === 'similarity' ? '🎯 Likhetsmatch' : '⚡ Komplementmatch'}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {matchProfile.aiSuggestion || `${matchProfile.archetype?.name} (${matchProfile.archetype?.type}) • Ni matchar ${matchProfile.compatibilityScore}%`}
            </p>
          </div>
        </div>
      </div>

      {/* MÄÄK Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id}>
            {message.type === "ai_suggestion" ? (
              <div className="flex justify-center">
                <div className="bg-white/80 backdrop-blur-sm border border-primary/20 rounded-[20px] p-4 max-w-[85%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">MÄÄK AI-förslag</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {message.aiSuggestion}
                  </p>
                </div>
              </div>
            ) : message.type === "voice" ? (
              <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {!message.isOwn && (
                    <div className={`p-0.5 bg-gradient-to-br ${getArchetypeColor(matchProfile.archetype?.category)} rounded-full`}>
                      <Avatar className="w-8 h-8 border-2 border-white">
                        <AvatarImage src={matchProfile.photos?.[0]} />
                        <AvatarFallback className="text-xs bg-gray-100">{matchProfile.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className={`rounded-[25px] px-4 py-3 ${
                      message.isOwn
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200/50"
                    }`}>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-0 w-8 h-8 rounded-full ${
                            message.isOwn ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <div className="w-0 h-0 border-l-[6px] border-l-current border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5"></div>
                        </Button>
                        
                        {/* MÄÄK Waveform */}
                        <div className="flex items-center space-x-0.5 flex-1">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-0.5 rounded-full ${
                                message.isOwn ? "bg-white/60" : "bg-primary/40"
                              }`}
                              style={{
                                height: `${Math.random() * 16 + 4}px`
                              }}
                            />
                          ))}
                        </div>
                        
                        <span className={`text-sm ${
                          message.isOwn ? "text-white/80" : "text-gray/60"
                        }`}>
                          {formatDuration(message.voiceDuration || 0)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`text-xs text-gray-500 ${
                      message.isOwn ? "text-right" : "text-left"
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                <div className="flex items-end space-x-2 max-w-[80%]">
                  {!message.isOwn && (
                    <div className={`p-0.5 bg-gradient-to-br ${getArchetypeColor(matchProfile.archetype?.category)} rounded-full`}>
                      <Avatar className="w-8 h-8 border-2 border-white">
                        <AvatarImage src={matchProfile.photos?.[0]} />
                        <AvatarFallback className="text-xs bg-gray-100">{matchProfile.name?.[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className={`rounded-[25px] px-4 py-3 ${
                      message.isOwn
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-white/80 backdrop-blur-sm text-gray-800 border border-gray-200/50"
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    
                    <div className={`text-xs text-gray-500 flex items-center space-x-1 ${
                      message.isOwn ? "justify-end" : "justify-start"
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.isOwn && (
                        <span className="text-xs">
                          {message.status === "sent" ? "✓" : 
                           message.status === "delivered" ? "✓✓" : "✓✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className={`p-0.5 bg-gradient-to-br ${getArchetypeColor(matchProfile.archetype?.category)} rounded-full`}>
                <Avatar className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={matchProfile.photos?.[0]} />
                  <AvatarFallback className="text-xs bg-gray-100">{matchProfile.name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-[25px] px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* MÄÄK Quick Replies */}
      {!isTyping && (
        <div className="px-4 pb-2">
          <div className="flex space-x-2 overflow-x-auto">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(reply)}
                className="whitespace-nowrap bg-white/70 backdrop-blur-sm border-gray-200/50 text-gray-700 hover:bg-white rounded-full text-xs"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* MÄÄK Input */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200/50 px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-gray-500 hover:bg-gray-100"
            onClick={() => setShowEmojiPanel(!showEmojiPanel)}
          >
            <Plus className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              className="pr-12 rounded-[25px] border-gray-200/50 bg-white/70 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-gray-500"
                onClick={() => setShowEmojiPanel(!showEmojiPanel)}
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {newMessage.trim() ? (
            <Button 
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg"
              onClick={sendMessage}
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm" 
              variant="outline"
              className="rounded-full w-10 h-10 p-0 border-gray-200/50 bg-white/70 backdrop-blur-sm hover:bg-white"
              onClick={() => setShowVoiceRecorder(true)}
            >
              <Mic className="w-4 h-4 text-gray-600" />
            </Button>
          )}
        </div>

        {/* MÄÄK Emoji Panel */}
        {showEmojiPanel && (
          <div className="mt-3 p-3 bg-white/70 backdrop-blur-sm rounded-[15px] border border-gray-200/50">
            <div className="grid grid-cols-8 gap-2">
              {['😊', '😍', '🥰', '😘', '💕', '❤️', '🔥', '✨', '🎉', '😂', '🤔', '👍', '💯', '🙏', '☕', '🌟'].map((emoji, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="p-2 text-lg hover:bg-primary/10"
                  onClick={() => setNewMessage(prev => prev + emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice Recorder Modal */}
      <VoiceRecorder
        isOpen={showVoiceRecorder}
        onSendVoiceMessage={sendVoiceMessage}
        onCancel={() => setShowVoiceRecorder(false)}
      />
    </div>
  );
}