import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Brain, Heart, Target, Users, Eye, Scale, Clock, Lightbulb, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

interface PersonalityTestIntroProps {
  onStartTest: () => void;
  onBack: () => void;
}

export function PersonalityTestIntro({ onStartTest, onBack }: PersonalityTestIntroProps) {
  const dimensions = [
    {
      name: "Social Energi",
      code: "E/I",
      description: "Hur du laddar dina batterier och interagerar med världen",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      examples: ["Extraversion (E): Energi från sociala sammanhang", "Introversion (I): Energi från egen reflektion"]
    },
    {
      name: "Informationsbearbetning", 
      code: "S/N",
      description: "Hur du samlar in och bearbetar information",
      icon: Eye,
      color: "from-green-500 to-green-600", 
      examples: ["Sensing (S): Fokus på konkreta fakta", "Intuition (N): Fokus på mönster och möjligheter"]
    },
    {
      name: "Beslutsfattande",
      code: "T/F", 
      description: "Hur du fattar beslut och värderar information",
      icon: Scale,
      color: "from-purple-500 to-purple-600",
      examples: ["Thinking (T): Logisk, objektiv analys", "Feeling (F): Värdebaserat, subjektivt"]
    },
    {
      name: "Livsstil & Struktur",
      code: "J/P",
      description: "Hur du organiserar ditt liv och förhåller dig till planering", 
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      examples: ["Judging (J): Struktur och planering", "Prospecting (P): Flexibilitet och spontanitet"]
    },
    {
      name: "Självförtroende",
      code: "A/T",
      description: "Hur du hanterar stress och dina egna förmågor",
      icon: Target,
      color: "from-red-500 to-red-600",
      examples: ["Assertive (A): Självförtroende och stabilitet", "Turbulent (T): Strävan efter förbättring"]
    }
  ];

  const archetypeCategories = [
    {
      name: "Diplomater",
      code: "NF", 
      description: "Värdedriven, idealistisk, fokuserad på personlig utveckling",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      types: ["ENFJ - Protagonisten", "ENFP - Kampanjören", "INFJ - Advokaten", "INFP - Mediatorn"],
      icon: Heart
    },
    {
      name: "Byggare",
      code: "SJ",
      description: "Praktisk, pålitlig, fokuserad på stabilitet och tradition", 
      color: "bg-gradient-to-br from-green-500 to-green-600",
      types: ["ESTJ - Chefen", "ESFJ - Konsuln", "ISTJ - Logistikern", "ISFJ - Beskyddaren"],
      icon: Target
    },
    {
      name: "Upptäckare", 
      code: "SP",
      description: "Spontan, anpassningsbar, fokuserad på upplevelser",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600", 
      types: ["ESTP - Entreprenören", "ESFP - Underhållaren", "ISTP - Virtuosen", "ISFP - Äventyraren"],
      icon: Zap
    },
    {
      name: "Strateger",
      code: "NT", 
      description: "Rationell, oberoende, fokuserad på system och idéer",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      types: ["ENTJ - Kommandören", "ENTP - Debattören", "INTJ - Arkitekten", "INTP - Tänkaren"],
      icon: Brain
    }
  ];

  const testFeatures = [
    "30 vetenskapligt baserade frågor",
    "5-punkt Likert skala för noggrannhet", 
    "16 unika arketyper i 4 kategorier",
    "Smart matchningsalgoritm",
    "Färgkodad visuell representation",
    "Kompatibilitetsanalys för dejting"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-md mx-auto p-6 pb-20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
            <Brain className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">MÄÄK Personlighetstest</h1>
          <p className="text-gray-600">Vetenskapligt validerat • 16 arketyper • Smart matchning</p>
        </div>

        {/* Test Features */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-[25px]">
          <CardHeader>
            <CardTitle className="text-center text-lg">Vad ingår i testet?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {testFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 5 Dimensioner */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-[25px]">
          <CardHeader>
            <CardTitle className="text-center text-lg">5 Personlighetsdimensioner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dimensions.map((dimension, index) => {
                const DimensionIcon = dimension.icon;
                return (
                  <div key={index} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${dimension.color} rounded-full flex items-center justify-center text-white mr-3`}>
                        <DimensionIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{dimension.name}</h4>
                        <Badge variant="secondary" className="text-xs">{dimension.code}</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{dimension.description}</p>
                    <div className="space-y-1">
                      {dimension.examples.map((example, exIndex) => (
                        <div key={exIndex} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 4 Archetyp-kategorier */}
        <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-[25px]">
          <CardHeader>
            <CardTitle className="text-center text-lg">4 Archetyp-kategorier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {archetypeCategories.map((category, index) => {
                const CategoryIcon = category.icon;
                return (
                  <div key={index} className={`${category.color} p-4 rounded-lg text-white`}>
                    <div className="flex items-center mb-2">
                      <CategoryIcon className="w-6 h-6 mr-2" />
                      <div>
                        <h4 className="font-semibold">{category.name}</h4>
                        <Badge className="bg-white/20 text-white border-0 text-xs">{category.code}</Badge>
                      </div>
                    </div>
                    <p className="text-sm opacity-90 mb-3">{category.description}</p>
                    <div className="grid grid-cols-1 gap-1">
                      {category.types.map((type, typeIndex) => (
                        <div key={typeIndex} className="bg-white/20 px-2 py-1 rounded text-xs text-center">
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Smart matchning info */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-0 rounded-[25px]">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Smart Matchning</h3>
            <p className="text-sm text-gray-700 mb-4">
              Efter testet analyserar MÄÄK din personlighetstyp och föreslår kompatibla profiler baserat på både likheter och komplement för optimal kemisk koppling.
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
              <span>Likhetsmatch</span>
              <ArrowRight className="w-3 h-3" />
              <span>Motsatsmatch</span>
              <ArrowRight className="w-3 h-3" />
              <span>Optimal balans</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-[25px] shadow-lg font-semibold"
            onClick={onStartTest}
          >
            <Brain className="w-5 h-5 mr-2" />
            Starta Personlighetstestet
          </Button>
          
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full h-12 rounded-[25px] border-2 border-gray-300"
          >
            ← Tillbaka
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Testet tar cirka 5-8 minuter att slutföra
        </p>
      </div>
    </div>
  );
}