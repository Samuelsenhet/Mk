// Mock data för användarens matchningar - används för att filtrera sociala medier-inlägg
export interface UserMatch {
  id: string;
  name: string;
  age: number;
  personalityType: string;
  personalityName: string;
  category: 'Diplomater' | 'Byggare' | 'Upptäckare' | 'Strateger';
  compatibilityScore: number;
  matchType: 'similarity' | 'complement';
  avatar?: string;
  isActive: boolean;
  lastActive?: Date;
  hasSocialMedia: boolean;
  socialPlatforms: string[];
}

export const mockUserMatches: UserMatch[] = [
  {
    id: "emma_similarity",
    name: "Emma S.",
    age: 26,
    personalityType: "INFP",
    personalityName: "Mediatorn",
    category: "Diplomater",
    compatibilityScore: 94,
    matchType: 'similarity',
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400",
    isActive: true,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    hasSocialMedia: true,
    socialPlatforms: ['instagram', 'twitter']
  },
  {
    id: "lucas_similarity",
    name: "Lucas M.",
    age: 29,
    personalityType: "ENFJ",
    personalityName: "Protagonisten",
    category: "Diplomater",
    compatibilityScore: 91,
    matchType: 'similarity',
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    isActive: true,
    lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
    hasSocialMedia: true,
    socialPlatforms: ['twitter', 'youtube']
  },
  {
    id: "anna_complement",
    name: "Anna K.",
    age: 27,
    personalityType: "ISFJ",
    personalityName: "Beskyddaren",
    category: "Byggare",
    compatibilityScore: 89,
    matchType: 'complement',
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    isActive: true,
    lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
    hasSocialMedia: true,
    socialPlatforms: ['instagram']
  },
  {
    id: "oliver_complement",
    name: "Oliver L.",
    age: 25,
    personalityType: "ESFP",
    personalityName: "Underhållaren",
    category: "Upptäckare",
    compatibilityScore: 86,
    matchType: 'complement',
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    isActive: true,
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000),
    hasSocialMedia: true,
    socialPlatforms: ['tiktok', 'instagram']
  },
  {
    id: "sofia_complement",
    name: "Sofia R.",
    age: 30,
    personalityType: "INTJ",
    personalityName: "Arkitekten",
    category: "Strateger",
    compatibilityScore: 92,
    matchType: 'complement',
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    isActive: true,
    lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000),
    hasSocialMedia: true,
    socialPlatforms: ['spotify', 'twitter']
  },
  {
    id: "erik_similarity",
    name: "Erik J.",
    age: 28,
    personalityType: "INFP",
    personalityName: "Mediatorn",
    category: "Diplomater",
    compatibilityScore: 88,
    matchType: 'similarity',
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    isActive: false,
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    hasSocialMedia: true,
    socialPlatforms: ['youtube', 'spotify']
  },
  {
    id: "maria_complement",
    name: "Maria H.",
    age: 24,
    personalityType: "ESTJ",
    personalityName: "Direktören",
    category: "Byggare",
    compatibilityScore: 85,
    matchType: 'complement',
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    isActive: true,
    lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    hasSocialMedia: false,
    socialPlatforms: []
  }
];

// Filtrera matchningar baserat på olika kriterier
export const getActiveMatches = (matches: UserMatch[]): UserMatch[] => {
  return matches.filter(match => match.isActive);
};

export const getMatchesWithSocialMedia = (matches: UserMatch[]): UserMatch[] => {
  return matches.filter(match => match.hasSocialMedia && match.socialPlatforms.length > 0);
};

export const getMatchesByType = (matches: UserMatch[], matchType: 'similarity' | 'complement'): UserMatch[] => {
  return matches.filter(match => match.matchType === matchType);
};

export const getMatchesByPersonalityCategory = (matches: UserMatch[], category: string): UserMatch[] => {
  return matches.filter(match => match.category === category);
};

export const getMatchesByPlatform = (matches: UserMatch[], platform: string): UserMatch[] => {
  return matches.filter(match => match.socialPlatforms.includes(platform));
};

// Sammanställ statistik för sociala medier-trender
export const getSocialMediaStats = (matches: UserMatch[]) => {
  const activeMatches = getActiveMatches(matches);
  const socialMatches = getMatchesWithSocialMedia(matches);
  
  const platformStats = ['instagram', 'twitter', 'youtube', 'spotify', 'tiktok'].map(platform => ({
    platform,
    count: getMatchesByPlatform(matches, platform).length,
    percentage: Math.round((getMatchesByPlatform(matches, platform).length / matches.length) * 100)
  }));

  const personalityStats = ['Diplomater', 'Byggare', 'Upptäckare', 'Strateger'].map(category => ({
    category,
    count: getMatchesByPersonalityCategory(socialMatches, category).length,
    avgCompatibility: Math.round(
      getMatchesByPersonalityCategory(socialMatches, category)
        .reduce((sum, match) => sum + match.compatibilityScore, 0) / 
      Math.max(getMatchesByPersonalityCategory(socialMatches, category).length, 1)
    )
  }));

  return {
    totalMatches: matches.length,
    activeMatches: activeMatches.length,
    socialMatches: socialMatches.length,
    platformStats,
    personalityStats,
    avgCompatibility: Math.round(
      socialMatches.reduce((sum, match) => sum + match.compatibilityScore, 0) / Math.max(socialMatches.length, 1)
    )
  };
};

// Exportera för användning i komponenter
export { mockUserMatches as defaultUserMatches };