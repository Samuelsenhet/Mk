import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Copy, 
  Check, 
  ExternalLink,
  FileDown,
  ArrowRight,
  ArrowLeft,
  Play,
  CheckCircle,
  AlertCircle,
  Info,
  Figma,
  Download,
  Settings,
  Zap
} from "lucide-react";
import exampleImage from 'figma:asset/3d3e9dfd99ed521a35b4f03c994043e88a4d3abb.png';

interface FigmaImportGuideProps {
  onBack: () => void;
}

export function FigmaImportGuide({ onBack }: FigmaImportGuideProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Updated design tokens for Figma import
  const figmaTokens = {
    "global": {
      "colors": {
        "primary": {
          "50": { "value": "#FFF5F5", "type": "color" },
          "100": { "value": "#FFE3E3", "type": "color" },
          "200": { "value": "#FFCACA", "type": "color" },
          "300": { "value": "#FF9C9C", "type": "color" },
          "400": { "value": "#FF6B6B", "type": "color" },
          "500": { "value": "#FF5252", "type": "color" }
        },
        "secondary": {
          "50": { "value": "#E0F7FA", "type": "color" },
          "100": { "value": "#B2EBF2", "type": "color" },
          "200": { "value": "#80DEEA", "type": "color" },
          "300": { "value": "#4DD0E1", "type": "color" },
          "400": { "value": "#4ECDC4", "type": "color" },
          "500": { "value": "#00BCD4", "type": "color" }
        },
        "neutral": {
          "0": { "value": "#FFFFFF", "type": "color" },
          "50": { "value": "#FAFAFA", "type": "color" },
          "100": { "value": "#F5F5F5", "type": "color" },
          "200": { "value": "#EEEEEE", "type": "color" },
          "800": { "value": "#424242", "type": "color" },
          "900": { "value": "#212121", "type": "color" }
        }
      },
      "spacing": {
        "xs": { "value": "4px", "type": "spacing" },
        "sm": { "value": "8px", "type": "spacing" },
        "md": { "value": "16px", "type": "spacing" },
        "lg": { "value": "24px", "type": "spacing" },
        "xl": { "value": "32px", "type": "spacing" },
        "2xl": { "value": "48px", "type": "spacing" }
      },
      "typography": {
        "fontFamily": {
          "primary": { "value": "Poppins", "type": "fontFamily" }
        },
        "fontSize": {
          "xs": { "value": "12px", "type": "fontSize" },
          "sm": { "value": "14px", "type": "fontSize" },
          "base": { "value": "16px", "type": "fontSize" },
          "lg": { "value": "18px", "type": "fontSize" },
          "xl": { "value": "20px", "type": "fontSize" },
          "2xl": { "value": "24px", "type": "fontSize" },
          "3xl": { "value": "30px", "type": "fontSize" },
          "4xl": { "value": "36px", "type": "fontSize" }
        },
        "fontWeight": {
          "normal": { "value": "400", "type": "fontWeight" },
          "medium": { "value": "500", "type": "fontWeight" },
          "semibold": { "value": "600", "type": "fontWeight" },
          "bold": { "value": "700", "type": "fontWeight" }
        }
      },
      "borderRadius": {
        "sm": { "value": "4px", "type": "borderRadius" },
        "base": { "value": "8px", "type": "borderRadius" },
        "md": { "value": "12px", "type": "borderRadius" },
        "lg": { "value": "16px", "type": "borderRadius" },
        "button": { "value": "25px", "type": "borderRadius" },
        "full": { "value": "50%", "type": "borderRadius" }
      },
      "boxShadow": {
        "sm": { "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)", "type": "boxShadow" },
        "base": { "value": "0 1px 3px 0 rgba(0, 0, 0, 0.1)", "type": "boxShadow" },
        "md": { "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1)", "type": "boxShadow" },
        "lg": { "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1)", "type": "boxShadow" }
      }
    }
  };

  const steps = [
    {
      title: "Förbered Figma",
      description: "Installera plugin och öppna din TIDE-fil",
      icon: Settings
    },
    {
      title: "Konfigurera Plugin",
      description: "Sätt upp Design System Tokens plugin",
      icon: Figma
    },
    {
      title: "Importera Tokens",
      description: "Lägg in Määk Mood design tokens",
      icon: Download
    },
    {
      title: "Skapa Komponenter",
      description: "Bygg UI-komponenter med tokens",
      icon: Zap
    },
    {
      title: "Testa & Publicera",
      description: "Verifiera och dela design systemet",
      icon: CheckCircle
    }
  ];

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => [...prev.filter(id => id !== itemId), itemId]);
      setTimeout(() => {
        setCopiedItems(prev => prev.filter(id => id !== itemId));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const markStepCompleted = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
    if (step < steps.length) {
      setCurrentStep(step + 1);
    }
  };

  const isStepCompleted = (step: number) => completedSteps.includes(step);
  const isStepCurrent = (step: number) => currentStep === step;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Förberedelser</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Vi behöver installera Figma Design System Tokens plugin för att importera vårt design system.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">1. Öppna din TIDE Figma-fil</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Gå till din TIDE Figma-fil som du visade i skärmbilden.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open("https://www.figma.com/design/dGTopC2LlR02zxB9xP5x8B/TIDE", "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Öppna TIDE Figma
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">2. Installera Design System Tokens plugin</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Gå till Plugins → Browse all plugins → Sök "Design System Tokens"
                </p>
                <div className="bg-gray-100 rounded p-3 text-sm font-mono">
                  Resources → Plugins → Browse all plugins → "Design System Tokens"
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">3. Skapa ny page för Design System</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Högerklicka på page-listan och välj "Add page" → Döp den till "Design System"
                </p>
                <div className="bg-gray-100 rounded p-3 text-sm">
                  💡 <strong>Tips:</strong> Håll design systemet på en separat page för bättre organisation
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => markStepCompleted(1)}
            >
              Klar med förberedelser
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Konfigurera Plugin</h4>
                  <p className="text-sm text-green-700">
                    Nu ska vi sätta upp plugin-inställningarna enligt din skärmbild.
                  </p>
                </div>
              </div>
            </div>

            {/* Show the example image */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Din skärmbild visar rätt setup:</h4>
              <img 
                src={exampleImage} 
                alt="Figma Design System Tokens setup" 
                className="w-full rounded border"
              />
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">1. Öppna Design System Tokens plugin</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Gå till Resources → Plugins → Design System Tokens
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
                  ⚠️ Se till att du är på "Design System" page innan du öppnar plugin
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">2. Fyll i plugin-formuläret</h4>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-medium">Design system name:</label>
                      <div className="bg-gray-100 p-2 rounded font-mono">Määk Mood Design System</div>
                    </div>
                    <div>
                      <label className="font-medium">Three letter abbreviation:</label>
                      <div className="bg-gray-100 p-2 rounded font-mono">MMD</div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Ändra från "TIDE Export" och "DSY" till "Määk Mood Design System" och "MMD"
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">3. Klicka "Create"</h4>
                <p className="text-sm text-gray-600">
                  Plugin kommer att skapa grundstrukturen för design systemet.
                </p>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => markStepCompleted(2)}
            >
              Plugin är konfigurerat
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Download className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800 mb-2">Importera Design Tokens</h4>
                  <p className="text-sm text-purple-700">
                    Nu importerar vi alla färger, typografi och spacing-tokens från Määk Mood.
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">Kompletta Määk Mood Tokens (JSON)</h4>
              <p className="text-sm text-gray-600 mb-3">
                Kopiera denna JSON och importera den i Figma Design System Tokens plugin:
              </p>
              
              <div className="bg-gray-100 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap">
{JSON.stringify(figmaTokens, null, 2)}
                </pre>
              </div>

              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => copyToClipboard(JSON.stringify(figmaTokens, null, 2), "figma-tokens")}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedItems.includes("figma-tokens") ? "Kopierat!" : "Copy JSON"}
                </Button>
                
                <Button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(figmaTokens, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'maak-mood-tokens.json';
                    a.click();
                  }}
                  className="flex-1"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Import-steg i Figma:</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Öppna Design System Tokens plugin i Figma</li>
                  <li>Klicka på "Import" eller "Load tokens" knappen</li>
                  <li>Välj "JSON" som format</li>
                  <li>Klistra in JSON från ovan (eller upload filen)</li>
                  <li>Klicka "Import" för att ladda alla tokens</li>
                  <li>Vänta medan plugin skapar alla variabler</li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <strong>Efter import får du:</strong>
                    <ul className="mt-1 space-y-1 list-disc list-inside ml-4">
                      <li>12 färg-variabler (Primary, Secondary, Neutral)</li>
                      <li>6 spacing-tokens (xs till 2xl)</li>
                      <li>8 typografi-storlekar och vikter</li>
                      <li>6 border-radius värden</li>
                      <li>4 box-shadow definitioner</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => markStepCompleted(3)}
            >
              Tokens importerade
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 mb-2">Skapa Komponenter</h4>
                  <p className="text-sm text-orange-700">
                    Nu använder vi tokens för att bygga återanvändbara UI-komponenter.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">1. Button Primary Komponent</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Skapa en ny komponent:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Rita en rectangle (R)</li>
                    <li>Sätt bakgrundsfärg till: <code className="bg-gray-100 px-1 rounded">primary/400</code></li>
                    <li>Sätt border-radius till: <code className="bg-gray-100 px-1 rounded">borderRadius/button</code></li>
                    <li>Lägg till text med färg: <code className="bg-gray-100 px-1 rounded">neutral/0</code></li>
                    <li>Använd Auto Layout med padding: <code className="bg-gray-100 px-1 rounded">spacing/md</code></li>
                    <li>Gör till komponent (Ctrl/Cmd + Alt + K)</li>
                  </ol>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">2. Input Field Komponent</h4>
                <div className="space-y-2 text-sm">
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Rita en rectangle för input</li>
                    <li>Sätt border: 1px solid <code className="bg-gray-100 px-1 rounded">neutral/200</code></li>
                    <li>Sätt border-radius: <code className="bg-gray-100 px-1 rounded">borderRadius/base</code></li>
                    <li>Lägg till placeholder text</li>
                    <li>Skapa focus state med border: <code className="bg-gray-100 px-1 rounded">primary/400</code></li>
                  </ol>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">3. Card Komponent</h4>
                <div className="space-y-2 text-sm">
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Rita en rectangle för card</li>
                    <li>Sätt bakgrund: <code className="bg-gray-100 px-1 rounded">neutral/0</code></li>
                    <li>Sätt border-radius: <code className="bg-gray-100 px-1 rounded">borderRadius/md</code></li>
                    <li>Lägg till shadow: <code className="bg-gray-100 px-1 rounded">boxShadow/base</code></li>
                    <li>Använd Auto Layout med padding: <code className="bg-gray-100 px-1 rounded">spacing/lg</code></li>
                  </ol>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-sm text-green-700">
                    <strong>Pro Tips:</strong>
                    <ul className="mt-1 space-y-1 list-disc list-inside ml-4">
                      <li>Använd variants för olika button states (hover, active, disabled)</li>
                      <li>Skapa component sets för bättre organisation</li>
                      <li>Använd constraints för responsiv design</li>
                      <li>Testa auto layout med olika content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => markStepCompleted(4)}
            >
              Komponenter skapade
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Testa & Publicera</h4>
                  <p className="text-sm text-green-700">
                    Sista steget - testa allt och publicera design systemet för teamet.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">1. Testa Komponenter</h4>
                <div className="space-y-2 text-sm">
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Testa alla variants av dina komponenter</li>
                    <li>Verifiera att Auto Layout fungerar korrekt</li>
                    <li>Kontrollera att constraints håller vid resize</li>
                    <li>Säkerställ att alla tokens används konsekvent</li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">2. Dokumentation</h4>
                <div className="space-y-2 text-sm">
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Lägg till beskrivningar för komponenter</li>
                    <li>Dokumentera när olika variants ska användas</li>
                    <li>Skapa exempel på hur komponenter kombineras</li>
                    <li>Beskriv design principles</li>
                  </ul>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">3. Publicera Design System</h4>
                <div className="space-y-2 text-sm">
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Markera alla komponenter du vill publicera</li>
                    <li>Klicka på "Publish" knappen i högra panelen</li>
                    <li>Lägg till release notes</li>
                    <li>Klicka "Publish library"</li>
                    <li>Dela med teamet via link</li>
                  </ol>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <strong>Färdigt! 🎉</strong>
                    <p className="mt-1">
                      Nu har du ett komplett Määk Mood design system i Figma med tokens, 
                      komponenter och dokumentation. Teamet kan nu använda det för alla designs!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => markStepCompleted(5)}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Design System Komplett!
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <Figma className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Figma Import Guide</h1>
            <h2 className="text-xl mb-2">Steg-för-steg: TIDE → Määk Mood</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Komplett guide för att importera Määk Mood design systemet till din TIDE Figma-fil 
              med Design System Tokens plugin.
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const stepNumber = index + 1;
              
              return (
                <div key={index} className="flex items-center">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isStepCompleted(stepNumber) ? "bg-green-500 text-white" :
                      isStepCurrent(stepNumber) ? "bg-primary text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isStepCompleted(stepNumber) ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      isStepCompleted(stepNumber) ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-5 gap-4 text-center">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              return (
                <div key={index}>
                  <h4 className={`font-medium text-sm ${
                    isStepCurrent(stepNumber) ? "text-primary" :
                    isStepCompleted(stepNumber) ? "text-green-600" :
                    "text-gray-600"
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                {currentStep}
              </div>
              <span>Steg {currentStep}: {steps[currentStep - 1]?.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Föregående
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            disabled={currentStep === steps.length}
          >
            Nästa
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Snabbåtkomst</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(JSON.stringify(figmaTokens, null, 2), "quick-tokens")}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copiedItems.includes("quick-tokens") ? "Kopierat!" : "Copy Tokens JSON"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => window.open("https://www.figma.com/design/dGTopC2LlR02zxB9xP5x8B/TIDE", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Öppna TIDE Figma
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setCurrentStep(3)}
              >
                <Play className="w-4 h-4 mr-2" />
                Hoppa till Import
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}