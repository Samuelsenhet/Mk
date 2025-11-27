import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Palette, Smartphone, Layout, Zap } from 'lucide-react';

interface FigmaEnhancementDemoProps {
  onBack: () => void;
}

export function FigmaEnhancementDemo({ onBack }: FigmaEnhancementDemoProps) {
  const [activeDemo, setActiveDemo] = useState<string>('colors');

  const enhancements = [
    {
      id: 'colors',
      title: 'Mjukare Pastell-färger',
      icon: Palette,
      description: 'Uppdaterade färger enligt Figma-analys',
      features: [
        'Primär: #FFB6C1 (mjukare rosa)',
        'Accent: #90EE90 (mjuk grön)',
        'Gradient-primary för konsistens',
        'Förbättrade archetype-badge färger'
      ]
    },
    {
      id: 'responsive',
      title: 'iPhone Safe Areas',
      icon: Smartphone,
      description: 'Responsivt stöd för iPhone notch',
      features: [
        'Safe area top: 44px padding',
        'Safe area bottom: 34px padding',
        'CSS environment variables',
        'Auto-layout för alla frames'
      ]
    },
    {
      id: 'layout',
      title: 'Förbättrad Layout',
      icon: Layout,
      description: 'Horizontal cards och pill-tabs',
      features: [
        'Horizontal stack för 5 match-cards',
        'Snap-to scrolling funktionalitet',
        'Pill-stil tabs för matchning',
        'Emma L-format enligt specifikation'
      ]
    },
    {
      id: 'pairing',
      title: 'Side-by-side Parning',
      icon: Zap,
      description: 'Förbättrad parnings-hub',
      features: [
        'Side-by-side cards (48% bredd)',
        'Tydliga Ja/Nej-knappar',
        'Fyra archetype badges',
        'Grön/grå knapp-design'
      ]
    }
  ];

  const currentEnhancement = enhancements.find(e => e.id === activeDemo);

  return (
    <div className="max-w-md mx-auto p-6 pb-20 safe-area-inset">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Figma-förbättringar Implementerade</h1>
        <p className="text-gray-600 text-sm">
          Alla förbättringar från din Figma-analys är nu implementerade
        </p>
      </div>

      {/* Success Banner */}
      <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Alla förbättringar klara!</h3>
              <p className="text-sm text-green-700">
                Designen är nu komplett och polerad enligt Figma-analys
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {enhancements.map((enhancement) => {
          const Icon = enhancement.icon;
          return (
            <button
              key={enhancement.id}
              className={`pill-tab whitespace-nowrap ${activeDemo === enhancement.id ? 'active' : ''}`}
              onClick={() => setActiveDemo(enhancement.id)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {enhancement.title}
            </button>
          );
        })}
      </div>

      {/* Current Enhancement Details */}
      {currentEnhancement && (
        <Card className="mb-6 match-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <currentEnhancement.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{currentEnhancement.title}</CardTitle>
                <p className="text-sm text-gray-600">{currentEnhancement.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentEnhancement.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Examples */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Live Demo-exempel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Color Demo */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Nya färger:</p>
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded bg-gradient-primary"></div>
              <div className="w-8 h-8 rounded bg-gradient-coral"></div>
              <div className="w-8 h-8 rounded bg-gradient-teal"></div>
            </div>
          </div>

          {/* Badge Demo */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Master archetype badges:</p>
            <div className="flex flex-wrap gap-2">
              <div className="archetype-badge text-xs">Emotionell: Vårdande</div>
              <div className="archetype-badge text-xs">Kreativ: Konstnärlig</div>
            </div>
          </div>

          {/* Pill Tab Demo */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Pill-stil tabs:</p>
            <div className="flex space-x-3">
              <button className="pill-tab active text-sm">Likhetsmatch</button>
              <button className="pill-tab text-sm">Motsatsmatch</button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 mb-2">Nästa steg:</h3>
          <div className="space-y-1 text-sm text-blue-700">
            <p>✅ Alla visuella förbättringar implementerade</p>
            <p>✅ Responsiv design för iPhone notch</p>
            <p>✅ Förbättrad användarupplevelse</p>
            <p>🚀 Redo för export till React Native</p>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={onBack}
        className="w-full"
        variant="outline"
      >
        ← Tillbaka till profil
      </Button>
    </div>
  );
}