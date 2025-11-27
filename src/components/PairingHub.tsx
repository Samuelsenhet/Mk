import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Heart, Users, Zap, Circle, MessageCircle, Info, Target, Sparkles, TrendingUp, Share2 } from "lucide-react";
import { ArchetypeBadge, ArchetypeData } from "./ArchetypeBadge";
import { sessionlessApiClient } from "../utils/api-sessionless";
import { useAnalytics } from "../utils/analytics";

interface PairingUser {
  id: string;
  name: string;
  age: number;
  location: string;
  photos: string[];
  archetype: ArchetypeData;
  bio: string;
  interests: string[];
  compatibilityScore: number;
  pairingType: 'similarity' | 'complement';
  onlineStatus: 'online' | 'away' | 'offline';
  lastSeen?: string;
}

interface DailyQuestion {
  id: string;
  question: string;
  category: string;
  responses: number;
  userResponse?: number;
  options: string[];
  results: number[];
}

interface CommunityPost {
  id: string;
  type: "question_response" | "couple_vote" | "discussion";
  author: {
    name: string;
    avatar?: string;
    personalityType: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

const dailyQuestion: DailyQuestion = {
  id: "1",
  question: "Vad är viktigast för dig i ett förhållande?",
  category: "Relationer",
  responses: 1247,
  options: [
    "Kommunikation och förståelse",
    "Gemensamma värderingar", 
    "Fysisk attraktion",
    "Humor och skratt",
    "Trygghet och stabilitet"
  ],
  results: [35, 28, 8, 18, 11] // percentages
};

const communityPosts: CommunityPost[] = [
  {
    id: "1",
    type: "question_response",
    author: {
      name: "Anna K.",
      personalityType: "ENFP"
    },
    content: "Älskar dagens fråga! För mig är kommunikation allt. Utan den kan man inte bygga något djupare. 💬",
    timestamp: new Date(Date.now() - 1800000),
    likes: 24,
    comments: 7,
    isLiked: false
  },
  {
    id: "2",
    type: "couple_vote",
    author: {
      name: "MÄÄK Community",
      personalityType: "AI"
    },
    content: "Rösta på veckans söta par! 💕 Marcus & Emma från Stockholm - båda fotografer som träffades genom gemensamma intressen.",
    timestamp: new Date(Date.now() - 3600000),
    likes: 89,
    comments: 15,
    isLiked: true
  },
  {
    id: "3",
    type: "discussion",
    author: {
      name: "David L.",
      personalityType: "INFJ"
    },
    content: "Tips för första dejten som introvert? Känner mig alltid nervös att träffa nya människor även om vi matchat bra online 😅",
    timestamp: new Date(Date.now() - 7200000),
    likes: 12,
    comments: 23,
    isLiked: false
  }
];

const mockPairingUsers: PairingUser[] = [
  {
    id: "p1",
    name: "Anna K.",
    age: 27,
    location: "Stockholm",
    photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b372?w=300"],
    archetype: {
      type: "ENFP",
      name: "Entusiasten",
      emotional: "Vårdande",
      intellectual: "Kreativ",
      social: "Utåtriktad",
      lifestyle: "Flexibel"
    },
    bio: "Söker någon att utforska Stockholm med!",
    interests: ["Konst", "Resor", "Kaffe"],
    compatibilityScore: 92,
    pairingType: 'similarity',
    onlineStatus: 'online'
  },
  {
    id: "p2",
    name: "Erik L.",
    age: 30,
    location: "Göteborg",
    photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300"],
    archetype: {
      type: "INTJ",
      name: "Strategen",
      emotional: "Analytisk",
      intellectual: "Logisk",
      social: "Inåtriktad",
      lifestyle: "Planerad"
    },
    bio: "Balanserar din kreativitet med struktur",
    interests: ["Teknik", "Filosofi", "Musik"],
    compatibilityScore: 87,
    pairingType: 'complement',
    onlineStatus: 'away'
  },
  {
    id: "p3",
    name: "Lisa M.",
    age: 25,
    location: "Malmö",
    photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300"],
    archetype: {
      type: "ISFP",
      name: "Konstnären",
      emotional: "Utmanande",
      intellectual: "Känslomässig",
      social: "Balanserad",
      lifestyle: "Spontan"
    },
    bio: "Kreativ själ som söker djupa samtal",
    interests: ["Konst", "Natur", "Meditation"],
    compatibilityScore: 89,
    pairingType: 'similarity',
    onlineStatus: 'online'
  }
];

interface PairingHubProps {
  onStartChat?: (user: PairingUser) => void;
}

export function PairingHub({ onStartChat }: PairingHubProps) {
  const [users, setUsers] = useState<PairingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'similarity' | 'complement'>('all');
  const [selectedUser, setSelectedUser] = useState<PairingUser | null>(null);
  
  // Community state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [posts, setPosts] = useState(communityPosts);
  const [dailyQuestionData, setDailyQuestionData] = useState<DailyQuestion | null>(null);
  
  const { trackDailyQuestionAnswer, track } = useAnalytics();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load pairing users
        setUsers(mockPairingUsers);
        
        // Load daily question
        setDailyQuestionData(dailyQuestion);
        
        console.log('✅ Community & Pairing data loaded');
      } catch (error) {
        console.error("Failed to load data:", error);
        setUsers(mockPairingUsers);
        setDailyQuestionData(dailyQuestion);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredUsers = users.filter(user => 
    selectedType === 'all' || user.pairingType === selectedType
  );

  const handlePairWith = async (user: PairingUser) => {
    try {
      // In real app, this would send a pairing request
      console.log('Pairing request sent to:', user.name);
      if (onStartChat) {
        onStartChat(user);
      }
    } catch (error) {
      console.error("Failed to send pairing request:", error);
    }
  };

  const handleAnswerQuestion = async (answerIndex: number) => {
    if (!dailyQuestionData) return;
    
    try {
      setSelectedAnswer(answerIndex);
      setHasAnswered(true);
      
      // Track daily question answer
      trackDailyQuestionAnswer('current-user', dailyQuestionData.id, answerIndex);
      track('community_engagement', {
        type: 'daily_question_answered',
        question_id: dailyQuestionData.id,
        answer_index: answerIndex,
        question_category: dailyQuestionData.category
      });
      
      // Update the question data with new results
      setDailyQuestionData(prev => prev ? {
        ...prev,
        results: prev.results,
        responses: prev.responses + 1
      } : null);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  const toggleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const action = post.isLiked ? 'unlike' : 'like';
      
      track('community_engagement', {
        type: 'post_interaction',
        action,
        post_id: postId,
        post_type: post.type,
        author_personality: post.author.personalityType
      });
    }
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "nu";
    if (diffHours < 24) return `${diffHours}h sedan`;
    return `${Math.floor(diffHours / 24)}d sedan`;
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8" />
          </div>
          <p className="text-gray-600">Laddar pairing-förslag...</p>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedUser(null)}
          className="mb-4"
        >
          ← Tillbaka
        </Button>

        <Card>
          <div className="relative">
            <ImageWithFallback
              src={selectedUser.photos[0]}
              alt={selectedUser.name}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <div className="absolute top-4 right-4">
              <Badge className={`${
                selectedUser.onlineStatus === 'online' ? 'bg-green-500' :
                selectedUser.onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
              } text-white`}>
                {selectedUser.onlineStatus === 'online' ? 'Online' :
                 selectedUser.onlineStatus === 'away' ? 'Borta' : 'Offline'}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.age} år • {selectedUser.location}</p>
              </div>
              <Badge className={`${
                selectedUser.pairingType === 'similarity' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {selectedUser.compatibilityScore}% kompatibel
              </Badge>
            </div>

            <p className="text-gray-700 mb-4">{selectedUser.bio}</p>

            <div className="mb-4">
              <h4 className="text-sm mb-2">Arketyp</h4>
              <ArchetypeBadge archetype={selectedUser.archetype} variant="full" size="medium" />
            </div>

            <div className="mb-4">
              <h4 className="text-sm mb-2">Intressen</h4>
              <div className="flex flex-wrap gap-1">
                {selectedUser.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <h4 className="text-sm font-medium mb-1">Pairing-typ</h4>
              <p className="text-xs text-gray-600">
                {selectedUser.pairingType === 'similarity' 
                  ? '🎯 Likhet: Ni delar liknande värderingar och livsstil'
                  : '⚡ Komplement: Era skillnader skapar balans och tillväxt'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-4">
          <Button 
            variant="outline" 
            className="flex-1 h-12"
            onClick={() => setSelectedUser(null)}
          >
            Tillbaka
          </Button>
          <Button 
            className="flex-1 h-12 bg-primary hover:bg-primary/90"
            onClick={() => handlePairWith(selectedUser)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Para ihop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl mb-2">MÄÄK Community</h2>
        <p className="text-gray-600 text-sm">
          Gemenskap, diskussioner och personlighetsbaserad parning
        </p>
      </div>

      <Tabs defaultValue="pairing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pairing" className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>Parning</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4" />
            <span>Dagens fråga</span>
          </TabsTrigger>
          <TabsTrigger value="feed" className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>Community</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pairing" className="space-y-4 mt-4">

          {/* Side-by-side layout enligt Figma-fix */}
          <div className="mb-6">
            <div className="flex gap-3 mb-4">
              {/* Vänster card - 50% bredd */}
              <Card className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden">
                    <img 
                      src={mockPairingUsers[0].photos[0]} 
                      alt={mockPairingUsers[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{mockPairingUsers[0].name}</h3>
                  <p className="text-sm text-gray-600">{mockPairingUsers[0].age} år - {mockPairingUsers[0].location}</p>
                  <p className="text-sm text-primary font-medium">{mockPairingUsers[0].archetype.type}</p>
                  
                  {/* Fyra archetypes */}
                  <div className="mt-3">
                    <div className="space-y-1">
                      {[
                        `Emotionell: ${mockPairingUsers[0].archetype.emotional}`,
                        `Intellektuell: ${mockPairingUsers[0].archetype.intellectual}`,
                        `Social: ${mockPairingUsers[0].archetype.social}`,
                        `Livsstil: ${mockPairingUsers[0].archetype.lifestyle}`
                      ].map((trait, index) => (
                        <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {trait}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Höger card - 50% bredd */}
              <Card className="flex-1 bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden">
                    <img 
                      src={mockPairingUsers[1].photos[0]} 
                      alt={mockPairingUsers[1].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium">{mockPairingUsers[1].name}</h3>
                  <p className="text-sm text-gray-600">{mockPairingUsers[1].age} år - {mockPairingUsers[1].location}</p>
                  <p className="text-sm text-primary font-medium">{mockPairingUsers[1].archetype.type}</p>
                  
                  {/* Fyra archetypes - anpassade för MÄÄK */}
                  <div className="mt-3">
                    <div className="space-y-1">
                      {[
                        `Emotionell: ${mockPairingUsers[1].archetype.emotional}`,
                        `Intellektuell: ${mockPairingUsers[1].archetype.intellectual}`,
                        `Social: ${mockPairingUsers[1].archetype.social}`,
                        `Livsstil: ${mockPairingUsers[1].archetype.lifestyle}`
                      ].map((trait, index) => (
                        <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {trait}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pairing buttons enligt Figma-fix */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full"
                onClick={() => handlePairWith(mockPairingUsers[0])}
              >
                <Heart className="w-4 h-4 mr-2" />
                Ja, par ihop!
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-full"
                onClick={() => console.log('Nej clicked')}
              >
                Nej
              </Button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              size="sm"
              variant={selectedType === 'all' ? "default" : "outline"}
              onClick={() => setSelectedType('all')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-1" />
              Alla
            </Button>
            <Button
              size="sm"
              variant={selectedType === 'similarity' ? "default" : "outline"}
              onClick={() => setSelectedType('similarity')}
              className="flex-1"
            >
              <Circle className="w-4 h-4 mr-1" />
              Likhet
            </Button>
            <Button
              size="sm"
              variant={selectedType === 'complement' ? "default" : "outline"}
              onClick={() => setSelectedType('complement')}
              className="flex-1"
            >
              <Zap className="w-4 h-4 mr-1" />
              Komplement
            </Button>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.photos[0]} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        user.onlineStatus === 'online' ? 'bg-green-500' :
                        user.onlineStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium truncate">{user.name}, {user.age}</h3>
                        <Badge className={`text-xs ${
                          user.pairingType === 'similarity' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {user.compatibilityScore}%
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 truncate">{user.bio}</p>
                      
                      <div className="flex items-center justify-between">
                        <ArchetypeBadge archetype={user.archetype} variant="minimal" />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                            }}
                          >
                            <Info className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePairWith(user);
                            }}
                          >
                            <Heart className="w-3 h-3 mr-1" />
                            Para
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg mb-2">Inga användare hittades</h3>
              <p className="text-gray-600">Prova att ändra filter eller kom tillbaka senare.</p>
            </div>
          )}

          {/* Information footer */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Så fungerar personlighetsbaserad parning</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <p>🎯 <strong>Likhet:</strong> Personer med liknande personlighetstyper för harmoni</p>
              <p>⚡ <strong>Komplement:</strong> Personer med kompletterande skillnader för balans</p>
              <p>💬 <strong>Para ihop:</strong> Skicka en paringsförfrågan för att starta en chatt</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Dagens fråga
                </CardTitle>
                <Badge variant="secondary">
                  {dailyQuestionData?.category || "Laddar..."}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {dailyQuestionData?.responses || 0} personer har svarat
              </p>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg mb-4">{dailyQuestionData?.question || "Laddar dagens fråga..."}</h3>
              
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : !hasAnswered && dailyQuestionData ? (
                <div className="space-y-2">
                  {dailyQuestionData.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 text-left"
                      onClick={() => handleAnswerQuestion(index)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : dailyQuestionData ? (
                <div className="space-y-3">
                  {dailyQuestionData.options.map((option, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={selectedAnswer === index ? "font-medium text-primary" : ""}>
                          {option}
                        </span>
                        <span>{dailyQuestionData.results[index]}%</span>
                      </div>
                      <Progress 
                        value={dailyQuestionData.results[index]} 
                        className={`h-2 ${selectedAnswer === index ? "opacity-100" : "opacity-60"}`}
                      />
                    </div>
                  ))}
                  
                  {selectedAnswer !== null && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Ditt svar: <strong>{dailyQuestionData.options[selectedAnswer]}</strong>
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Du är i {dailyQuestionData.results[selectedAnswer]}% som valde detta!
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4 mt-4">
          {/* Community Header enligt Figma-bilder */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-4 h-0.5 bg-gray-600"></div>
                  <div className="w-4 h-0.5 bg-gray-600"></div>
                  <div className="w-4 h-0.5 bg-gray-600"></div>
                </div>
              </Button>
              
              {/* MÄÄK Logo med 3D-effekt */}
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b372?w=100" />
                <AvatarFallback>Du</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Community Tabs enligt bild 1 */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-full p-1">
              <Button variant="default" size="sm" className="rounded-full px-6 bg-black text-white">
                Feeds
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-4 text-gray-600">
                Recents
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-4 text-gray-600">
                Friends
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full px-4 text-gray-600">
                Popular
              </Button>
            </div>
          </div>

          {/* Enhanced Posts enligt bilderna */}
          {/* George Lobko Post - Berg-posten från bild 1 */}
          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
                      <AvatarFallback className="bg-primary text-white">GL</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base">George Lobko</h3>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </Button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm leading-relaxed">
                    Hi everyone, today I was on the most beautiful mountain in the world 🏔️, I also want to say hi to {" "}
                    <span className="inline-flex items-center">
                      <Avatar className="w-4 h-4 mx-1">
                        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50" />
                      </Avatar>
                      <span className="text-primary font-medium">Silena</span>
                    </span>, {" "}
                    <span className="inline-flex items-center">
                      <Avatar className="w-4 h-4 mx-1">
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b372?w=50" />
                      </Avatar>
                      <span className="text-red-500 font-medium">Olya</span>
                    </span> and {" "}
                    <span className="inline-flex items-center">
                      <Avatar className="w-4 h-4 mx-1">
                        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50" />
                      </Avatar>
                      <span className="text-blue-500 font-medium">David</span>
                    </span>
                  </p>
                </div>
                
                {/* Bilder grid som i bild 1 */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120"
                    alt="Mountain view"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=200&h=120"
                    alt="Mountain landscape"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                </div>
                
                {/* Interaction bar som i bilderna */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs">👁️</span>
                    </div>
                    <span className="text-sm">6355</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="p-1 text-red-500">
                      <Heart className="w-5 h-5 fill-current" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-gray-500">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                    <Button size="sm" className="bg-gray-500 text-white rounded-full px-4 py-1">
                      Set Reaction
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitaliy Boyko Post - Kaffe-posten från bild 1 */}
          <Card className="overflow-hidden bg-gradient-to-br from-yellow-50 to-orange-50 border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                      <AvatarFallback className="bg-primary text-white">VB</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base">Vitaliy Boyko</h3>
                      <p className="text-xs text-gray-500">3 hours ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </Button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm leading-relaxed">
                    I chose a wonderful coffee today, I wanted to tell you what product they have in stock - it's a latte with coconut 🥥 milk.. It's really incredible tasty!! 😋
                  </p>
                  
                  {/* Emoji reactions */}
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-xl">🔥</span>
                    <span className="text-xl">🤤</span>
                    <span className="text-xl">😋</span>
                    <span className="text-xl">❤️</span>
                  </div>
                </div>
                
                {/* Interaction bar */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs">👁️</span>
                    </div>
                    <span className="text-sm">5212</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="p-1 text-red-500">
                      <Heart className="w-5 h-5 fill-current" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 text-gray-500">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                    
                    {/* Special Woow button from image */}
                    <div className="relative">
                      <Button className="bg-gradient-to-r from-pink-400 to-red-400 text-white rounded-full px-4 py-1 text-sm">
                        🔥 Woow!!!
                      </Button>
                      <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                        <div className="w-3 h-3 bg-black rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✨</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nikita Osincev Post - Bergs-vandring från bild 1 */}
          <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                      <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" />
                      <AvatarFallback className="bg-primary text-white">NO</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base">Nikita Osincev</h3>
                      <p className="text-xs text-gray-500">5h 32min ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1">
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </Button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm leading-relaxed">
                    Just hiked to the top of a breathtaking mountain! ⛰️
                  </p>
                  
                  {/* Hashtags som i bild 1 */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-primary font-medium">#AdventureTime</span>
                    <span className="text-primary font-medium">#MountainLove</span>
                    <span className="text-primary font-medium">#NatureLover</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations section från bild 2 */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">Recommendations</h3>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {/* UI/UX Circle */}
                <div className="flex-1 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-2">
                    <div className="w-8 h-8">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                        <path d="M19 15L19.74 17.74L22.5 18.5L19.74 19.26L19 22L18.26 19.26L15.5 18.5L18.26 17.74L19 15Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm font-medium">UI/UX</p>
                </div>
                
                {/* Music Circle */}
                <div className="flex-1 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center mx-auto mb-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-4 bg-black rounded-full"></div>
                      <div className="w-1 h-6 bg-black rounded-full"></div>
                      <div className="w-1 h-3 bg-black rounded-full"></div>
                      <div className="w-1 h-5 bg-black rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-sm font-medium">Music</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fallback till ursprungliga posts */}
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {post.author.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{post.author.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {post.author.personalityType}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(post.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                      {post.content}
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 px-2 ${post.isLiked ? "text-red-500" : "text-gray-500"}`}
                        onClick={() => toggleLike(post.id)}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                        <span className="text-xs">{post.likes}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">{post.comments}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="border-dashed">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">Vill du dela något med communityn?</p>
              <Button variant="outline" className="mt-3" size="sm">
                Skapa inlägg
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}