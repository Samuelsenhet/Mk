import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  Sparkles, 
  Waves, 
  Heart, 
  MessageCircle, 
  Users, 
  Target,
  Zap,
  Brain,
  CheckCircle,
  Star,
  Mic
} from 'lucide-react';

interface FeatureShowcaseProps {
  onBack: () => void;
}

export function FeatureShowcase({ onBack }: FeatureShowcaseProps) {
  const [activeFeature, setActiveFeature] = useState<string>('overview');

  const features = [
    {
      id: 'design-system',
      title: 'Förbättrad Design System',
      icon: Sparkles,
      status: 'Implementerat',
      description: 'Konsekventa gradients och våg-animationer',
      details: [
        'Global gradient från #A8E6CF till #FFD3E0 för ljusa skärmar',
        'Mörka gradients från #2C3E50 till #8E44AD',
        'Nya CSS-animationer för vågor och floating effekter',
        'Förbättrade hover-effekter och transitioner'
      ]
    },
    {
      id: 'personality-test',
      title: 'Förbättrat Personlighetstest',
      icon: Brain,
      status: 'Implementerat',
      description: '30 frågor med Likert-skala och MÄÄK archetypes',
      details: [
        'Engångs-quiz med 30 Likert-skala frågor',
        'Genererar blandad personlighetsprofil på 2 minuter',
        '16 archetypes fördelade på 4 profiler (Diplomater, Byggare, Upptäckare, Strateger)',
        'Interaktiv slider-interface med visuell feedback'
      ]
    },
    {
      id: 'matching-system',
      title: 'Våg-animerat Matchningssystem',
      icon: Waves,
      status: 'Implementerat',
      description: 'Synkflöde och Vågflöde med realtidsanimationer',
      details: [
        'Dual-system: Synkflöde (harmoni) och Vågflöde (kontraster)',
        'Realtids flödessynk-beräkning med våg-visualisering',
        'Dynamisk sortering baserat på kompatibilitet och energi',
        'Animerade vågor som reagerar på användarinteraktion'
      ]
    },
    {
      id: 'ai-icebreaker',
      title: 'AI-Isbrytare med Archetype Intelligence',
      icon: MessageCircle,
      status: 'Implementerat',
      description: 'Personliga förslag baserat på archetype-matching',
      details: [
        'Archetype-specifika isbrytare för alla 16 typer',
        'Kontextmedvetna förslag baserat på intressen',
        'Tri-kategoriserad approach: Frågor, Kommentarer, Komplimanger',
        'Auto-generering av nya förslag med personlighetsmatchning'
      ]
    },
    {
      id: 'match-tabs',
      title: 'Dynamiska Match-flikar',
      icon: Target,
      status: 'Implementerat',
      description: 'Matches, Pending, Liked med smart sortering',
      details: [
        'Bottom-tabs med Matches, Pending, Liked kategorier',
        'Dynamisk sortering: Nyaste, Kompatibilitet, Avstånd, Aktivitet',
        'Realtidsuppdateringar och unread-indikatorer',
        'Visuell matchscore och archetype-integration'
      ]
    },
    {
      id: 'community-feed',
      title: 'Community Feed & Dagliga Frågor',
      icon: Users,
      status: 'Implementerat',
      description: 'Scrollbar feed med likes, kommentarer och trender',
      details: [
        'Dagliga frågor med Likert-skala röstning',
        'Scrollbar community feed med user-posts',
        'Like/kommentar-system med analytics',
        'Trending topics och personlighetsstatistik'
      ]
    },
    {
      id: 'voice-chat',
      title: 'Röstintegration i Chatt',
      icon: Mic,
      status: 'Implementerat',
      description: 'Voice messages med text-chatt och AI-suggestions',
      details: [
        'Integrerad röstinspelning med VoiceRecorder-komponent',
        'Voice message-spelare med duration-visualisering',
        'AI-powered chat-suggestions baserat på kontext',
        'Realtids typing-indikatorer och meddelandestatus'
      ]
    },
    {
      id: 'archetype-explorer',
      title: 'Klickbar Archetype Explorer',
      icon: Heart,
      status: 'Implementerat',
      description: 'Interaktiv utforskning av alla 16 archetyper',
      details: [
        'Klickbara archetype-kort med detaljskärmar',
        'Kompatibilitets-tips och relationsråd',
        'Djupdyk-flikar: Översikt, Dejting, Kompatibilitet, Tips',
        'Personaliserad information baserat på användarens typ'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Implementerat': return 'bg-green-100 text-green-800';
      case 'Pågående': return 'bg-yellow-100 text-yellow-800';
      case 'Planerat': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeFeature !== 'overview') {
    const feature = features.find(f => f.id === activeFeature);
    if (!feature) return null;

    const Icon = feature.icon;

    return (
      <div className="max-w-md mx-auto p-6 pb-20">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setActiveFeature('overview')} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl">Feature Details</h1>
        </div>

        <Card className="mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-t-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{feature.title}</h2>
                <Badge className={getStatusColor(feature.status)}>
                  {feature.status}
                </Badge>
              </div>
            </div>
            <p className="text-gray-700">{feature.description}</p>
          </div>
          <CardContent className="p-6">
            <h3 className="font-medium mb-3">Implementerade funktioner:</h3>
            <div className="space-y-2">
              {feature.details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{detail}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h4 className="font-medium mb-1">Fully Functional</h4>
              <p className="text-sm text-gray-600">
                Denna funktion är helt implementerad och testad i MÄÄK Mood-appen.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl">MÄÄK Förbättringar</h1>
          <p className="text-sm text-gray-600">Alla implementerade funktioner</p>
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{features.length}</div>
              <div className="text-xs text-gray-600">Funktioner</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">100%</div>
              <div className="text-xs text-gray-600">Implementerat</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">16</div>
              <div className="text-xs text-gray-600">Archetypes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="space-y-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <Card 
              key={feature.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{feature.title}</h4>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Summary */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="text-center">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium mb-1">Alla förbättringar implementerade!</h4>
            <p className="text-sm text-gray-600">
              MÄÄK Mood-appen innehåller nu alla begärda funktioner med moderna 
              animationer, AI-integration och personlighetsbaserad matchning.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}