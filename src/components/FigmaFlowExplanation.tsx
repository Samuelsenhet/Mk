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
  Zap,
  Play,
  ExternalLink
} from "lucide-react";

interface FigmaFlowExplanationProps {
  onBack: () => void;
  onStartGuide: () => void;
}

export function FigmaFlowExplanation({ onBack, onStartGuide }: FigmaFlowExplanationProps) {
  const [copiedItems, setCopiedItems] = useState<string[]>([]);

  // Complete design tokens for Figma export
  const designTokens = {
    "global": {
      "colors": {
        "primary": {
          "50": { "value": "#FFF5F5", "type": "color", "description": "Lightest coral" },
          "100": { "value": "#FFE3E3", "type": "color", "description": "Very light coral" },
          "200": { "value": "#FFCACA", "type": "color", "description": "Light coral" },
          "300": { "value": "#FF9C9C", "type": "color", "description": "Medium light coral" },
          "400": { "value": "#FF6B6B", "type": "color", "description": "Main coral brand color" },
          "500": { "value": "#FF5252", "type": "color", "description": "Dark coral" },
          "600": { "value": "#F44336", "type": "color", "description": "Darker coral" }
        },
        "secondary": {
          "50": { "value": "#E0F7FA", "type": "color", "description": "Lightest teal" },
          "100": { "value": "#B2EBF2", "type": "color", "description": "Very light teal" },
          "200": { "value": "#80DEEA", "type": "color", "description": "Light teal" },
          "300": { "value": "#4DD0E1", "type": "color", "description": "Medium teal" },
          "400": { "value": "#4ECDC4", "type": "color", "description": "Main teal accent color" },
          "500": { "value": "#00BCD4", "type": "color", "description": "Dark teal" },
          "600": { "value": "#0097A7", "type": "color", "description": "Darker teal" }
        },
        "neutral": {
          "0": { "value": "#FFFFFF", "type": "color", "description": "Pure white" },
          "50": { "value": "#FAFAFA", "type": "color", "description": "Off white" },
          "100": { "value": "#F5F5F5", "type": "color", "description": "Light gray" },
          "200": { "value": "#EEEEEE", "type": "color", "description": "Border gray" },
          "300": { "value": "#E0E0E0", "type": "color", "description": "Medium light gray" },
          "400": { "value": "#BDBDBD", "type": "color", "description": "Medium gray" },
          "500": { "value": "#9E9E9E", "type": "color", "description": "Text gray" },
          "600": { "value": "#757575", "type": "color", "description": "Dark gray" },
          "700": { "value": "#616161", "type": "color", "description": "Darker gray" },
          "800": { "value": "#424242", "type": "color", "description": "Very dark gray" },
          "900": { "value": "#212121", "type": "color", "description": "Almost black" }
        }
      },
      "spacing": {
        "xs": { "value": "4px", "type": "spacing", "description": "Extra small spacing" },
        "sm": { "value": "8px", "type": "spacing", "description": "Small spacing" },
        "md": { "value": "16px", "type": "spacing", "description": "Medium spacing" },
        "lg": { "value": "24px", "type": "spacing", "description": "Large spacing" },
        "xl": { "value": "32px", "type": "spacing", "description": "Extra large spacing" },
        "2xl": { "value": "48px", "type": "spacing", "description": "Double extra large spacing" },
        "3xl": { "value": "64px", "type": "spacing", "description": "Triple extra large spacing" }
      },
      "typography": {
        "fontFamily": {
          "primary": { "value": "Poppins", "type": "fontFamily", "description": "Main brand font" },
          "fallback": { "value": "system-ui, -apple-system, sans-serif", "type": "fontFamily", "description": "Fallback font stack" }
        },
        "fontSize": {
          "xs": { "value": "12px", "type": "fontSize", "description": "Extra small text" },
          "sm": { "value": "14px", "type": "fontSize", "description": "Small text" },
          "base": { "value": "16px", "type": "fontSize", "description": "Base text size" },
          "lg": { "value": "18px", "type": "fontSize", "description": "Large text" },
          "xl": { "value": "20px", "type": "fontSize", "description": "Extra large text" },
          "2xl": { "value": "24px", "type": "fontSize", "description": "Heading size" },
          "3xl": { "value": "30px", "type": "fontSize", "description": "Large heading" },
          "4xl": { "value": "36px", "type": "fontSize", "description": "Extra large heading" }
        },
        "fontWeight": {
          "normal": { "value": "400", "type": "fontWeight", "description": "Normal weight" },
          "medium": { "value": "500", "type": "fontWeight", "description": "Medium weight" },
          "semibold": { "value": "600", "type": "fontWeight", "description": "Semi bold weight" },
          "bold": { "value": "700", "type": "fontWeight", "description": "Bold weight" }
        },
        "lineHeight": {
          "tight": { "value": "1.25", "type": "lineHeight", "description": "Tight line height" },
          "normal": { "value": "1.5", "type": "lineHeight", "description": "Normal line height" },
          "relaxed": { "value": "1.75", "type": "lineHeight", "description": "Relaxed line height" }
        }
      },
      "borderRadius": {
        "none": { "value": "0px", "type": "borderRadius", "description": "No radius" },
        "sm": { "value": "4px", "type": "borderRadius", "description": "Small radius" },
        "base": { "value": "8px", "type": "borderRadius", "description": "Base radius" },
        "md": { "value": "12px", "type": "borderRadius", "description": "Medium radius" },
        "lg": { "value": "16px", "type": "borderRadius", "description": "Large radius" },
        "button": { "value": "25px", "type": "borderRadius", "description": "Button radius - signature Määk Mood style" },
        "full": { "value": "50%", "type": "borderRadius", "description": "Full circle" }
      },
      "boxShadow": {
        "sm": { "value": "0 1px 2px 0 rgba(0, 0, 0, 0.05)", "type": "boxShadow", "description": "Small shadow" },
        "base": { "value": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", "type": "boxShadow", "description": "Base shadow" },
        "md": { "value": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", "type": "boxShadow", "description": "Medium shadow" },
        "lg": { "value": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", "type": "boxShadow", "description": "Large shadow" },
        "button": { "value": "0 2px 4px 0 rgba(255, 107, 107, 0.2)", "type": "boxShadow", "description": "Button shadow with coral tint" }
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
            Back
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <Info className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Export Flow Explained</h1>
            <h2 className="text-xl mb-2">The Correct Direction: App → Figma</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Understanding why you couldn't export from Figma and how our design system actually works.
            </p>
          </div>
        </div>

        {/* Problem Explanation */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Why There Was "Nothing to Export" in Figma</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <h4 className="font-medium mb-2">The Issue:</h4>
                <p className="text-sm text-gray-600 mb-3">
                  You tried to export from Figma, but there was no Määk Mood design system content in Figma yet! 
                  That's because our design system lives in the app and needs to be exported TO Figma, not FROM Figma.
                </p>
                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                  <strong>Wrong Direction:</strong> Figma (empty) → Export → Nothing
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 text-red-600">
                <Figma className="w-8 h-8" />
                <span className="text-lg">📤</span>
                <ArrowRight className="w-6 h-6" />
                <span className="text-lg">❌ Empty</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Correct Flow */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>The Correct Flow: App → JSON → Figma</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4 text-green-600">
                <Smartphone className="w-8 h-8" />
                <ArrowRight className="w-6 h-6" />
                <Download className="w-6 h-6" />
                <ArrowRight className="w-6 h-6" />
                <Figma className="w-8 h-8" />
              </div>
              <p className="text-center text-green-600 font-medium">
                Määk Mood App → JSON Export → Figma Import = ✅ CORRECT
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h5 className="font-medium mb-2">1. Start from App</h5>
                  <p className="text-sm text-gray-600">
                    Your Määk Mood app contains the complete design system with colors, typography, and spacing.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <Download className="w-6 h-6" />
                  </div>
                  <h5 className="font-medium mb-2">2. Export to JSON</h5>
                  <p className="text-sm text-gray-600">
                    Use our export tools to generate design tokens in JSON format compatible with Figma.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                    <Figma className="w-6 h-6" />
                  </div>
                  <h5 className="font-medium mb-2">3. Import to Figma</h5>
                  <p className="text-sm text-gray-600">
                    Use Design System Tokens plugin in Figma to import the JSON and create variables.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You Get */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>What This Export Contains</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">🎨 Colors (21 variables)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FF6B6B' }}></div>
                    <span>Primary coral shades (50-600)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4ECDC4' }}></div>
                    <span>Secondary teal shades (50-600)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9E9E9E' }}></div>
                    <span>Neutral grays (0-900)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">📏 Spacing & Layout</h4>
                <div className="space-y-2 text-sm">
                  <div>• 7 spacing tokens (xs: 4px → 3xl: 64px)</div>
                  <div>• 7 border radius values</div>
                  <div>• 5 box shadow definitions</div>
                  <div>• Special button radius (25px)</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">🔤 Typography</h4>
                <div className="space-y-2 text-sm">
                  <div>• Poppins font family + fallback</div>
                  <div>• 8 font sizes (xs: 12px → 4xl: 36px)</div>
                  <div>• 4 font weights (400-700)</div>
                  <div>• 3 line heights (tight, normal, relaxed)</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">✨ Special Features</h4>
                <div className="space-y-2 text-sm">
                  <div>• Coral-tinted button shadows</div>
                  <div>• Signature 25px button radius</div>
                  <div>• Complete naming convention</div>
                  <div>• Descriptive token metadata</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ready to Export */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Ready to Export? Here's Your JSON</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              This is the complete Määk Mood design system in JSON format. Copy this and import it into Figma using the Design System Tokens plugin:
            </p>

            <div className="bg-gray-100 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
{JSON.stringify(designTokens, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={() => copyToClipboard(JSON.stringify(designTokens, null, 2), "complete-tokens")}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copiedItems.includes("complete-tokens") ? "Copied!" : "Copy JSON"}
              </Button>

              <Button 
                variant="outline"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(designTokens, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'maak-mood-design-tokens.json';
                  a.click();
                }}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>

              <Button 
                variant="outline"
                onClick={() => window.open("https://www.figma.com/design/dGTopC2LlR02zxB9xP5x8B/TIDE", "_blank")}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Figma
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step by Step */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Start: Import to Figma Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Copy the JSON above</h4>
                  <p className="text-sm text-gray-600">
                    Click "Copy JSON" to get all Määk Mood design tokens
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Open Figma Design System Tokens plugin</h4>
                  <p className="text-sm text-gray-600">
                    In your TIDE Figma file: Resources → Plugins → "Design System Tokens"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Configure the plugin</h4>
                  <p className="text-sm text-gray-600">
                    Change "TIDE Export" → "Määk Mood Design System" and "DSY" → "MMD"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Import the JSON</h4>
                  <p className="text-sm text-gray-600">
                    Click "Import" in plugin → Select JSON → Paste token data → Import
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium text-green-700">Done!</h4>
                  <p className="text-sm text-gray-600">
                    You now have all Määk Mood colors, typography, and spacing variables in Figma
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Need More Help?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-700 mb-4">
                We have detailed step-by-step guides with screenshots and troubleshooting tips.
              </p>
              <Button 
                variant="outline"
                onClick={onStartGuide}
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Play className="w-4 h-4 mr-2" />
                Step-by-Step Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-teal-50 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-800 flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Advanced Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-teal-700 mb-4">
                Explore more export options, component generators, and automated tools.
              </p>
              <Button 
                variant="outline"
                onClick={() => window.location.href = "#export"}
                className="w-full border-teal-300 text-teal-700 hover:bg-teal-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Tools
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-medium text-lg mb-2">🎉 Summary</h3>
              <p className="text-sm text-gray-700 mb-4">
                The confusion was simple: you tried to export from an empty Figma file. 
                The Määk Mood design system lives in this app and needs to be exported TO Figma, not FROM it.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="bg-primary/20 text-primary">App-First Design System</Badge>
                <Badge className="bg-secondary/20 text-secondary">21 Color Variables</Badge>
                <Badge className="bg-purple-100 text-purple-700">Complete Typography</Badge>
                <Badge className="bg-green-100 text-green-700">Production Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}