import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Heart, MessageCircle, Share2, TrendingUp, Users, Sparkles, ArrowRight, BarChart3 } from "lucide-react";
import { apiClient } from "../utils/api";
import { useAnalytics } from "../utils/analytics";
import { PairingHub } from "./PairingHub";
import { SocialMediaTrends } from "./SocialMediaTrends";

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

interface TrendingTopic {
  id: string;
  hashtag: string;
  description: string;
  growth: string;
  status: 'Trending' | 'Populärt' | 'Växande';
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
  results: [35, 28, 8, 18, 11]
};

// MÄÄK Community trending topics enligt bild 2
const trendingTopics: TrendingTopic[] = [
  {
    id: "1",
    hashtag: "#PersonlighetMatching",
    description: "+47% diskussioner",
    growth: "+47%",
    status: "Trending"
  },
  {
    id: "2", 
    hashtag: "#FörstaIntryck",
    description: "+32% engagemang",
    growth: "+32%",
    status: "Populärt"
  },
  {
    id: "3",
    hashtag: "#HållbarKärlek", 
    description: "+28% delningar",
    growth: "+28%",
    status: "Växande"
  }
];

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

interface CommunityFeaturesProps {
  onStartChat?: (profile: any) => void;
  userPersonality?: any;
  userMatches?: any[];
}

export function CommunityFeatures({ onStartChat, userPersonality, userMatches }: CommunityFeaturesProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [posts, setPosts] = useState(communityPosts);
  const [dailyQuestionData, setDailyQuestionData] = useState<DailyQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPairingHub, setShowPairingHub] = useState(false);
  
  const { trackDailyQuestionAnswer, track } = useAnalytics();
  
  // Load daily question from API
  useEffect(() => {
    const loadDailyQuestion = async () => {
      try {
        const result = await apiClient.getDailyQuestion();
        if (result.question) {
          setDailyQuestionData(result.question);
          if (result.question.percentages) {
            setHasAnswered(true);
          }
        }
      } catch (error) {
        console.error("Failed to load daily question:", error);
        setDailyQuestionData(dailyQuestion);
      } finally {
        setLoading(false);
      }
    };

    loadDailyQuestion();
  }, []);

  const handleAnswerQuestion = async (answerIndex: number) => {
    if (!dailyQuestionData) return;
    
    try {
      const result = await apiClient.answerDailyQuestion(answerIndex);
      if (result.success) {
        setSelectedAnswer(answerIndex);
        setHasAnswered(true);
        
        trackDailyQuestionAnswer('current-user', dailyQuestionData.id, answerIndex);
        track('community_engagement', {
          type: 'daily_question_answered',
          question_id: dailyQuestionData.id,
          answer_index: answerIndex,
          question_category: dailyQuestionData.category
        });
        
        setDailyQuestionData(prev => prev ? {
          ...prev,
          results: result.results,
          responses: prev.responses + 1
        } : null);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setSelectedAnswer(answerIndex);
      setHasAnswered(true);
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

  // If user wants to access Pairing Hub
  if (showPairingHub) {
    return (
      <div>
        <div className="max-w-md mx-auto p-6 pb-2">
          <Button 
            variant="ghost" 
            onClick={() => setShowPairingHub(false)}
            className="mb-4"
          >
            ← Tillbaka till Pairing
          </Button>
        </div>
        <PairingHub onStartChat={onStartChat} />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      {/* MÄÄK Pairing Header enligt bild 2 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">MÄÄK Pairing</h1>
        <p className="text-gray-600 text-sm">
          Manuell archetype-baserad parning och gemenskap
        </p>
      </div>

      {/* Tabs enligt bild 2 */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 rounded-[25px] p-1">
          <TabsTrigger 
            value="daily" 
            className="rounded-[20px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Dagens fråga
          </TabsTrigger>
          <TabsTrigger 
            value="feed" 
            className="rounded-[20px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Pairing
          </TabsTrigger>
          <TabsTrigger 
            value="trends" 
            className="rounded-[20px] text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Sociala Trender
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-6">
          <Card className="rounded-[25px] border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-medium">Dagens fråga</span>
                </div>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  {dailyQuestionData?.category || "Laddar..."}
                </Badge>
              </div>
              
              <h3 className="text-lg font-medium mb-4 leading-relaxed">
                {dailyQuestionData?.question || "Laddar dagens fråga..."}
              </h3>
              
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-[15px] animate-pulse"></div>
                  ))}
                </div>
              ) : !hasAnswered && dailyQuestionData ? (
                <div className="space-y-3">
                  {dailyQuestionData.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 text-left rounded-[15px] border-gray-200 hover:bg-gray-50"
                      onClick={() => handleAnswerQuestion(index)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : dailyQuestionData ? (
                <div className="space-y-4">
                  {dailyQuestionData.options.map((option, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={selectedAnswer === index ? "font-medium text-primary" : ""}>
                          {option}
                        </span>
                        <span className="font-medium">{dailyQuestionData.results[index]}%</span>
                      </div>
                      <Progress 
                        value={dailyQuestionData.results[index]} 
                        className={`h-2 ${selectedAnswer === index ? "opacity-100" : "opacity-60"}`}
                      />
                    </div>
                  ))}
                  
                  {selectedAnswer !== null && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-[15px]">
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
              
              <p className="text-xs text-gray-500 mt-4">
                {dailyQuestionData?.responses || 0} personer har svarat
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4">
          {/* Förbättrad Pairing Hub enligt Figma-analys - starkare fokus */}
          <Card className="rounded-[25px] border-0 bg-white shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Para ihop användare</CardTitle>
                    <p className="text-sm text-gray-600">Hjälp andra hitta sin match</p>
                  </div>
                </div>
                <Badge className="bg-gradient-primary text-white border-0">
                  Nytt
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <PairingHub 
                userPersonality={userPersonality}
                onStartChat={onStartChat}
                isEmbedded={true}
              />
            </CardContent>
          </Card>

          {/* Ny info om sociala medier-funktionen */}
          <Card className="rounded-[25px] border-0 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Nya Sociala Trender!</h4>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    Se inlägg från sociala medier från personer du har matchat med. Endast matchade användare kan se varandras innehåll.
                  </p>
                  <p className="text-xs text-gray-600">
                    🔒 Integritetsskyddat • 📱 Flera plattformar • 🎯 Baserat på matchningar
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {posts.map((post) => (
            <Card key={post.id} className="rounded-[25px] border-0 bg-white shadow-sm">
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
                      <Badge variant="outline" className="text-xs border-gray-200">
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
          
          <Card className="rounded-[25px] border-2 border-dashed border-gray-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 text-sm mb-3">Vill du dela något med pairing-communityn?</p>
              <Button variant="outline" className="rounded-[15px]" size="sm">
                Skapa inlägg
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Nya sociala medier-trender från matchade användare */}
          <SocialMediaTrends 
            userPersonality={userPersonality}
            userMatches={userMatches}
            onStartChat={onStartChat}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}