import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, Phone, MoreHorizontal, Heart, MessageCircle, 
  Star, MapPin, Briefcase, GraduationCap, Music, Camera,
  Coffee, BookOpen, Mountain, Palette, Code, Users,
  TrendingUp, BarChart3, Award, Target
} from "lucide-react";
import { useAnalytics } from "../utils/analytics";

interface ProfileData {
  id: string;
  name: string;
  age: number;
  title?: string;
  location?: string;
  avatar?: string;
  photos?: string[];
  bio?: string;
  personalityType: string;
  personalityName: string;
  category: 'Diplomater' | 'Byggare' | 'Upptäckare' | 'Strateger';
  compatibilityScore?: number;
  matchType?: 'similarity' | 'complement';
  skills?: string[];
  interests?: string[];
  statistics?: {
    experience: number;
    skills: number;
    testing: number;
    interview: number;
  };
  testStats?: {
    points: number;
    percentile: number;
    chartData: number[];
    labels: string[];
  };
  verified?: boolean;
  premium?: boolean;
}

interface ProfileViewProps {
  profile: ProfileData;
  onBack: () => void;
  onLike?: () => void;
  onMessage?: () => void;
  onCall?: () => void;
  showActions?: boolean;
}

export function ProfileView({ 
  profile, 
  onBack, 
  onLike, 
  onMessage, 
  onCall,
  showActions = true 
}: ProfileViewProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { track } = useAnalytics();

  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : profile.avatar 
      ? [profile.avatar]
      : ["https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400"];

  const getPersonalityColor = (category: string) => {
    switch (category) {
      case 'Diplomater': return 'bg-blue-100 text-blue-700';
      case 'Byggare': return 'bg-green-100 text-green-700';
      case 'Upptäckare': return 'bg-orange-100 text-orange-700';
      case 'Strateger': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMatchTypeColor = (matchType?: string) => {
    switch (matchType) {
      case 'similarity': return 'bg-blue-100 text-blue-700';
      case 'complement': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSkillIcon = (skill: string) => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('figma') || skillLower.includes('design')) return <Palette className="w-4 h-4" />;
    if (skillLower.includes('code') || skillLower.includes('development')) return <Code className="w-4 h-4" />;
    if (skillLower.includes('photo')) return <Camera className="w-4 h-4" />;
    if (skillLower.includes('music')) return <Music className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  const getSkillColor = (skill: string) => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('figma')) return 'bg-purple-100 text-purple-700';
    if (skillLower.includes('sketch')) return 'bg-yellow-100 text-yellow-700';
    if (skillLower.includes('photoshop') || skillLower.includes('adobe')) return 'bg-blue-100 text-blue-700';
    if (skillLower.includes('code') || skillLower.includes('development')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onLike) onLike();
    track('profile_like', {
      target_user_id: profile.id,
      personality_type: profile.personalityType,
      match_type: profile.matchType,
      compatibility_score: profile.compatibilityScore
    });
  };

  const handleMessage = () => {
    if (onMessage) onMessage();
    track('profile_message', {
      target_user_id: profile.id,
      personality_type: profile.personalityType,
      match_type: profile.matchType
    });
  };

  const handleCall = () => {
    if (onCall) onCall();
    track('profile_call', {
      target_user_id: profile.id,
      personality_type: profile.personalityType
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            {showActions && onCall && (
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
                onClick={handleCall}
              >
                <Phone className="w-5 h-5" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Photo */}
        <div className="relative h-96 bg-gray-200 overflow-hidden">
          <ImageWithFallback
            src={photos[currentPhotoIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          
          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPhotoIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Name and Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-3xl font-semibold text-white mb-0" style={{ marginTop: '-120px', position: 'relative', zIndex: 5 }}>
              {profile.name}
            </h1>
            {profile.verified && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center" style={{ marginTop: '-120px', position: 'relative', zIndex: 5 }}>
                <Star className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {profile.title && (
            <p className="text-lg text-white/90 mb-4" style={{ marginTop: '-100px', position: 'relative', zIndex: 5 }}>
              {profile.title}
            </p>
          )}
        </div>

        {/* Skills/Tools - Inspired by image */}
        {profile.skills && profile.skills.length > 0 && (
          <Card className="rounded-[25px] border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Verktyg & Kompetenser</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className={`px-3 py-2 rounded-[15px] ${getSkillColor(skill)} flex items-center space-x-2`}
                  >
                    {getSkillIcon(skill)}
                    <span>{skill}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bio Description */}
        {profile.bio && (
          <Card className="rounded-[25px] border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {profile.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Personality & Match Info */}
        <Card className="rounded-[25px] border-0 bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Personlighet & Kompatibilitet</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Personlighetstyp</span>
                <Badge className={`${getPersonalityColor(profile.category)}`}>
                  {profile.personalityType} - {profile.personalityName}
                </Badge>
              </div>
              
              {profile.compatibilityScore && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kompatibilitet</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${profile.compatibilityScore}%` }}
                      />
                    </div>
                    <span className="text-primary font-medium">{profile.compatibilityScore}%</span>
                  </div>
                </div>
              )}
              
              {profile.matchType && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Matchtyp</span>
                  <Badge className={`${getMatchTypeColor(profile.matchType)}`}>
                    {profile.matchType === 'similarity' ? '🎯 Likhetsmatch' : '⚡ Motsatsmatch'}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics - Inspired by image */}
        {profile.statistics && (
          <Card className="rounded-[25px] border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Kompetensöversikt</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-yellow-100 text-yellow-800 rounded-[15px] px-4 py-2 mb-2">
                    <span className="font-medium">{profile.statistics.experience}</span>
                  </div>
                  <span className="text-sm text-gray-600">Experience</span>
                </div>
                
                <div className="text-center">
                  <div className="bg-gray-800 text-white rounded-[15px] px-4 py-2 mb-2">
                    <span className="font-medium">{profile.statistics.skills}</span>
                  </div>
                  <span className="text-sm text-gray-600">Skills</span>
                </div>
                
                <div className="text-center">
                  <div className="bg-gray-400 text-white rounded-[15px] px-4 py-2 mb-2" style={{ background: 'repeating-linear-gradient(45deg, #9CA3AF, #9CA3AF 10px, #D1D5DB 10px, #D1D5DB 20px)' }}>
                    <span className="font-medium">{profile.statistics.testing}</span>
                  </div>
                  <span className="text-sm text-gray-600">Testing</span>
                </div>
                
                <div className="text-center">
                  <div className="bg-blue-200 text-blue-800 rounded-[15px] px-4 py-2 mb-2">
                    <span className="font-medium">{profile.statistics.interview}</span>
                  </div>
                  <span className="text-sm text-gray-600">Interview</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Statistics - Inspired by image chart */}
        {profile.testStats && (
          <Card className="rounded-[25px] border-0 bg-gray-900 text-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Test Statistik</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Candidate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-sm text-gray-300">Other</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <Badge className="bg-white text-gray-900 px-3 py-1 rounded-[15px]">
                  {profile.testStats.points} points
                </Badge>
              </div>
              
              {/* Simple chart representation */}
              <div className="space-y-2">
                {profile.testStats.labels.map((label, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{label}</span>
                    <div className="flex-1 mx-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${(profile.testStats!.chartData[index] || 0)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-300">{profile.testStats.chartData[index]}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <Card className="rounded-[25px] border-0 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Intressen</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-2 rounded-[15px] border-gray-200"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        {profile.location && (
          <Card className="rounded-[25px] border-0 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{profile.location}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-[20px] border-gray-300"
              onClick={handleMessage}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Meddelande
            </Button>
            
            <Button
              size="lg"
              className={`flex-1 rounded-[20px] ${
                isLiked 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Gillad' : 'Gilla'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}