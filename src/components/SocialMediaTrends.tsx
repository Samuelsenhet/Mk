import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Heart, MessageCircle, Share2, TrendingUp, ExternalLink, 
  Instagram, Twitter, Youtube, Music, MapPin, Clock, 
  Users, Sparkles, Camera, Video, BarChart3, Filter,
  Eye, ArrowUp, Flame, Star, Globe, Lock
} from "lucide-react";
import { sessionlessApiClient } from "../utils/api-sessionless";
import { useAnalytics } from "../utils/analytics";

interface SocialMediaPost {
  id: string;
  userId: string;
  author: {
    name: string;
    avatar?: string;
    personalityType: string;
    isVerified: boolean;
    matchType?: 'similarity' | 'complement';
    compatibilityScore?: number;
  };
  platform: 'instagram' | 'twitter' | 'youtube' | 'spotify' | 'tiktok';
  content: {
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    musicTrack?: string;
    location?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  hashtags: string[];
  timestamp: Date;
  isLiked: boolean;
  isTrending: boolean;
  privacyLevel: 'public' | 'matches_only' | 'close_matches';
  relatedTrend?: string;
}

interface TrendingHashtag {
  id: string;
  hashtag: string;
  description: string;
  growth: string;
  postsCount: number;
  matchedUsersCount: number;
  status: 'Viral' | 'Trending' | 'Populärt' | 'Växande';
  relatedPersonalities: string[];
  platform: 'instagram' | 'twitter' | 'youtube' | 'spotify' | 'tiktok' | 'all';
}

interface SocialMediaTrendsProps {
  userPersonality?: any;
  userMatches?: any[];
  onStartChat?: (profile: any) => void;
}

export function SocialMediaTrends({ userPersonality, userMatches = [], onStartChat }: SocialMediaTrendsProps) {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [privacyFilter, setPrivacyFilter] = useState<'all' | 'matches_only'>('matches_only');
  
  const { track } = useAnalytics();

  // Mock data för sociala medier-inlägg från matchade personer
  const mockSocialPosts: SocialMediaPost[] = [
    {
      id: "post_emma_ig_1",
      userId: "emma_similarity",
      author: {
        name: "Emma S.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400",
        personalityType: "INFP",
        isVerified: true,
        matchType: 'similarity',
        compatibilityScore: 94
      },
      platform: 'instagram',
      content: {
        text: "Ny konstutställning på Moderna Museet! Älskar hur konst kan väcka känslor man inte visste fanns 🎨✨ #KonstIStockholm #ModernaMuseet",
        imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400",
        location: "Moderna Museet, Stockholm"
      },
      engagement: {
        likes: 47,
        comments: 12,
        shares: 8,
        views: 234
      },
      hashtags: ["#KonstIStockholm", "#ModernaMuseet", "#Kreativitet"],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isLiked: false,
      isTrending: true,
      privacyLevel: 'matches_only',
      relatedTrend: "#KonstIStockholm"
    },
    {
      id: "post_lucas_linkedin_1",
      userId: "lucas_similarity", 
      author: {
        name: "Lucas M.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
        personalityType: "ENFJ",
        isVerified: true,
        matchType: 'similarity',
        compatibilityScore: 91
      },
      platform: 'twitter',
      content: {
        text: "Fascinerande coaching-session idag! Att se människor växa och hitta sin inre styrka är varför jag brinner för det jag gör 🌱 #Coaching #PersonligUtveckling #Leadership"
      },
      engagement: {
        likes: 89,
        comments: 23,
        shares: 15,
        views: 567
      },
      hashtags: ["#Coaching", "#PersonligUtveckling", "#Leadership"],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isLiked: true,
      isTrending: true,
      privacyLevel: 'matches_only',
      relatedTrend: "#PersonligUtveckling"
    },
    {
      id: "post_anna_ig_food",
      userId: "anna_complement",
      author: {
        name: "Anna K.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        personalityType: "ISFJ",
        isVerified: false,
        matchType: 'complement',
        compatibilityScore: 89
      },
      platform: 'instagram',
      content: {
        text: "Hemgjord pasta från scratch! 🍝 Älskar att laga mat med kärlek. Recept finns i min story! #Matlagning #Hemgjort #Kärlek",
        imageUrl: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400",
        location: "Hemma i köket"
      },
      engagement: {
        likes: 34,
        comments: 8,
        shares: 3,
        views: 145
      },
      hashtags: ["#Matlagning", "#Hemgjort", "#Kärlek", "#Pasta"],
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isLiked: false,
      isTrending: false,
      privacyLevel: 'matches_only'
    },
    {
      id: "post_oliver_tiktok",
      userId: "oliver_complement",
      author: {
        name: "Oliver L.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        personalityType: "ESFP", 
        isVerified: true,
        matchType: 'complement',
        compatibilityScore: 86
      },
      platform: 'tiktok',
      content: {
        text: "Spontan fotoshoot i Gamla Stan! 📸 Stockholms ljus är magiskt just nu ✨ #StockholmFoto #GamlaStan #SpontanFoto",
        videoUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73606?w=400",
        location: "Gamla Stan, Stockholm"
      },
      engagement: {
        likes: 156,
        comments: 34,
        shares: 23,
        views: 1234
      },
      hashtags: ["#StockholmFoto", "#GamlaStan", "#SpontanFoto", "#Fotografering"],
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isLiked: true,
      isTrending: true,
      privacyLevel: 'public'
    },
    {
      id: "post_sofia_spotify",
      userId: "sofia_complement",
      author: {
        name: "Sofia R.",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
        personalityType: "INTJ",
        isVerified: true,
        matchType: 'complement',
        compatibilityScore: 92
      },
      platform: 'spotify',
      content: {
        text: "Ny playlist för fokuserat arbete! 🎧 Perfekt mix av ambient och minimal techno för produktiva dagar 🚀 #Fokusmusik #Produktivitet #Tech",
        musicTrack: "Focus Flow - Deep Work Playlist"
      },
      engagement: {
        likes: 67,
        comments: 15,
        shares: 31,
        views: 298
      },
      hashtags: ["#Fokusmusik", "#Produktivitet", "#Tech", "#Ambient"],
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      isLiked: false,
      isTrending: true,
      privacyLevel: 'matches_only',
      relatedTrend: "#Produktivitet"
    }
  ];

  // Mock trending hashtags baserade på matchade användares aktivitet
  const mockTrendingHashtags: TrendingHashtag[] = [
    {
      id: "trend_1",
      hashtag: "#KonstIStockholm",
      description: "Kreativa upptäckter i huvudstaden",
      growth: "+78%",
      postsCount: 234,
      matchedUsersCount: 12,
      status: "Viral",
      relatedPersonalities: ["INFP", "ENFP", "ISFP"],
      platform: "instagram"
    },
    {
      id: "trend_2", 
      hashtag: "#PersonligUtveckling",
      description: "Självförbättring och coaching",
      growth: "+45%",
      postsCount: 189,
      matchedUsersCount: 8,
      status: "Trending",
      relatedPersonalities: ["ENFJ", "INFJ", "ENFP"],
      platform: "twitter"
    },
    {
      id: "trend_3",
      hashtag: "#StockholmFoto", 
      description: "Stadens bästa fotospots",
      growth: "+62%",
      postsCount: 156,
      matchedUsersCount: 15,
      status: "Populärt",
      relatedPersonalities: ["ESFP", "ENFP", "ISFP"],
      platform: "tiktok"
    },
    {
      id: "trend_4",
      hashtag: "#Produktivitet",
      description: "Effektivitet och fokus",
      growth: "+34%", 
      postsCount: 98,
      matchedUsersCount: 6,
      status: "Växande",
      relatedPersonalities: ["INTJ", "ENTJ", "ISTJ"],
      platform: "spotify"
    },
    {
      id: "trend_5",
      hashtag: "#Matlagning",
      description: "Hemlagade godsaker",
      growth: "+23%",
      postsCount: 145,
      matchedUsersCount: 9,
      status: "Populärt", 
      relatedPersonalities: ["ISFJ", "ESFJ", "ISFP"],
      platform: "instagram"
    }
  ];

  useEffect(() => {
    const loadSocialMediaTrends = async () => {
      try {
        setLoading(true);
        console.log('[SOCIAL TRENDS] Laddar sociala medier-trender från matchade användare...');
        
        // Simulera API-anrop
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Försök hämta från API först
        try {
          const result = await sessionlessApiClient.getSocialMediaTrends(userPersonality?.type);
          if (result.success && result.trends) {
            setPosts(result.trends.posts);
            setTrendingHashtags(result.trends.hashtags);
            console.log('[SOCIAL TRENDS SUCCESS] API-trender laddade framgångsrikt');
          } else {
            throw new Error('No social trends from API');
          }
        } catch (apiError) {
          console.log('[SOCIAL TRENDS FALLBACK] Använder demo-data för sociala medier-trender');
          
          // Filtrera posts baserat på matchade användare
          const filteredPosts = mockSocialPosts.filter(post => {
            const isMatched = userMatches?.some(match => match.id === post.userId) || true; // Default true för demo
            const privacyAllowed = privacyFilter === 'all' || post.privacyLevel !== 'public';
            return isMatched && privacyAllowed;
          });
          
          setPosts(filteredPosts);
          setTrendingHashtags(mockTrendingHashtags);
        }
        
        // Spåra laddning av sociala trender
        track('social_trends_loaded', {
          user_personality: userPersonality?.type || 'unknown',
          posts_count: mockSocialPosts.length,
          hashtags_count: mockTrendingHashtags.length,
          privacy_filter: privacyFilter,
          platform_filter: selectedPlatform
        });
        
      } catch (error) {
        console.error('[SOCIAL TRENDS ERROR] Fel vid laddning av sociala trender:', error);
        setPosts(mockSocialPosts);
        setTrendingHashtags(mockTrendingHashtags);
      } finally {
        setLoading(false);
      }
    };

    loadSocialMediaTrends();
  }, [userPersonality, userMatches, privacyFilter, selectedPlatform, track]);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'spotify': return <Music className="w-4 h-4" />;
      case 'tiktok': return <Video className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'text-pink-600 bg-pink-50';
      case 'twitter': return 'text-blue-500 bg-blue-50';
      case 'youtube': return 'text-red-600 bg-red-50';
      case 'spotify': return 'text-green-600 bg-green-50';
      case 'tiktok': return 'text-gray-800 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getMatchTypeColor = (matchType?: string) => {
    switch (matchType) {
      case 'similarity': return 'text-blue-700 bg-blue-100';
      case 'complement': return 'text-purple-700 bg-purple-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "nu";
    if (diffHours < 24) return `${diffHours}h sedan`;
    return `${Math.floor(diffHours / 24)}d sedan`;
  };

  const toggleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const action = post.isLiked ? 'unlike' : 'like';
      
      track('social_post_interaction', {
        type: 'like',
        action,
        post_id: postId,
        platform: post.platform,
        author_personality: post.author.personalityType,
        match_type: post.author.matchType || 'unknown'
      });
    }
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            engagement: {
              ...post.engagement,
              likes: post.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1
            }
          }
        : post
    ));
  };

  const handleStartChat = (post: SocialMediaPost) => {
    if (onStartChat) {
      const profile = {
        id: post.userId,
        name: post.author.name,
        personalityType: post.author.personalityType,
        avatar: post.author.avatar,
        matchType: post.author.matchType,
        compatibilityScore: post.author.compatibilityScore
      };
      
      track('social_chat_initiated', {
        from_post: post.id,
        platform: post.platform,
        match_type: post.author.matchType || 'unknown',
        author_personality: post.author.personalityType
      });
      
      onStartChat(profile);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) {
      return false;
    }
    if (privacyFilter === 'matches_only' && post.privacyLevel === 'public') {
      return false;
    }
    return true;
  });

  const filteredHashtags = trendingHashtags.filter(hashtag => {
    if (selectedPlatform !== 'all' && hashtag.platform !== selectedPlatform && hashtag.platform !== 'all') {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-[15px] mb-4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-[25px] mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card className="rounded-[25px] border-0 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Sociala Trender</h3>
            </div>
            <Badge className="bg-primary/10 text-primary">
              {filteredPosts.length} inlägg från matchningar
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedPlatform === 'all' ? 'default' : 'outline'}
              size="sm"
              className="rounded-[15px]"
              onClick={() => setSelectedPlatform('all')}
            >
              <Globe className="w-4 h-4 mr-1" />
              Alla
            </Button>
            {['instagram', 'twitter', 'youtube', 'spotify', 'tiktok'].map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? 'default' : 'outline'}
                size="sm"
                className={`rounded-[15px] ${selectedPlatform === platform ? '' : getPlatformColor(platform)}`}
                onClick={() => setSelectedPlatform(platform)}
              >
                {getPlatformIcon(platform)}
                <span className="ml-1 capitalize">{platform}</span>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={privacyFilter === 'matches_only' ? 'default' : 'outline'}
              size="sm" 
              className="rounded-[15px]"
              onClick={() => setPrivacyFilter('matches_only')}
            >
              <Lock className="w-4 h-4 mr-1" />
              Endast matchningar
            </Button>
            <Button
              variant={privacyFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="rounded-[15px]"
              onClick={() => setPrivacyFilter('all')}
            >
              <Globe className="w-4 h-4 mr-1" />
              Alla inlägg
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trending Hashtags */}
      <Card className="rounded-[25px] border-0 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-medium">Trending bland dina matchningar</h3>
          </div>
          
          <div className="space-y-3">
            {filteredHashtags.slice(0, 5).map((hashtag) => (
              <div key={hashtag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-[15px]">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getPlatformColor(hashtag.platform)}`}>
                    {getPlatformIcon(hashtag.platform)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{hashtag.hashtag}</p>
                    <p className="text-xs text-gray-600">{hashtag.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    className={`text-xs mb-1 ${
                      hashtag.status === 'Viral' ? 'bg-red-100 text-red-700' :
                      hashtag.status === 'Trending' ? 'bg-green-100 text-green-700' :
                      hashtag.status === 'Populärt' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {hashtag.status} {hashtag.growth}
                  </Badge>
                  <p className="text-xs text-gray-500">{hashtag.matchedUsersCount} matchningar</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Media Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="rounded-[25px] border-0 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {post.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{post.author.name}</span>
                        {post.author.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Star className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs border-gray-200">
                          {post.author.personalityType}
                        </Badge>
                        {post.author.matchType && (
                          <Badge className={`text-xs ${getMatchTypeColor(post.author.matchType)}`}>
                            {post.author.matchType === 'similarity' ? '🎯 Likhet' : '⚡ Motsats'} 
                            {post.author.compatibilityScore && ` ${post.author.compatibilityScore}%`}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-full ${getPlatformColor(post.platform)}`}>
                      {getPlatformIcon(post.platform)}
                    </div>
                    <span className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                {post.content.text && (
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {post.content.text}
                  </p>
                )}
                
                {post.content.imageUrl && (
                  <div className="mb-3 rounded-[15px] overflow-hidden">
                    <ImageWithFallback
                      src={post.content.imageUrl}
                      alt="Post content"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                {post.content.videoUrl && (
                  <div className="mb-3 rounded-[15px] overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                    <Video className="w-12 h-12 text-gray-400" />
                    <span className="ml-2 text-gray-600">Video innehåll</span>
                  </div>
                )}
                
                {post.content.musicTrack && (
                  <div className="mb-3 p-3 bg-green-50 rounded-[15px] flex items-center space-x-3">
                    <Music className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-sm text-green-800">{post.content.musicTrack}</p>
                      <p className="text-xs text-green-600">Spotify</p>
                    </div>
                  </div>
                )}
                
                {post.content.location && (
                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-600">{post.content.location}</span>
                  </div>
                )}

                {/* Hashtags */}
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.hashtags.map((hashtag, index) => (
                      <span key={index} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Footer */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 ${post.isLiked ? "text-red-500" : "text-gray-500"}`}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                      <span className="text-xs">{post.engagement.likes}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span className="text-xs">{post.engagement.comments}</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                      <Share2 className="w-4 h-4 mr-1" />
                      <span className="text-xs">{post.engagement.shares}</span>
                    </Button>
                    
                    {post.engagement.views && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{post.engagement.views}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-[12px] text-xs"
                    onClick={() => handleStartChat(post)}
                  >
                    Chatta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="rounded-[25px] border-2 border-dashed border-gray-200">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Inga sociala inlägg ännu</h3>
            <p className="text-gray-600 text-sm mb-4">
              Sociala inlägg från dina matchningar visas här när de delar innehåll
            </p>
            <Button variant="outline" className="rounded-[15px]" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Justera filter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}