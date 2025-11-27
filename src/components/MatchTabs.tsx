import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, MoreHorizontal, MessageCircle, Heart, Sparkles, Filter, Zap } from 'lucide-react';
import { sessionlessApiClient } from '../utils/api-sessionless';
import { useAnalytics } from '../utils/analytics';

interface ChatProfile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  archetype: {
    type: string;
    name: string;
    category: 'Diplomater' | 'Byggare' | 'Upptäckare' | 'Strateger';
  };
  lastMessage?: {
    text: string;
    timestamp: Date;
    isOwn: boolean;
    isTyping?: boolean;
  };
  unreadCount: number;
  isOnline: boolean;
  compatibilityScore: number;
  matchType: 'similarity' | 'complement';
  aiSuggestion?: string;
}

// MÄÄK-anpassade mock data med personlighetstyper
const mockChats: ChatProfile[] = [
  {
    id: "emma_diplomat",
    name: "Emma S.",
    age: 26,
    photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150"],
    archetype: {
      type: "INFP",
      name: "Mediatorn",
      category: "Diplomater"
    },
    lastMessage: {
      text: "Jag älskar dina tankar om kreativitet! 🎨",
      timestamp: new Date(Date.now() - 480000), // 8 min sedan
      isOwn: false,
      isTyping: false
    },
    unreadCount: 3,
    isOnline: true,
    compatibilityScore: 94,
    matchType: 'similarity',
    aiSuggestion: "Fråga om hennes konstnärliga projekt"
  },
  {
    id: "lucas_diplomat",
    name: "Lucas M.",
    age: 29,
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"],
    archetype: {
      type: "ENFJ",
      name: "Protagonisten", 
      category: "Diplomater"
    },
    lastMessage: {
      text: "Skriver...",
      timestamp: new Date(Date.now() - 60000), // 1 min sedan
      isOwn: false,
      isTyping: true
    },
    unreadCount: 1,
    isOnline: true,
    compatibilityScore: 91,
    matchType: 'complement',
    aiSuggestion: "Dela dina framtidsdrömmar"
  },
  {
    id: "anna_byggare",
    name: "Anna K.",
    age: 27,
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"],
    archetype: {
      type: "ISFJ",
      name: "Beskyddaren",
      category: "Byggare"
    },
    lastMessage: {
      text: "Tack för det trevliga samtalet igår! 😊",
      timestamp: new Date(Date.now() - 720000), // 12 min sedan
      isOwn: true
    },
    unreadCount: 0,
    isOnline: false,
    compatibilityScore: 89,
    matchType: 'complement',
    aiSuggestion: "Föreslå en lugn aktivitet tillsammans"
  },
  {
    id: "oliver_upptackare",
    name: "Oliver L.",
    age: 25,
    photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"],
    archetype: {
      type: "ESFP",
      name: "Underhållaren",
      category: "Upptäckare"
    },
    lastMessage: {
      text: "🎉 Har du lust att gå på konsert imorgon?",
      timestamp: new Date(Date.now() - 900000), // 15 min sedan
      isOwn: false
    },
    unreadCount: 2,
    isOnline: true,
    compatibilityScore: 86,
    matchType: 'complement',
    aiSuggestion: "Föreslå ett spontant äventyr"
  },
  {
    id: "sofia_strateg",
    name: "Sofia R.",
    age: 30,
    photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"],
    archetype: {
      type: "INTJ", 
      name: "Arkitekten",
      category: "Strateger"
    },
    lastMessage: {
      text: "Intressant perspektiv på innovation!",
      timestamp: new Date(Date.now() - 1200000), // 20 min sedan
      isOwn: true
    },
    unreadCount: 0,
    isOnline: false,
    compatibilityScore: 92,
    matchType: 'complement',
    aiSuggestion: "Diskutera framtidsteknologi"
  }
];

interface MatchTabsProps {
  onStartChat: (profile: any) => void;
  onShowProfile: (profile: any) => void;
}

