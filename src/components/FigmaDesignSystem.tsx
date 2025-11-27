import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Type, 
  Grid, 
  Smartphone,
  Monitor,
  Tablet,
  ArrowLeft,
  Code,
  Figma,
  Layers,
  Component,
  Settings,
  Eye,
  Zap
} from "lucide-react";

interface FigmaDesignSystemProps {
  onBack: () => void;
}

// Figma Design Tokens
const designTokens = {
  colors: {
    primary: {
      50: "#FFF5F5",
      100: "#FFE3E3", 
      200: "#FFCACA",
      300: "#FF9C9C",
      400: "#FF6B6B", // Main
      500: "#FF5252",
      600: "#FF1744",
      700: "#D50000",
      800: "#B71C1C",
      900: "#880E4F"
    },
    secondary: {
      50: "#E0F7FA",
      100: "#B2EBF2",
      200: "#80DEEA", 
      300: "#4DD0E1",
      400: "#4ECDC4", // Main
      500: "#00BCD4",
      600: "#00ACC1",
      700: "#0097A7",
      800: "#00838F",
      900: "#006064"
    },
    neutral: {
      0: "#FFFFFF",
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121"
    }
  },
  typography: {
    fontFamily: "'Poppins', system-ui, -apple-system, sans-serif",
    fontSize: {
      xs: "12px",
      sm: "14px", 
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px",
      "5xl": "48px"
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75
    }
  },
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px", 
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px"
  },
  borderRadius: {
    none: "0px",
    sm: "4px",
    base: "8px", 
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "32px",
    full: "9999px"
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
};

// Component Library
const figmaComponents = [
  {
    name: "Button Primary",
    category: "Actions",
    variants: ["Default", "Hover", "Active", "Disabled"],
    props: ["size", "variant", "disabled", "loading"],
    figmaFrame: "btn-primary"
  },
  {
    name: "Button Secondary", 
    category: "Actions",
    variants: ["Default", "Hover", "Active", "Disabled"],
    props: ["size", "variant", "disabled"],
    figmaFrame: "btn-secondary"
  },
  {
    name: "Input Field",
    category: "Forms",
    variants: ["Default", "Focus", "Error", "Disabled"],
    props: ["placeholder", "error", "disabled", "type"],
    figmaFrame: "input-field"
  },
  {
    name: "Card",
    category: "Layout",
    variants: ["Default", "Hover", "Selected"],
    props: ["padding", "shadow", "border"],
    figmaFrame: "card-component"
  },
  {
    name: "Profile Avatar",
    category: "Data Display", 
    variants: ["Small", "Medium", "Large", "Extra Large"],
    props: ["size", "src", "fallback"],
    figmaFrame: "avatar-component"
  },
  {
    name: "Match Card",
    category: "Specific",
    variants: ["Default", "Liked", "Passed"],
    props: ["profile", "compatibility", "actions"],
    figmaFrame: "match-card"
  },
  {
    name: "Chat Message",
    category: "Communication",
    variants: ["Sent", "Received", "System"],
    props: ["message", "timestamp", "sender"],
    figmaFrame: "chat-message"
  },
  {
    name: "Navigation Tab",
    category: "Navigation",
    variants: ["Active", "Inactive", "With Badge"],
    props: ["label", "icon", "badge", "active"],
    figmaFrame: "nav-tab"
  }
];

// Screen Templates
const screenTemplates = [
  {
    name: "Welcome Screen",
    category: "Auth",
    description: "Landing page with hero image and CTAs",
    figmaFrame: "screen-welcome",
    components: ["Hero Image", "Logo", "Primary Button", "Secondary Button", "Legal Text"]
  },
  {
    name: "Login Screen", 
    category: "Auth",
    description: "Authentication with social and email options",
    figmaFrame: "screen-login",
    components: ["Input Field", "Button Primary", "Social Login", "Divider"]
  },
  {
    name: "Onboarding Flow",
    category: "Onboarding", 
    description: "Multi-step profile creation process",
    figmaFrame: "screen-onboarding",
    components: ["Progress Bar", "Step Indicator", "Form Fields", "Navigation"]
  },
  {
    name: "Matching Interface",
    category: "Core",
    description: "Main matching screen with personality-based suggestions",
    figmaFrame: "screen-matching",
    components: ["Match Card", "Action Buttons", "Compatibility Score", "AI Suggestions"]
  },
  {
    name: "Chat Interface",
    category: "Communication",
    description: "Real-time messaging with voice features",
    figmaFrame: "screen-chat", 
    components: ["Message Bubble", "Input Field", "Voice Recorder", "Emoji Picker"]
  },
  {
    name: "Profile Screen",
    category: "Account",
    description: "User profile management and settings",
    figmaFrame: "screen-profile",
    components: ["Profile Header", "Stats Cards", "Settings List", "Action Buttons"]
  }
];

