import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Trophy, 
  Star, 
  Heart, 
  MessageCircle, 
  Users, 
  Calendar,
  Zap,
  Crown,
  Gift,
  ArrowLeft,
  CheckCircle,
  Lock,
  Sparkles
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "social" | "dating" | "personality" | "premium" | "special";
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  reward?: string;
}

interface AchievementSystemProps {
  onBack: () => void;
  userAchievements: Achievement[];
  totalPoints: number;
}

const achievements: Achievement[] = [
  {
    id: "first_match",
    title: "Första intrycket",
    description: "Få din första matchning",
    icon: <Heart className="w-6 h-6" />,
    category: "dating",
    points: 100,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: "common",
    reward: "Premium filter i 24h"
  },
  {
    id: "conversation_starter",
    title: "Samtalskonst",
    description: "Starta 10 konversationer",
    icon: <MessageCircle className="w-6 h-6" />,
    category: "social",
    points: 250,
    unlocked: true,
    progress: 7,
    maxProgress: 10,
    rarity: "common"
  },
  {
    id: "mood_master",
    title: "Humör-mästare",
    description: "Gör humör check-in 7 dagar i rad",
    icon: <Calendar className="w-6 h-6" />,
    category: "personality",
    points: 500,
    unlocked: false,
    progress: 4,
    maxProgress: 7,
    rarity: "rare",
    reward: "Exklusiv mood badge"
  },
  {
    id: "social_butterfly",
    title: "Social fjäril",
    description: "Ha 5 aktiva konversationer samtidigt",
    icon: <Users className="w-6 h-6" />,
    category: "social",
    points: 300,
    unlocked: false,
    progress: 2,
    maxProgress: 5,
    rarity: "rare"
  },
  {
    id: "premium_explorer",
    title: "Premium Explorer",
    description: "Testa alla premium-funktioner",
    icon: <Crown className="w-6 h-6" />,
    category: "premium",
    points: 750,
    unlocked: false,
    progress: 3,
    maxProgress: 8,
    rarity: "epic",
    reward: "1 månad gratis Premium"
  },
  {
    id: "personality_guru",
    title: "Personlighets-guru",
    description: "Slutför avancerad personlighetsanalys",
    icon: <Star className="w-6 h-6" />,
    category: "personality",
    points: 400,
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    rarity: "rare",
    reward: "Detaljerad kompatibilitetsrapport"
  },
  {
    id: "date_master",
    title: "Dejt-mästare",
    description: "Boka 3 riktiga dejter via appen",
    icon: <Calendar className="w-6 h-6" />,
    category: "dating",
    points: 1000,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    rarity: "epic",
    reward: "VIP Platinum upgrade"
  },
  {
    id: "community_leader",
    title: "Community Leader",
    description: "Få 100 likes på community-inlägg",
    icon: <Trophy className="w-6 h-6" />,
    category: "social",
    points: 600,
    unlocked: false,
    progress: 23,
    maxProgress: 100,
    rarity: "epic"
  },
  {
    id: "love_legend",
    title: "Kärleks-legend",
    description: "Hitta din livspartner via Määk Mood",
    icon: <Sparkles className="w-6 h-6" />,
    category: "special",
    points: 5000,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "legendary",
    reward: "Livstids Premium + Special Badge"
  }
];

export function AchievementSystem({ onBack, userAchievements = achievements, totalPoints = 1250 }: AchievementSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = [
    { id: "all", label: "Alla", icon: <Trophy className="w-4 h-4" /> },
    { id: "dating", label: "Dejting", icon: <Heart className="w-4 h-4" /> },
    { id: "social", label: "Socialt", icon: <Users className="w-4 h-4" /> },
    { id: "personality", label: "Personlighet", icon: <Star className="w-4 h-4" /> },
    { id: "premium", label: "Premium", icon: <Crown className="w-4 h-4" /> },
    { id: "special", label: "Special", icon: <Sparkles className="w-4 h-4" /> }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "from-gray-400 to-gray-600";
      case "rare": return "from-blue-400 to-blue-600";
      case "epic": return "from-purple-400 to-purple-600";
      case "legendary": return "from-yellow-400 to-orange-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAchievements = selectedCategory === "all" 
    ? userAchievements 
    : userAchievements.filter(a => a.category === selectedCategory);

  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  const completionPercentage = (unlockedCount / userAchievements.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>
            <h1 className="text-2xl text-primary mb-2">Prestationer</h1>
            <p className="text-gray-600 text-sm">
              {unlockedCount} av {userAchievements.length} upplåsta
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-primary mb-1">
                {totalPoints.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Totala poäng</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Framsteg</span>
                <span>{Math.round(completionPercentage)}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {userAchievements.filter(a => a.rarity === "legendary").filter(a => a.unlocked).length}
                </div>
                <div className="text-xs text-gray-600">Legendary</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {userAchievements.filter(a => a.rarity === "epic").filter(a => a.unlocked).length}
                </div>
                <div className="text-xs text-gray-600">Epic</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {userAchievements.filter(a => a.rarity === "rare").filter(a => a.unlocked).length}
                </div>
                <div className="text-xs text-gray-600">Rare</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-1"
              >
                {category.icon}
                <span>{category.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-4">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className={`overflow-hidden ${achievement.unlocked ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-lg flex items-center justify-center text-white ${!achievement.unlocked ? "opacity-50" : ""}`}>
                    {achievement.unlocked ? achievement.icon : <Lock className="w-6 h-6" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium ${!achievement.unlocked ? "text-gray-500" : ""}`}>
                        {achievement.title}
                      </h3>
                      {achievement.unlocked && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 ${!achievement.unlocked ? "text-gray-400" : "text-gray-600"}`}>
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs ${getRarityBadgeColor(achievement.rarity)}`}>
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Zap className="w-3 h-3" />
                        <span>{achievement.points} poäng</span>
                      </div>
                    </div>

                    {/* Progress */}
                    {!achievement.unlocked && achievement.maxProgress > 1 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Framsteg</span>
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1"
                        />
                      </div>
                    )}

                    {/* Reward */}
                    {achievement.reward && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-primary">
                        <Gift className="w-3 h-3" />
                        <span>{achievement.reward}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mt-6">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium text-primary mb-1">Fortsätt utforska!</h3>
            <p className="text-sm text-gray-600">
              Ju mer du använder Määk Mood, desto fler belöningar får du. 
              Nästa prestation är bara några steg bort!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}