export function MatchTabs({ onStartChat, onShowProfile }: MatchTabsProps) {
  const [chats, setChats] = useState<ChatProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'online'>('all');
  
  const { track } = useAnalytics();

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setChats(mockChats);
        console.log('✅ MÄÄK Chattar laddade med personlighetsbaserad matchning');
      } catch (error) {
        console.error("Failed to load chats:", error);
        setChats(mockChats);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return 'nu';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return `${Math.floor(diffMinutes / 1440)}d`;
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

  const getArchetypeEmoji = (category: string) => {
    switch (category) {
      case 'Diplomater': return '💜';
      case 'Byggare': return '💚';      
      case 'Upptäckare': return '💛'; 
      case 'Strateger': return '💙';      
      default: return '🤍';
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && chat.unreadCount > 0) ||
                         (filterType === 'online' && chat.isOnline);
    return matchesSearch && matchesFilter;
  });

  const totalUnread = chats.reduce((total, chat) => total + chat.unreadCount, 0);

  const handleChatClick = (chat: ChatProfile) => {
    track('maak_chat_opened', { 
      chat_id: chat.id, 
      chat_name: chat.name, 
      archetype: chat.archetype.type,
      compatibility: chat.compatibilityScore
    });
    
    const profileForChat = {
      id: chat.id,
      name: chat.name,
      age: chat.age,
      photos: chat.photos,
      compatibilityScore: chat.compatibilityScore,
      archetype: chat.archetype,
      bio: `En ${chat.archetype.name} (${chat.archetype.type}) som du matchar ${chat.compatibilityScore}% med`,
      matchType: chat.matchType,
      aiSuggestion: chat.aiSuggestion
    };
    
    onStartChat(profileForChat);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
            <MessageCircle className="w-8 h-8" />
          </div>
          <p className="text-gray-600">Laddar dina MÄÄK-konversationer...</p>
          <p className="text-sm text-gray-500 mt-2">Personlighetsbaserad matchning aktiv</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* MÄÄK Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-md mx-auto px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Konversationer
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {totalUnread > 0 ? `${totalUnread} nya meddelanden` : `${chats.length} aktiva chattar`}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* MÄÄK Search Bar */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Sök efter namn eller arketyp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-[25px] text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary"
            />
          </div>

          {/* MÄÄK Filter Pills */}
          <div className="flex space-x-2 mb-4">
            {[
              { key: 'all', label: 'Alla', icon: MessageCircle },
              { key: 'unread', label: 'Olästa', icon: Heart },
              { key: 'online', label: 'Online', icon: Zap }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={filterType === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(key as any)}
                className={`rounded-full text-sm font-medium transition-all duration-200 ${
                  filterType === key 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                    : 'bg-white/70 backdrop-blur-sm border-gray-200/50 text-gray-600 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
                {key === 'unread' && totalUnread > 0 && (
                  <Badge className="ml-2 bg-white/20 text-white border-0 text-xs">
                    {totalUnread}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* MÄÄK Chat List */}
      <div className="max-w-md mx-auto px-6 pt-6 pb-20">
        {filteredChats.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'Inga resultat' : 'Inga chattar än'}
            </h3>
            <p className="text-gray-600 text-center px-8">
              {searchQuery 
                ? 'Prova att söka efter något annat' 
                : 'När du får matchningar kommer era konversationer att visas här'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-[25px] overflow-hidden"
                onClick={() => handleChatClick(chat)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    {/* MÄÄK Profile Picture med archetype-ring */}
                    <div className="relative">
                      <div className={`p-0.5 bg-gradient-to-br ${getArchetypeColor(chat.archetype.category)} rounded-full`}>
                        <Avatar className="w-14 h-14 border-2 border-white">
                          <AvatarImage src={chat.photos[0]} alt={chat.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-700">
                            {chat.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                      {chat.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* MÄÄK Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 truncate">
                            {chat.name}, {chat.age}
                          </h3>
                          <span className="text-lg">
                            {getArchetypeEmoji(chat.archetype.category)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(chat.lastMessage!.timestamp)}
                        </span>
                      </div>
                      
                      {/* MÄÄK Archetype & Compatibility */}
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge 
                          className={`text-xs px-2 py-1 bg-gradient-to-r ${getArchetypeColor(chat.archetype.category)} text-white border-0`}
                        >
                          {chat.archetype.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-1 border-primary/30 text-primary">
                          {chat.compatibilityScore}% match
                        </Badge>
                        {chat.matchType === 'similarity' ? (
                          <Badge variant="outline" className="text-xs px-2 py-1 border-blue-300 text-blue-700">
                            🎯 Likhet
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs px-2 py-1 border-purple-300 text-purple-700">
                            ⚡ Komplement
                          </Badge>
                        )}
                      </div>
                      
                      {/* MÄÄK Last Message */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 flex-1 min-w-0">
                          {chat.lastMessage?.isOwn && !chat.lastMessage?.isTyping && (
                            <span className="text-gray-500 text-sm">Du:</span>
                          )}
                          <p className={`text-sm truncate ${
                            chat.lastMessage?.isTyping ? 'text-primary italic' :
                            chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                          }`}>
                            {chat.lastMessage?.text}
                          </p>
                        </div>
                        
                        {chat.aiSuggestion && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 text-primary hover:bg-primary/10"
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* MÄÄK AI Suggestion */}
                      {chat.aiSuggestion && chat.unreadCount === 0 && (
                        <div className="mt-2 p-2 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
                          <div className="flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-xs text-gray-700 font-medium">AI-förslag:</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {chat.aiSuggestion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* MÄÄK Bottom Info */}
        <div className="mt-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-4 border border-gray-200/50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700">MÄÄK Smart Matchning</span>
            </div>
            <p className="text-xs text-gray-600">
              Personlighetsbaserade konversationer för djupare förbindelser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}