export function FigmaDesignSystem({ onBack }: FigmaDesignSystemProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToken(label);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const generateFigmaTokens = () => {
    return `
{
  "global": {
    "colors": {
      "primary": {
        "value": "#FF6B6B",
        "type": "color"
      },
      "secondary": {
        "value": "#4ECDC4", 
        "type": "color"
      }
    },
    "typography": {
      "font-family": {
        "value": "Poppins",
        "type": "fontFamily"
      }
    },
    "border-radius": {
      "button": {
        "value": "25px",
        "type": "borderRadius"
      }
    }
  }
}`;
  };

  const generateCSSVariables = () => {
    return `
:root {
  /* Colors */
  --color-primary: #FF6B6B;
  --color-secondary: #4ECDC4;
  --color-background: #FFFFFF;
  --color-surface: #F8F9FA;
  
  /* Typography */
  --font-family: 'Poppins', system-ui, sans-serif;
  --font-size-base: 16px;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-button: 25px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold text-primary mb-2">Määk Mood Design System</h1>
            <h2 className="text-xl mb-2">Figma Implementation Ready</h2>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto">
              Komplett design system med tokens, komponenter och templates för direkt import till Figma. 
              Strukturerat enligt professionella designstandarder.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => copyToClipboard(generateFigmaTokens(), "figma-tokens")}
            >
              <Download className="w-4 h-4 mr-2" />
              {copiedToken === "figma-tokens" ? "Kopierat!" : "Export Figma Tokens"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => copyToClipboard(generateCSSVariables(), "css-vars")}
            >
              <Code className="w-4 h-4 mr-2" />
              {copiedToken === "css-vars" ? "Kopierat!" : "CSS Variables"}
            </Button>
            <Button variant="outline">
              <Figma className="w-4 h-4 mr-2" />
              Open in Figma
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Översikt</span>
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Tokens</span>
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Component className="w-4 h-4" />
              <span className="hidden sm:inline">Komponenter</span>
            </TabsTrigger>
            <TabsTrigger value="screens" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Skärmar</span>
            </TabsTrigger>
            <TabsTrigger value="responsive" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Responsiv</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Brand Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Brand Identity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3">
                      M
                    </div>
                    <h3 className="font-bold text-primary mb-1">Määk Mood</h3>
                    <p className="text-sm text-gray-600 mb-3">Äkta kopplingar börjar här</p>
                    
                    <div className="flex justify-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#FF6B6B' }}></div>
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#4ECDC4' }}></div>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">Modern Dating</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Design Principles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Design Principles</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Minimalistisk & Clean</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm">Emotionell Design</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">Mobil-First Approach</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <span className="text-sm">Tillgänglig för alla</span>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Grid className="w-5 h-5" />
                    <span>System Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Komponenter</span>
                      <span className="font-medium">{figmaComponents.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Skärm-templates</span>
                      <span className="font-medium">{screenTemplates.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Färg-tokens</span>
                      <span className="font-medium">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Typografi-tokens</span>
                      <span className="font-medium">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Implementation Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Figma Implementation Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">1. Setup Design Tokens</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Importera färg-variabler från Tokens-fliken</li>
                      <li>• Sätt upp typografi-stilar enligt specifikation</li>
                      <li>• Konfigurera border-radius och spacing-tokens</li>
                      <li>• Använd CSS export för utveckling</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">2. Bygg Komponent-bibliotek</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Skapa Master-komponenter för varje UI-element</li>
                      <li>• Definiera variants och properties</li>
                      <li>• Använd Auto Layout för responsiv design</li>
                      <li>• Testa alla interaktions-states</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Design Tokens Tab */}
          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Färg-palette</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Primary (Korall)</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(designTokens.colors.primary).slice(0, 5).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div 
                              className="w-full h-12 rounded-md border cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: value }}
                              onClick={() => copyToClipboard(value, `primary-${key}`)}
                            ></div>
                            <p className="text-xs mt-1">{key}</p>
                            <p className="text-xs text-gray-500 font-mono">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Secondary (Turkos)</h4>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.entries(designTokens.colors.secondary).slice(0, 5).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div 
                              className="w-full h-12 rounded-md border cursor-pointer hover:scale-105 transition-transform"
                              style={{ backgroundColor: value }}
                              onClick={() => copyToClipboard(value, `secondary-${key}`)}
                            ></div>
                            <p className="text-xs mt-1">{key}</p>
                            <p className="text-xs text-gray-500 font-mono">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Typography */}
              <Card>
                <CardHeader>
                  <CardTitle>Typografi-system</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Font Family</h4>
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">{designTokens.typography.fontFamily}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Font Sizes</h4>
                      <div className="space-y-2">
                        {Object.entries(designTokens.typography.fontSize).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm">{key}</span>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spacing & Border Radius */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing-system</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(designTokens.spacing).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="bg-primary rounded"
                            style={{ width: value, height: value, minWidth: '4px', minHeight: '4px' }}
                          ></div>
                          <span className="text-sm">{key}</span>
                        </div>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Border Radius</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(designTokens.borderRadius).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-8 h-8 bg-primary"
                            style={{ borderRadius: value }}
                          ></div>
                          <span className="text-sm">{key}</span>
                        </div>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {figmaComponents.map((component, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{component.name}</CardTitle>
                      <Badge variant="outline">{component.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Variants</h5>
                        <div className="flex flex-wrap gap-1">
                          {component.variants.map((variant) => (
                            <Badge key={variant} variant="secondary" className="text-xs">
                              {variant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-sm mb-2">Properties</h5>
                        <div className="text-xs text-gray-600 space-y-1">
                          {component.props.map((prop) => (
                            <div key={prop} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              <span>{prop}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => copyToClipboard(component.figmaFrame, component.name)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedToken === component.name ? "Kopierat!" : "Copy Frame"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Screens Tab */}
          <TabsContent value="screens" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {screenTemplates.map((screen, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{screen.name}</CardTitle>
                      <Badge variant="outline">{screen.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{screen.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-medium text-sm mb-2">Inkluderade komponenter:</h5>
                      <div className="flex flex-wrap gap-1">
                        {screen.components.map((comp) => (
                          <Badge key={comp} variant="secondary" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => copyToClipboard(screen.figmaFrame, screen.name)}
                    >
                      <Figma className="w-4 h-4 mr-2" />
                      {copiedToken === screen.name ? "Kopierat!" : "Open in Figma"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Responsive Tab */}
          <TabsContent value="responsive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>Mobile (375px)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="w-full h-32 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Mobile Layout</span>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Primary target device</li>
                    <li>• Touch-optimized (44px+ targets)</li>
                    <li>• Single column layout</li>
                    <li>• Bottom navigation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tablet className="w-5 h-5" />
                    <span>Tablet (768px)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="w-full h-32 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Tablet Layout</span>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Expanded content areas</li>
                    <li>• Two-column possibilities</li>
                    <li>• Larger touch targets</li>
                    <li>• Side navigation option</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5" />
                    <span>Desktop (1024px+)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <div className="w-full h-32 bg-white rounded border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Desktop Layout</span>
                    </div>
                  </div>
                  <ul className="text-sm space-y-1">
                    <li>• Multi-column layouts</li>
                    <li>• Hover interactions</li>
                    <li>• Keyboard navigation</li>
                    <li>• Advanced features</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Figma Design Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    JSON-format för direkt import i Figma Tokens plugin
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                    <pre className="text-xs font-mono">{generateFigmaTokens().trim()}</pre>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => copyToClipboard(generateFigmaTokens(), "figma-export")}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedToken === "figma-export" ? "Kopierat!" : "Copy Figma Tokens"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>CSS Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    CSS-variabler för utveckling och implementation
                  </p>
                  <div className="bg-gray-100 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                    <pre className="text-xs font-mono">{generateCSSVariables().trim()}</pre>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => copyToClipboard(generateCSSVariables(), "css-export")}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    {copiedToken === "css-export" ? "Kopierat!" : "Copy CSS Variables"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Export Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Export & Implementation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Figma Setup</h4>
                    <ol className="text-sm space-y-2 list-decimal list-inside">
                      <li>Installera Figma Tokens plugin</li>
                      <li>Importera JSON-tokens från Export-sektionen</li>
                      <li>Skapa Master-komponenter enligt specifikation</li>
                      <li>Använd Auto Layout för responsivitet</li>
                      <li>Testa alla variants och states</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Development Handoff</h4>
                    <ol className="text-sm space-y-2 list-decimal list-inside">
                      <li>Export CSS variables till globals.css</li>
                      <li>Konfigurera Tailwind med custom tokens</li>
                      <li>Implementera komponenter enligt spec</li>
                      <li>Testa responsivitet på alla devices</li>
                      <li>Validera accessibility compliance</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}