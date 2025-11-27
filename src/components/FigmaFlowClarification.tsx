import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  ArrowRight, 
  ArrowLeft,
  Download,
  Upload,
  Figma,
  Smartphone,
  Copy,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap
} from "lucide-react";
import figmaExportImage from 'figma:asset/6d3bfc61d31724a5ba35f407e940f9ebe2152fb5.png';

interface FigmaFlowClarificationProps {
  onBack: () => void;
  onStartExport: () => void;
}

export function FigmaFlowClarification({ onBack, onStartExport }: FigmaFlowClarificationProps) {
  const [copiedItems, setCopiedItems] = useState<string[]>([]);

  // Correct JSON tokens for export
  const exportTokens = {
    "global": {
      "colors": {
        "primary": {
          "400": { "value": "#FF6B6B", "type": "color" },
          "300": { "value": "#FF9C9C", "type": "color" },
          "500": { "value": "#FF5252", "type": "color" }
        },
        "secondary": {
          "400": { "value": "#4ECDC4", "type": "color" },
          "300": { "value": "#4DD0E1", "type": "color" },
          "500": { "value": "#00BCD4", "type": "color" }
        },
        "neutral": {
          "0": { "value": "#FFFFFF", "type": "color" },
          "100": { "value": "#F5F5F5", "type": "color" },
          "900": { "value": "#212121", "type": "color" }
        }
      },
      "spacing": {
        "xs": { "value": "4px", "type": "spacing" },
        "sm": { "value": "8px", "type": "spacing" },
        "md": { "value": "16px", "type": "spacing" },
        "lg": { "value": "24px", "type": "spacing" },
        "xl": { "value": "32px", "type": "spacing" }
      },
      "typography": {
        "fontFamily": {
          "primary": { "value": "Poppins", "type": "fontFamily" }
        },
        "fontSize": {
          "base": { "value": "16px", "type": "fontSize" },
          "lg": { "value": "18px", "type": "fontSize" },
          "xl": { "value": "20px", "type": "fontSize" },
          "2xl": { "value": "24px", "type": "fontSize" },
          "4xl": { "value": "36px", "type": "fontSize" }
        }
      },
      "borderRadius": {
        "button": { "value": "25px", "type": "borderRadius" },
        "card": { "value": "12px", "type": "borderRadius" },
        "input": { "value": "8px", "type": "borderRadius" }
      }
    }
  };

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
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Viktigt förtydligande!</h1>
            <h2 className="text-xl mb-2">Korrekt Export-flöde: App → Figma</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Din skärmbild visar att du försöker exportera från Figma, men vårt flöde går åt andra hållet! 
              Vi exporterar design systemet FRÅN appen TILL Figma.
            </p>
          </div>
        </div>

        {/* Problem identification */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Det du försökte göra (fel riktning)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-medium mb-2">Din skärmbild visar:</h4>
                <img 
                  src={figmaExportImage} 
                  alt="Figma export dialog"
                  className="w-full max-w-md mx-auto rounded border mb-3"
                />
                <p className="text-sm text-gray-600">
                  Du är i Figma och försöker exportera något med "Export" dialogen. 
                  Men det finns inget att exportera eftersom du inte har något Määk Mood content i Figma än!
                </p>
              </div>

              <div className="flex items-center justify-center space-x-4 text-red-600">
                <Figma className="w-8 h-8" />
                <ArrowRight className="w-6 h-6" />
                <span className="text-lg">❌</span>
                <ArrowRight className="w-6 h-6" />
                <Smartphone className="w-8 h-8" />
              </div>
              <p className="text-center text-red-600 font-medium">
                Figma → App = FEL RIKTNING
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Correct flow */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Korrekt flöde (rätt riktning)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4 text-green-600">
                <Smartphone className="w-8 h-8" />
                <ArrowRight className="w-6 h-6" />
                <Download className="w-6 h-6" />
                <ArrowRight className="w-6 h-6" />
                <Figma className="w-8 h-8" />
              </div>
              <p className="text-center text-green-600 font-medium">
                Määk Mood App → JSON Export → Figma Import = RÄTT RIKTNING
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                    1
                  </div>
                  <h5 className="font-medium">Starta från appen</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Använd våra export-verktyg i Määk Mood appen
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                    2
                  </div>
                  <h5 className="font-medium">Kopiera JSON</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Få design tokens i JSON-format från appen
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-2">
                    3
                  </div>
                  <h5 className="font-medium">Importera till Figma</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Använd Design System Tokens plugin i Figma
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick action */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Snabbstart - Kopiera detta nu!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Här är Määk Mood design tokens i korrekt format för Figma. 
              Kopiera denna JSON och importera den i Figma Design System Tokens plugin:
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
{JSON.stringify(exportTokens, null, 2)}
              </pre>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => copyToClipboard(JSON.stringify(exportTokens, null, 2), "quick-tokens")}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copiedItems.includes("quick-tokens") ? "Kopierat!" : "Kopiera JSON"}
              </Button>

              <Button 
                variant="outline"
                onClick={() => window.open("https://www.figma.com/design/dGTopC2LlR02zxB9xP5x8B/TIDE", "_blank")}
                className="flex-1"
              >
                <Figma className="w-4 h-4 mr-2" />
                Öppna Figma
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step by step instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Nu gör du så här (korrekt process):</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Kopiera JSON ovan</h4>
                  <p className="text-sm text-gray-600">
                    Klicka "Kopiera JSON" knappen för att få alla Määk Mood design tokens
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Öppna Figma Design System Tokens plugin</h4>
                  <p className="text-sm text-gray-600">
                    I din TIDE Figma-fil: Resources → Plugins → "Design System Tokens"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Ändra plugin-inställningar</h4>
                  <p className="text-sm text-gray-600">
                    Ändra "TIDE Export" → "Määk Mood Design System" och "DSY" → "MMD"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Importera JSON</h4>
                  <p className="text-sm text-gray-600">
                    Klicka "Import" i plugin → Välj JSON → Klistra in token-data → Importera
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium">Klart!</h4>
                  <p className="text-sm text-gray-600">
                    Nu har du alla Määk Mood färger, typografi och spacing i Figma
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Vill du ha mer hjälp?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 mb-4">
                Vi har detaljerade guider för hela processen
              </p>
              <Button 
                variant="outline"
                onClick={onStartExport}
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Använd Steg-för-steg Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Avancerade verktyg</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700 mb-4">
                Automatiska export-verktyg och komponenter
              </p>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "#export"}
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Utforska Export-verktyg
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}