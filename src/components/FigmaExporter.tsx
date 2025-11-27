import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  FileDown,
  Code2,
  Figma,
  ArrowLeft,
  Upload,
  Zap,
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface FigmaExporterProps {
  onBack: () => void;
}

export function FigmaExporter({ onBack }: FigmaExporterProps) {
  const [exportStep, setExportStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedItems, setCopiedItems] = useState<string[]>([]);

  const exportSteps = [
    {
      title: "Förbered Design Tokens",
      description: "Exportera färger, typografi och spacing",
      action: "prepare-tokens"
    },
    {
      title: "Generera Komponenter",
      description: "Skapa alla UI-komponenter med variants",
      action: "generate-components"
    },
    {
      title: "Exportera Skärm-templates",
      description: "Bygg kompletta skärm-layouts",
      action: "export-screens"
    },
    {
      title: "Finaliseringar",
      description: "Auto Layout, constraints och prototyping",
      action: "finalize"
    }
  ];

  const designTokensExport = {
    colors: {
      "Primary/400": "#FF6B6B",
      "Primary/300": "#FF9C9C", 
      "Primary/500": "#FF5252",
      "Secondary/400": "#4ECDC4",
      "Secondary/300": "#4DD0E1",
      "Secondary/500": "#00BCD4",
      "Neutral/0": "#FFFFFF",
      "Neutral/100": "#F5F5F5",
      "Neutral/200": "#EEEEEE",
      "Neutral/800": "#424242",
      "Neutral/900": "#212121"
    },
    typography: {
      "Heading/H1": {
        fontFamily: "Poppins",
        fontSize: "36px",
        fontWeight: "600",
        lineHeight: "44px"
      },
      "Heading/H2": {
        fontFamily: "Poppins", 
        fontSize: "24px",
        fontWeight: "600",
        lineHeight: "32px"
      },
      "Body/Large": {
        fontFamily: "Poppins",
        fontSize: "18px", 
        fontWeight: "400",
        lineHeight: "28px"
      },
      "Body/Regular": {
        fontFamily: "Poppins",
        fontSize: "16px",
        fontWeight: "400", 
        lineHeight: "24px"
      },
      "Body/Small": {
        fontFamily: "Poppins",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "20px"
      }
    },
    spacing: {
      "xs": "4px",
      "sm": "8px", 
      "md": "16px",
      "lg": "24px",
      "xl": "32px",
      "2xl": "48px"
    },
    borderRadius: {
      "button": "25px",
      "card": "12px",
      "input": "8px",
      "avatar": "50%"
    }
  };

  const componentSpecs = [
    {
      name: "Button/Primary",
      variants: ["Default", "Hover", "Active", "Disabled"],
      props: {
        size: ["Small (32px)", "Medium (44px)", "Large (56px)"],
        state: ["Default", "Hover", "Active", "Disabled"],
        iconPosition: ["None", "Left", "Right", "Icon Only"]
      },
      autoLayout: true,
      constraints: "Scale"
    },
    {
      name: "Button/Secondary", 
      variants: ["Default", "Hover", "Active", "Disabled"],
      props: {
        size: ["Small", "Medium", "Large"],
        state: ["Default", "Hover", "Active", "Disabled"]
      },
      autoLayout: true,
      constraints: "Scale"
    },
    {
      name: "Input/Text",
      variants: ["Default", "Focus", "Error", "Disabled"],
      props: {
        state: ["Default", "Focus", "Error", "Disabled"],
        type: ["Text", "Email", "Password"],
        hasIcon: ["True", "False"]
      },
      autoLayout: true,
      constraints: "Scale"
    },
    {
      name: "Card/Match",
      variants: ["Default", "Liked", "Passed"],
      props: {
        state: ["Default", "Hover", "Selected"],
        hasActions: ["True", "False"]
      },
      autoLayout: true,
      constraints: "Scale"
    },
    {
      name: "Avatar/Profile",
      variants: ["Small", "Medium", "Large", "Extra Large"],
      props: {
        size: ["32px", "48px", "64px", "96px"],
        hasImage: ["True", "False"],
        hasIndicator: ["None", "Online", "Premium"]
      },
      autoLayout: false,
      constraints: "Center"
    },
    {
      name: "Navigation/Tab", 
      variants: ["Active", "Inactive", "With Badge"],
      props: {
        state: ["Active", "Inactive"],
        hasBadge: ["True", "False"],
        badgeCount: ["None", "1-9", "9+"]
      },
      autoLayout: true,
      constraints: "Scale"
    }
  ];

  const screenLayouts = [
    {
      name: "Welcome Screen",
      viewport: "Mobile (375x812)",
      components: ["Hero Image", "Logo", "Button/Primary", "Button/Secondary", "Text/Legal"],
      layout: "Auto Layout - Vertical",
      constraints: "Top & Bottom"
    },
    {
      name: "Login Screen",
      viewport: "Mobile (375x812)", 
      components: ["Input/Email", "Input/Password", "Button/Primary", "Divider", "Social Login"],
      layout: "Auto Layout - Vertical",
      constraints: "Center"
    },
    {
      name: "Matching Interface",
      viewport: "Mobile (375x812)",
      components: ["Card/Match", "Button/Like", "Button/Pass", "Progress", "Navigation/Bottom"],
      layout: "Auto Layout - Mixed",
      constraints: "Fill Container"
    },
    {
      name: "Chat Interface", 
      viewport: "Mobile (375x812)",
      components: ["Header/Chat", "Message/Sent", "Message/Received", "Input/Message", "Button/Voice"],
      layout: "Auto Layout - Vertical",
      constraints: "Fill Container"
    },
    {
      name: "Profile Screen",
      viewport: "Mobile (375x812)",
      components: ["Avatar/Large", "Card/Stats", "List/Settings", "Button/Logout"],
      layout: "Auto Layout - Vertical", 
      constraints: "Top & Bottom"
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

  const generateFigmaJS = () => {
    return `
// Määk Mood Design System - Figma Auto-Import Script
// Run this in Figma's console to auto-generate design system

const designSystem = ${JSON.stringify(designTokensExport, null, 2)};

// Auto-create color variables
Object.entries(designSystem.colors).forEach(([name, value]) => {
  const variable = figma.variables.createVariable(name, "COLLECTION_ID", "COLOR");
  variable.setValueForMode("MODE_ID", figma.util.rgb(value));
});

// Auto-create text styles
Object.entries(designSystem.typography).forEach(([name, style]) => {
  const textStyle = figma.createTextStyle();
  textStyle.name = name;
  textStyle.fontSize = parseInt(style.fontSize);
  textStyle.fontName = { family: style.fontFamily, style: "Regular" };
  textStyle.lineHeight = { value: parseInt(style.lineHeight), unit: "PIXELS" };
});

console.log("Design system imported successfully!");
`;
  };

  const runExportStep = async (step: number) => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setExportStep(step + 1);
    setIsExporting(false);
    
    if (step === exportSteps.length - 1) {
      // Export completed
      setTimeout(() => {
        setExportStep(0);
      }, 3000);
    }
  };

  const isCompleted = (step: number) => exportStep > step;
  const isCurrent = (step: number) => exportStep === step;

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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <Figma className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Figma Export Tool</h1>
            <h2 className="text-xl mb-2">Määk Mood → TIDE Migration</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Automatisk export av design system till din TIDE Figma-fil. 
              Alla komponenter, tokens och layouts exporteras enligt professionella standards.
            </p>
          </div>
        </div>

        {/* Export Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Export Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={(exportStep / exportSteps.length) * 100} className="h-3" />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Steg {exportStep} av {exportSteps.length}</span>
                <span>{Math.round((exportStep / exportSteps.length) * 100)}% klart</span>
              </div>
            </div>

            <div className="space-y-3">
              {exportSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted(index) ? "bg-green-500 text-white" :
                    isCurrent(index) ? "bg-primary text-white" :
                    "bg-gray-200 text-gray-500"
                  }`}>
                    {isCompleted(index) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isCurrent(index) && isExporting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      isCompleted(index) ? "text-green-700" :
                      isCurrent(index) ? "text-primary" :
                      "text-gray-600"
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>

                  {isCurrent(index) && !isExporting && (
                    <Button 
                      size="sm"
                      onClick={() => runExportStep(index)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Kör steg
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Design Tokens */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Design Tokens</span>
                <Badge variant="secondary">JSON</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Färger, typografi och spacing-tokens för Figma import
              </p>
              
              <div className="bg-gray-100 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                <pre className="text-xs font-mono">
{JSON.stringify(designTokensExport, null, 2).slice(0, 200)}...
                </pre>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => copyToClipboard(JSON.stringify(designTokensExport, null, 2), "tokens")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedItems.includes("tokens") ? "Kopierat!" : "Copy JSON"}
                </Button>
                
                <Button 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(designTokensExport, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'maak-mood-tokens.json';
                    a.click();
                  }}
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Import Script */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Auto-Import Script</span>
                <Badge variant="secondary">JavaScript</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Kör detta script i Figma för automatisk import
              </p>

              <div className="bg-gray-100 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                <pre className="text-xs font-mono">
{generateFigmaJS().slice(0, 200)}...
                </pre>
              </div>

              <div className="space-y-2">
                <Button 
                  variant="outline"
                  size="sm" 
                  className="w-full"
                  onClick={() => copyToClipboard(generateFigmaJS(), "script")}
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  {copiedItems.includes("script") ? "Kopierat!" : "Copy Script"}
                </Button>

                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.open("https://www.figma.com/design/dGTopC2LlR02zxB9xP5x8B/TIDE", "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open TIDE Figma
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Specifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Komponent Specifikationer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {componentSpecs.map((comp, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{comp.name}</h4>
                    <div className="flex space-x-1">
                      {comp.autoLayout && <Badge variant="secondary" className="text-xs">Auto Layout</Badge>}
                      <Badge variant="outline" className="text-xs">{comp.constraints}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Variants: </span>
                      <span className="text-gray-600">{comp.variants.join(", ")}</span>
                    </div>
                    
                    {Object.entries(comp.props).map(([key, values]) => (
                      <div key={key}>
                        <span className="font-medium capitalize">{key}: </span>
                        <span className="text-gray-600">{values.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Screen Layouts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skärm-layouter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {screenLayouts.map((screen, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{screen.name}</h4>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">{screen.viewport}</Badge>
                      <Badge variant="secondary" className="text-xs">{screen.layout}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Komponenter:</strong> {screen.components.join(", ")}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Constraints:</strong> {screen.constraints}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Guide */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Implementation Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Figma Setup (5 min)</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Öppna din TIDE Figma-fil</li>
                  <li>Skapa ny "Design System" page</li>
                  <li>Installera "Figma Tokens" plugin</li>
                  <li>Importera JSON från Design Tokens-sektionen</li>
                  <li>Kör Auto-Import scriptet i Developer Console</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Manual Setup (30 min)</h4>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Skapa färg-variabler enligt token-specifikation</li>
                  <li>Sätt upp text-stilar med Poppins-typsnitt</li>
                  <li>Bygg komponenter enligt specifikationerna</li>
                  <li>Lägg till variants och properties</li>
                  <li>Testa Auto Layout och constraints</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-800 mb-1">Tips för bästa resultat</h5>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Använd Auto Layout för alla komponenter</li>
                    <li>Sätt upp constraints för responsiv design</li>
                    <li>Testa alla variants innan publicering</li>
                    <li>Använd konsekvent naming convention</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}