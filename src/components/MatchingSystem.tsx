import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Progress } from "./ui/progress";
import { Heart, Info, MapPin, Users, Sparkles, Star, Clock, MessageCircle, UserCheck, Zap, Target, ArrowRight } from "lucide-react";
import { ArchetypeBadge, ArchetypeData } from "./ArchetypeBadge";
import { ProfileView } from "./ProfileView";
import { sessionlessApiClient } from "../utils/api-sessionless";
import { useAnalytics } from "../utils/analytics";

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  distance: number;
  personalityType: string;
  personalityName: string;
  category: 'Diplomater' | 'Byggare' | 'Upptäckare' | 'Strateger';
  compatibilityScore: number;
  matchType: 'similarity' | 'complement';
  interests: string[];
  occupation: string;
  education?: string;
  location: string;
  isOnline: boolean;
  lastSeen?: string;
  verifiedProfile: boolean;
  mutualInterests?: string[];
  aiInsight?: string;
}

interface DailyMatches {
  similarityMatches: MatchProfile[];
  complementMatches: MatchProfile[];
  refreshTime: Date | string;
  totalMatches: number;
}

interface MatchingSystemProps {
  userPersonality?: any;
  onStartChat: (profile: MatchProfile) => void;
}

export function MatchingSystem({ userPersonality, onStartChat }: MatchingSystemProps) {
  const [dailyMatches, setDailyMatches] = useState<DailyMatches | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<MatchProfile | null>(null);
  const [refreshCooldown, setRefreshCooldown] = useState(0);
  const { track } = useAnalytics();

  // Mock data enligt Figma-analys: "Emma L\n26 år - Täby\nDiplomat, INFP"
  const mockDailyMatches: DailyMatches = {
    similarityMatches: [
      {
        id: "emma_similarity",
        name: "Emma L",
        age: 26,
        photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400"],
        bio: "Kreativ diplomat som älskar konst, musik och djupa samtal. Letar efter någon som delar mina värderingar om äkthet och personlig utveckling. 🎨✨",
        distance: 2,
        personalityType: "INFP",
        personalityName: "Diplomat",
        category: "Diplomater",
        compatibilityScore: 94,
        matchType: 'similarity',
        interests: ["Emotionell: Vårdande", "Kreativ: Konstnärlig", "Social: Empatisk", "Mental: Reflekterande"],
        occupation: "Grafisk Designer",
        education: "Konstfack Stockholm",
        location: "Täby",
        isOnline: true,
        verifiedProfile: true,
        mutualInterests: ["Konst", "Musik", "Läsning"],
        aiInsight: "Era kreativa själar resonerar på samma frekvens - perfekt för djupa artistiska diskussioner"
      },
      {
        id: "lucas_similarity",
        name: "Lucas M.",
        age: 29,
        photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
        bio: "Empatisk och driven person som brinner för att hjälpa andra växa. Jobbar inom coaching och ledarskap. Söker någon som värdesätter personlig utveckling. 🌱",
        distance: 5,
        personalityType: "ENFJ",
        personalityName: "Protagonisten",
        category: "Diplomater",
        compatibilityScore: 91,
        matchType: 'similarity',
        interests: ["Coaching", "Ledarskap", "Självutveckling", "Resor", "Podcast"],
        occupation: "Ledarskapskonsult",
        education: "Handelshögskolan",
        location: "Vasastan, Stockholm",
        isOnline: false,
        lastSeen: "2 tim sedan",
        verifiedProfile: true,
        mutualInterests: ["Självutveckling", "Podcast"],
        aiInsight: "Era gemensamma värderingar om personlig tillväxt skapar stark grund för relation"
      }
    ],
    complementMatches: [
      {
        id: "anna_complement",
        name: "Anna K.",
        age: 27,
        photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"],
        bio: "Organiserad och omtänksam person som älskar att planera och skapa struktur. Arbetar som projektledare och har ett varmt hjärta för familj och vänskap. 💚",
        distance: 3,
        personalityType: "ISFJ",
        personalityName: "Beskyddaren",
        category: "Byggare",
        compatibilityScore: 89,
        matchType: 'complement',
        interests: ["Matlagning", "Trädgård", "Familj", "Filmer", "Promenader"],
        occupation: "Projektledare",
        education: "KTH",
        location: "Östermalm, Stockholm",
        isOnline: true,
        verifiedProfile: true,
        mutualInterests: ["Filmer"],
        aiInsight: "Er kombination av kreativitet och struktur skapar perfekt balans i relationen"
      },
      {
        id: "oliver_complement",
        name: "Oliver L.",
        age: 25,
        photos: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"],
        bio: "Spontan äventyrare som lever i nuet! Älskar att resa, upptäcka nya platser och träffa intressanta människor. Livet är för kort för att vara tråkigt! 🌟",
        distance: 4,
        personalityType: "ESFP",
        personalityName: "Underhållaren",
        category: "Upptäckare",
        compatibilityScore: 86,
        matchType: 'complement',
        interests: ["Resor", "Äventyr", "Musik", "Dans", "Fotografering"],
        occupation: "Fotograf",
        education: "Fotohögskolan",
        location: "Södermalm, Stockholm",
        isOnline: true,
        verifiedProfile: true,
        mutualInterests: ["Musik", "Fotografering"],
        aiInsight: "Hans spontanitet kompletterar din reflektion - tillsammans skapar ni magiska upplevelser"
      },
      {
        id: "sofia_complement",
        name: "Sofia R.",
        age: 30,
        photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"],
        bio: "Analytisk och visionär tänkare som älskar innovation och framtidsteknologi. Jobbar med hållbara lösningar och drömmer om en bättre värld. 🚀",
        distance: 6,
        personalityType: "INTJ",
        personalityName: "Arkitekten",
        category: "Strateger",
        compatibilityScore: 92,
        matchType: 'complement',
        interests: ["Teknologi", "Innovation", "Hållbarhet", "Böcker", "Schack"],
        occupation: "Tech Innovation Lead",
        education: "KTH Civilingenjör",
        location: "Kista, Stockholm",
        isOnline: false,
        lastSeen: "30 min sedan",
        verifiedProfile: true,
        mutualInterests: ["Teknologi", "Böcker"],
        aiInsight: "Era olika styrkor inom kreativitet och analytik skapar innovativ dynamik"
      }
    ],
    refreshTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 timmar från nu
    totalMatches: 5
  };

  useEffect(() => {
    const loadDailyMatches = async () => {
      try {
        setLoading(true);
        console.log('[DAILY MATCHES] Laddar dagliga MÄÄK-matchningar med Smart flödesmatchning...');
        
        // Simulera API-anrop
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Försök hämta från API
        try {
          const result = await sessionlessApiClient.getDailyMatches(userPersonality?.type);
          console.log('[DAILY MATCHES API] Resultat från API:', result);
          
          // Check if result contains the daily matches structure
          if (result && (result.similarityMatches || result.complementMatches)) {
            // Ensure refreshTime is properly handled
            const processedResult = {
              ...result,
              refreshTime: result.refreshTime || new Date(Date.now() + 24 * 60 * 60 * 1000),
              totalMatches: result.totalMatches || (result.similarityMatches?.length || 0) + (result.complementMatches?.length || 0)
            };
            setDailyMatches(processedResult);
            console.log('[DAILY MATCHES SUCCESS] API-matchningar laddade framgångsrikt');
          } else if (result.success && result.matches) {
            // Legacy format support
            const processedMatches = {
              ...result.matches,
              refreshTime: result.matches.refreshTime || new Date(Date.now() + 24 * 60 * 60 * 1000),
              totalMatches: result.matches.totalMatches || 0
            };
            setDailyMatches(processedMatches);
            console.log('[DAILY MATCHES SUCCESS] Legacy API-format använt');
          } else {
            throw new Error('No valid matches structure from API');
          }
        } catch (apiError) {
          console.log('[DAILY MATCHES FALLBACK] API-fel, använder demo-matchningar:', apiError);
          setDailyMatches(mockDailyMatches);
        }
        
        // Spåra laddning av dagliga matchningar
        track('daily_matches_loaded', {
          user_personality: userPersonality?.type || 'unknown',
          similarity_count: mockDailyMatches.similarityMatches.length,
          complement_count: mockDailyMatches.complementMatches.length,
          total_matches: mockDailyMatches.totalMatches
        });
        
      } catch (error) {
        console.error('[DAILY MATCHES ERROR] Fel vid laddning av dagliga matchningar:', error);
        setDailyMatches(mockDailyMatches);
      } finally {
        setLoading(false);
      }
    };

    loadDailyMatches();
  }, [userPersonality, track]);

  const formatTimeUntilRefresh = (refreshTime: Date | string) => {
    const now = new Date();
    const refreshDate = refreshTime instanceof Date ? refreshTime : new Date(refreshTime);
    
    // Safety check: if refreshDate is invalid, default to 24h from now
    if (isNaN(refreshDate.getTime())) {
      const defaultRefresh = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const diff = defaultRefresh.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }
    
    const diff = refreshDate.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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

  const handleProfileClick = (profile: MatchProfile) => {
    setSelectedMatch(profile);
    track('daily_match_viewed', {
      match_id: profile.id,
      match_name: profile.name,
      personality_type: profile.personalityType,
      match_type: profile.matchType,
      compatibility_score: profile.compatibilityScore
    });
  };

  const handleStartChat = (profile: MatchProfile) => {
    track('daily_match_chat_started', {
      match_id: profile.id,
      match_name: profile.name,
      personality_type: profile.personalityType,
      match_type: profile.matchType,
      compatibility_score: profile.compatibilityScore
    });
    onStartChat(profile);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8" />
          </div>
          <p className="text-gray-600">Laddar dina dagliga MÄÄK-matchningar...</p>
          <p className="text-sm text-gray-500 mt-2">Smart flödesmatchning aktiverad</p>
        </div>
      </div>
    );
  }

  if (!dailyMatches) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <p className="text-gray-600">Kunde inte ladda matchningar</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Försök igen
          </Button>
        </div>
      </div>
    );
  }

  // Detaljerad profilvy med nya ProfileView-komponenten
  if (selectedMatch) {
    // Convert MatchProfile to ProfileData format
    const profileData = {
      id: selectedMatch.id,
      name: selectedMatch.name,
      age: selectedMatch.age,
      title: selectedMatch.occupation,
      location: selectedMatch.location,
      avatar: selectedMatch.photos[0],
      photos: selectedMatch.photos,
      bio: selectedMatch.bio,
      personalityType: selectedMatch.personalityType,
      personalityName: selectedMatch.personalityName,
      category: selectedMatch.category,
      compatibilityScore: selectedMatch.compatibilityScore,
      matchType: selectedMatch.matchType,
      skills: ['UX Design', 'Figma', 'Prototyping', 'User Research'], // Mock skills based on occupation
      interests: selectedMatch.interests,
      statistics: {
        experience: 2928,
        skills: 1855,
        testing: 3072,
        interview: 2651
      },
      testStats: {
        points: 278,
        percentile: 85,
        chartData: [75, 62, 88, 71, 94],
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
      },
      verified: selectedMatch.verifiedProfile,
      premium: false
    };

    return (
      <ProfileView
        profile={profileData}
        onBack={() => setSelectedMatch(null)}
        onLike={() => {
          track('match_like', {
            match_id: selectedMatch.id,
            personality_type: selectedMatch.personalityType,
            compatibility_score: selectedMatch.compatibilityScore,
            match_type: selectedMatch.matchType
          });
          onStartChat(selectedMatch);
        }}
        onMessage={() => {
          track('match_message', {
            match_id: selectedMatch.id,
            personality_type: selectedMatch.personalityType,
            match_type: selectedMatch.matchType
          });
          onStartChat(selectedMatch);
        }}
        showActions={true}
      />
    );

  }

  // Huvudvy med dagliga matchningar - förbättrad enligt Figma-analys
  return (
    <div className="min-h-screen bg-gradient-to-br from-light-gradient-start to-light-gradient-end pb-20 safe-area-inset">
      <div className="max-w-md mx-auto">
        {/* Header med safe area */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-6 safe-area-top">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-semibold mb-2">Dina dagliga matchningar</h1>
            <p className="text-gray-600 text-sm">
              {dailyMatches.totalMatches} nya profiler baserat på Smart flödesmatchning
            </p>
          </div>
          
          {/* Pill-stil tabs enligt Figma-analys */}
          <div className="flex justify-center space-x-3 mb-4">
            <button className="pill-tab active">
              <Target className="w-4 h-4 mr-2" />
              Likhetsmatch
            </button>
            <button className="pill-tab">
              <Zap className="w-4 h-4 mr-2" />
              Motsatsmatch
            </button>
          </div>
          
          {/* Refresh info */}
          <div className="bg-gradient-primary/10 rounded-[15px] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Nästa uppdatering</span>
              </div>
              <span className="text-sm font-medium text-primary">
                {formatTimeUntilRefresh(dailyMatches.refreshTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Horizontal stack för 5 cards enligt Figma-analys */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Likhetsmatch</h2>
                <p className="text-sm text-gray-600">Samma personlighetsström som dig</p>
              </div>
            </div>
            
            {/* Horizontal scrollable cards med snap-to enligt Figma-analys */}
            <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {dailyMatches.similarityMatches.map((match) => (
                <div
                  key={match.id}
                  className="match-card swipe-card snap-start flex-shrink-0 w-80 cursor-pointer"
                  onClick={() => handleProfileClick(match)}
                >
                  <div className="relative h-48">
                    <ImageWithFallback
                      src={match.photos[0]}
                      alt={match.name}
                      className="w-full h-full object-cover rounded-t-2xl"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="text-lg font-bold text-white bg-black/50 px-2 py-1 rounded-full">
                        {match.compatibilityScore}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Exakt format enligt Figma-analys: "Emma L\n26 år - Täby\nDiplomat, INFP" */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {match.name}
                      </h3>
                      <p className="text-gray-600">
                        {match.age} år - {match.location}
                      </p>
                      <p className="text-gray-600">
                        {match.personalityName}, {match.personalityType}
                      </p>
                    </div>
                    
                    {/* Fyra archetype badges horisontellt enligt Figma-analys */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {match.interests.slice(0, 4).map((interest, index) => (
                        <div key={index} className="archetype-badge text-xs">
                          {interest}
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                      {match.bio}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className="text-xs bg-blue-100 text-blue-700 border-0">
                          🎯 Samma värderingar
                        </Badge>
                        {match.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {match.distance} km
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motsatsmatchningar */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Motsatsmatch</h2>
                <p className="text-sm text-gray-600">Komplementära personlighetstyper</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {dailyMatches.complementMatches.map((match) => (
                <Card
                  key={match.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-[25px] overflow-hidden"
                  onClick={() => handleProfileClick(match)}
                >
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Photo */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <ImageWithFallback
                          src={match.photos[0]}
                          alt={match.name}
                          className="w-full h-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br ${getArchetypeColor(match.category)} rounded-full border-2 border-white flex items-center justify-center`}>
                          <span className="text-xs text-white font-bold">{match.personalityType[0]}</span>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {match.name}, {match.age}
                            </h3>
                            <p className="text-sm text-gray-600">{match.personalityName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-primary">{match.compatibilityScore}%</div>
                            <div className="flex items-center text-xs text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {match.distance} km
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                          {match.bio}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge className="text-xs bg-purple-100 text-purple-700 border-0">
                              ⚡ Perfekt balans
                            </Badge>
                            {match.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="text-center pt-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-4 border border-gray-200/50">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-gray-700">MÄÄK Smart Matchning</span>
              </div>
              <p className="text-xs text-gray-600">
                Nya matchningar varje dag baserat på personlighetskompatibilitet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}