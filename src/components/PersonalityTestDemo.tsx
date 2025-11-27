import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Brain, Heart, Target, Users, Eye, Lightbulb } from "lucide-react";

interface PersonalityTestDemoProps {
  onBack: () => void;
}

export function PersonalityTestDemo({ onBack }: PersonalityTestDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Välkommen till MÄÄK Personlighetstest",
      description: "30 frågor som analyserar din personlighet enligt 5 dimensioner",
      icon: Brain,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "5 Personlighetsdimensioner",
      description: "Social energi • Informationsbearbetning • Beslutsfattande • Livsstil • Självförtroende",
      icon: Target,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "16 Arketyper i 4 Kategorier",
      description: "Diplomater • Byggare • Upptäckare • Strateger",
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Smart Matchning Aktiverad",
      description: "Baserat på både likhet och komplement för optimal kompatibilitet",
      icon: Heart,
      color: "from-primary to-secondary"
    }
  ];

  const archetypeExamples = [
    {
      category: "Diplomater",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      types: ["ENFJ - Protagonisten", "ENFP - Kampanjören", "INFJ - Advokaten", "INFP - Mediatorn"],
      description: "Lila färgkodning - Värderingar och äkta förbindelser"
    },
    {
      category: "Byggare", 
      color: "bg-gradient-to-br from-green-500 to-green-600",
      types: ["ESTJ - Chefen", "ESFJ - Konsuln", "ISTJ - Logistikern", "ISFJ - Beskyddaren"],
      description: "Grön färgkodning - Struktur och pålitlighet"
    },
    {
      category: "Upptäckare",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600", 
      types: ["ESTP - Entreprenören", "ESFP - Underhållaren", "ISTP - Virtuosen", "ISFP - Äventyraren"],
      description: "Gul färgkodning - Spontanitet och upplevelser"
    },
    {
      category: "Strateger",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      types: ["ENTJ - Kommandören", "ENTP - Debattören", "INTJ - Arkitekten", "INTP - Tänkaren"], 
      description: "Blå färgkodning - Logik och strategiskt tänkande"
    }
  ];

  const currentStepData = demoSteps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-md mx-auto p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
            <Brain className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Personlighetstest Demo</h1>
          <p className="text-gray-600">Se hur MÄÄK:s smarta matchning fungerar</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Steg {currentStep + 1} av {demoSteps.length}
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round(((currentStep + 1) / demoSteps.length) * 100)}%
            </span>
          </div>
          <Progress value={((currentStep + 1) / demoSteps.length) * 100} className="h-3 rounded-full" />
        </div>

        {/* Content Card */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-[25px]">
          <CardHeader className="text-center pb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${currentStepData.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
              <StepIcon className="w-8 h-8" />
            </div>
            <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-center text-gray-700 mb-6 leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Arketype-exempel på sista steget */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {archetypeExamples.map((category, index) => (
                  <div key={index} className={`${category.color} p-4 rounded-lg text-white`}>
                    <h4 className="font-semibold mb-2">{category.category}</h4>
                    <p className="text-sm opacity-90 mb-3">{category.description}</p>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {category.types.map((type, typeIndex) => (
                        <div key={typeIndex} className="bg-white/20 px-2 py-1 rounded text-center">
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Demo-fråga exempel på första steget */}
            {currentStep === 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Exempel på fråga:</h4>
                <p className="text-sm text-gray-700 mb-3">"Jag trivs bäst i sociala sammanhang med många människor"</p>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Instämmer inte alls</span>
                  <span>Instämmer helt</span>
                </div>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div
                      key={value}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-medium"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensioner på andra steget */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-blue-50 p-3 rounded-lg flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">Social energi (E/I)</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg flex items-center">
                  <Eye className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium">Informationsbearbetning (S/N)</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg flex items-center">
                  <Brain className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium">Beslutsfattande (T/F)</span>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg flex items-center">
                  <Target className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium">Livsstil & struktur (J/P)</span>
                </div>
                <div className="bg-red-50 p-3 rounded-lg flex items-center">
                  <Lightbulb className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-sm font-medium">Självförtroende (A/T)</span>
                </div>
              </div>
            )}

            {/* Smart matchning på sista steget */}
            {currentStep === 3 && (
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-center">🎯 Så fungerar Smart Matchning</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span>Analyserar kompatibilitet baserat på personlighetstyp</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-2"></div>
                    <span>Balanserar likheter och komplement</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                    <span>Föreslår optimal matchningstyp (Likhet/Motsats)</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1 h-12 rounded-[25px] border-2 border-gray-300"
          >
            Föregående
          </Button>
          
          <Button
            onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, currentStep + 1))}
            disabled={currentStep === demoSteps.length - 1}
            className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-[25px] shadow-lg font-semibold"
          >
            {currentStep === demoSteps.length - 1 ? 'Slutför demo' : 'Nästa'}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full h-12 rounded-[25px] border-2 border-gray-300"
        >
          ← Tillbaka till profil
        </Button>
      </div>
    </div>
  );
}