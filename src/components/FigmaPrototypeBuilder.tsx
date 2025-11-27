import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, Download, Eye, Smartphone, Monitor, Figma, Palette, Layout, Users, MessageCircle, Heart, Settings } from 'lucide-react';

interface FigmaPrototypeBuilderProps {
  onBack: () => void;
}

export function FigmaPrototypeBuilder({ onBack }: FigmaPrototypeBuilderProps) {
  const [selectedPrototype, setSelectedPrototype] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const prototypes = [
    {
      id: 'welcome-auth',
      name: 'Välkomst & Autentisering',
      screens: 4,
      status: 'ready',
      description: 'Välkomstskärm med 3D-robot, inloggning och registrering',
      figmaComponents: ['WelcomeScreen', 'AuthScreens', 'ThreeDRobot', 'ConsentBanner'],
      missing: []
    },
    {
      id: 'onboarding-flow',
      name: 'Onboarding (4 steg)',
      screens: 4,
      status: 'needs-update',
      description: 'Profilskapande med progressbar och validering',
      figmaComponents: ['ProfileCreation', 'AgeVerification', 'PhotoUpload'],
      missing: ['Steg 2: Bakgrundsenergi med autocomplete', 'Steg 3: Preferenser med väljare']
    },
    {
      id: 'personality-test',
      name: 'Personlighetstest (30 frågor)',
      screens: 6,
      status: 'missing',
      description: 'Likert-skala frågor med progress och resultat',
      figmaComponents: ['PersonalityTest'],
      missing: ['30 sliders med Likert-skala', 'Resultatskärm med archetype-kort', 'Beskrivning av MÄÄK-modellen']
    },
    {
      id: 'matching-system',
      name: 'Matchningssystem',
      screens: 3,
      status: 'needs-update',
      description: 'Synkflöde/Vågflöde med kompatibilitetspoäng',
      figmaComponents: ['MatchingSystem'],
      missing: ['Våg-animation för Flödessynk-poäng', 'Archetype-kombinationer visualisering']
    },
    {
      id: 'ai-companion',
      name: 'Strömningsguide (AI)',
      screens: 3,
      status: 'missing',
      description: '3-stegs process för AI-isbrytare',
      figmaComponents: ['AICompanion'],
      missing: ['Steg 1: Analysering animation', 'Steg 2: 3 förslag-bubblor', 'Steg 3: Skicka & försvinn']
    },
    {
      id: 'chat-interface',
      name: 'Dialogflöde',
      screens: 2,
      status: 'ready',
      description: 'Chatt med röstmeddelanden och realtid',
      figmaComponents: ['ChatInterface', 'VoiceMessage', 'VoiceRecorder'],
      missing: []
    },
    {
      id: 'community-features',
      name: 'Gemenskapsström',
      screens: 2,
      status: 'needs-update',
      description: 'Dagliga frågor med röstning och feeds',
      figmaComponents: ['CommunityFeatures', 'DailyMoodCheckin'],
      missing: ['Feed med likes/woos reaktioner', '5-vote limitation visualisering']
    },
    {
      id: 'archetype-cards',
      name: 'Archetype-kartor',
      screens: 16,
      status: 'missing',
      description: 'Klickbara kort för alla 16 archetypes',
      figmaComponents: [],
      missing: ['4 Diplomater-kort', '4 Byggare-kort', '4 Upptäckare-kort', '4 Strateger-kort']
    }
  ];

  const handlePrototypeSelect = (prototypeId: string) => {
    setSelectedPrototype(prototypeId);
  };

  const handleExportToFigma = async () => {
    if (!selectedPrototype) return;

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    const steps = [
      'Förbereder komponenter...',
      'Skapar Figma-frames...',
      'Exporterar styling...',
      'Skapar interaktioner...',
      'Genererar prototyp...',
      'Synkroniserar med Figma...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExportProgress(((i + 1) / steps.length) * 100);
    }

    setIsExporting(false);
    alert(`Prototyp "${prototypes.find(p => p.id === selectedPrototype)?.name}" exporterad till Figma!`);
  };

  const handleViewPrototype = (prototypeId: string) => {
    // Öppna prototype preview
    console.log(`Öppnar förhandsvisning för: ${prototypeId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'needs-update': return 'bg-yellow-100 text-yellow-800';
      case 'missing': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return '✅';
      case 'needs-update': return '🔄';
      case 'missing': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white mr-3">
            <Figma className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-medium">Figma Prototyp Builder</h1>
            <p className="text-sm text-gray-600">MÄÄK Mood Design System</p>
          </div>
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <Card className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
              <Figma className="w-3 h-3" />
            </div>
            <span className="font-medium">Exporterar till Figma...</span>
          </div>
          <Progress value={exportProgress} className="mb-2" />
          <p className="text-sm text-gray-600">{Math.round(exportProgress)}% slutfört</p>
        </Card>
      )}

      {/* Prototype Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {prototypes.map((prototype) => (
          <Card 
            key={prototype.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              selectedPrototype === prototype.id ? 'ring-2 ring-primary border-primary' : ''
            }`}
            onClick={() => handlePrototypeSelect(prototype.id)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{prototype.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{prototype.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(prototype.status)} variant="secondary">
                  {getStatusIcon(prototype.status)} {prototype.status === 'ready' ? 'Klar' : 
                   prototype.status === 'needs-update' ? 'Behöver uppdatering' : 'Saknas'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <Monitor className="w-4 h-4 mr-1" />
                <span>{prototype.screens} skärmar</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Layout className="w-4 h-4 mr-1" />
                <span>{prototype.figmaComponents.length} komponenter</span>
              </div>
            </div>

            {/* Missing Components */}
            {prototype.missing.length > 0 && (
              <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <h4 className="text-sm font-medium text-orange-800 mb-2">Saknas:</h4>
                <ul className="text-xs text-orange-700 space-y-1">
                  {prototype.missing.slice(0, 2).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                  {prototype.missing.length > 2 && (
                    <li>• +{prototype.missing.length - 2} till...</li>
                  )}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPrototype(prototype.id);
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                Förhandsgranska
              </Button>
              {prototype.status === 'ready' && (
                <Button 
                  size="sm"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrototype(prototype.id);
                    handleExportToFigma();
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Exportera
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Export Panel */}
      {selectedPrototype && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h3 className="font-medium mb-4">Exportinställningar</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center p-3 bg-white rounded-lg border">
              <Smartphone className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-sm">Mobil (375px)</p>
                <p className="text-xs text-gray-600">iPhone design</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg border">
              <Palette className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-sm">MÄÄK Färger</p>
                <p className="text-xs text-gray-600">Korall #FF6B6B primär</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg border">
              <Settings className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-sm">Auto-Fix</p>
                <p className="text-xs text-gray-600">Svenska text, layout</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={handleExportToFigma}
              disabled={isExporting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Figma className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporterar...' : 'Exportera till Figma'}
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Förhandsgranska
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Ladda ner kod
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {prototypes.filter(p => p.status === 'ready').length}
          </div>
          <div className="text-sm text-gray-600">Klara prototyper</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {prototypes.filter(p => p.status === 'needs-update').length}
          </div>
          <div className="text-sm text-gray-600">Behöver uppdatering</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {prototypes.filter(p => p.status === 'missing').length}
          </div>
          <div className="text-sm text-gray-600">Saknas helt</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {prototypes.reduce((sum, p) => sum + p.screens, 0)}
          </div>
          <div className="text-sm text-gray-600">Totala skärmar</div>
        </div>
      </div>
    </div>
  );
}