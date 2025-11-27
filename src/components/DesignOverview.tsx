import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Heart, 
  MessageCircle, 
  Users, 
  User, 
  Crown, 
  Trophy, 
  Calendar,
  Star,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  Smartphone,
  Palette,
  Type,
  Grid,
  Eye
} from "lucide-react";

interface DesignOverviewProps {
  onBack: () => void;
}

const colorPalette = [
  { name: "Primary", value: "#FF6B6B", description: "Korall - huvudfärg" },
  { name: "Secondary", value: "#4ECDC4", description: "Turkos - komplementfärg" },
  { name: "Background", value: "#FFFFFF", description: "Vit bakgrund" },
  { name: "Surface", value: "#F8F9FA", description: "Ljusgrå ytor" },
  { name: "Text", value: "#2D3436", description: "Mörk text" },
  { name: "Muted", value: "#636E72", description: "Nedtonad text" },
  { name: "Success", value: "#00B894", description: "Grön framgång" },
  { name: "Warning", value: "#FDCB6E", description: "Gul varning" },
  { name: "Error", value: "#E17055", description: "Röd fel" }
];

const screens = [
  {
    id: "welcome",
    title: "Välkomstskärm",
    category: "Auth",
    description: "Första intryck med hero-bild och CTA"
  },
  {
    id: "login",
    title: "Inloggning",
    category: "Auth", 
    description: "Social login + telefonnummer"
  },
  {
    id: "age-verification",
    title: "Åldersverifiering",
    category: "Onboarding",
    description: "20+ verifiering med datumväljare"
  },
  {
    id: "profile-creation",
    title: "Profilskapande",
    category: "Onboarding",
    description: "5-stegs profil med foto-upload"
  },
  {
    id: "personality-test",
    title: "Personlighetstest",
    category: "Onboarding",
    description: "30 frågor med 5 dimensioner"
  },
  {
    id: "mood-checkin",
    title: "Humör Check-in",
    category: "Daily",
    description: "Daglig humörregistrering"
  },
  {
    id: "matching",
    title: "Matchningsystem",
    category: "Core",
    description: "Personlighetsbaserade matchningar"
  },
  {
    id: "chat",
    title: "Chattgränssnitt",
    category: "Core",
    description: "Meddelanden med röstfunktioner"
  },
  {
    id: "premium",
    title: "Premium",
    category: "Monetization",
    description: "Subscription planer och upgrade"
  },
  {
    id: "achievements",
    title: "Prestationer",
    category: "Gamification",
    description: "Achievement system med belöningar"
  },
  {
    id: "community",
    title: "Community",
    category: "Social",
    description: "Dagliga frågor och diskussioner"
  },
  {
    id: "profile",
    title: "Profil & Inställningar",
    category: "Account",
    description: "Användardata och konfiguration"
  }
];

const components = [
  {
    name: "Button Primary",
    description: "Huvudknappar med rounded-[25px]",
    example: "Skapa konto, Nästa, Slutför"
  },
  {
    name: "Button Secondary", 
    description: "Sekundära actions med outline",
    example: "Tillbaka, Hoppa över, Avbryt"
  },
  {
    name: "Cards",
    description: "Vita kort med border-radius 10px",
    example: "Matchningar, Meddelanden, Inställningar"
  },
  {
    name: "Progress Bars",
    description: "Visuella framstegsindikatorer",
    example: "Profil completion, Onboarding steps"
  },
  {
    name: "Badges",
    description: "Status och kategorisering",
    example: "Premium, Gjort, Rarity levels"
  },
  {
    name: "Sliders",
    description: "Custom styled för humör rating",
    example: "Energy, Motivation, Social mood"
  },
  {
    name: "Navigation Tabs",
    description: "Bottom navigation med ikoner",
    example: "Matches, Chats, Community, Profile"
  },
  {
    name: "Gradients",
    description: "Från primary till secondary",
    example: "Backgrounds, Buttons, Achievement rarities"
  }
];

export function DesignOverview({ onBack }: DesignOverviewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "screens" | "components" | "colors" | "typography">("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Brand Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Brand Identity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl mx-auto mb-4">
                    M
                  </div>
                  <h1 className="text-3xl font-bold text-primary mb-2">Määk Mood</h1>
                  <p className="text-gray-600">Äkta kopplingar börjar här</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Värden</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Äkthet över utseende</li>
                      <li>• Personlighet först</li>
                      <li>• Djupare kopplingar</li>
                      <li>• Kvalitet före kvantitet</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Målgrupp</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 20+ år gamla</li>
                      <li>• Seriösa relationer</li>
                      <li>• Personlighetsfokuserade</li>
                      <li>• Premium-medvetna</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Design Principles */}
            <Card>
              <CardHeader>
                <CardTitle>Designprinciper</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Minimalistisk & Clean</h4>
                        <p className="text-sm text-gray-600">Fokus på innehåll, inte distraktioner</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Emotionell Design</h4>
                        <p className="text-sm text-gray-600">Färger och former som väcker känslor</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Mobil-First</h4>
                        <p className="text-sm text-gray-600">Optimerad för 375px bredd</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-sm">
                        4
                      </div>
                      <div>
                        <h4 className="font-medium">Tillgänglig</h4>
                        <p className="text-sm text-gray-600">WCAG-kompatibel med hög kontrast</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screen Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Skärm-kategorier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {["Auth", "Onboarding", "Core", "Gamification", "Monetization", "Social"].map((category) => {
                    const categoryScreens = screens.filter(s => s.category === category);
                    return (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-2 flex items-center space-x-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span>{category}</span>
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{categoryScreens.length} skärmar</p>
                        <div className="space-y-1">
                          {categoryScreens.slice(0, 3).map((screen) => (
                            <p key={screen.id} className="text-xs text-gray-500">• {screen.title}</p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "screens":
        return (
          <div className="space-y-4">
            {screens.map((screen) => (
              <Card key={screen.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-medium">{screen.title}</h3>
                        <Badge variant="secondary" className="text-xs">{screen.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{screen.description}</p>
                    </div>
                    <div className="w-12 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded border-2 border-gray-200 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "components":
        return (
          <div className="space-y-6">
            {/* Interactive Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Interaktiva Komponenter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buttons */}
                <div>
                  <h4 className="font-medium mb-3">Knappar</h4>
                  <div className="space-y-3">
                    <Button className="w-full h-12 bg-primary hover:bg-primary/90 rounded-[25px]">
                      Primary Button
                    </Button>
                    <Button variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary/5 rounded-[25px]">
                      Secondary Button
                    </Button>
                    <Button variant="ghost" className="w-full h-12">
                      Ghost Button
                    </Button>
                  </div>
                </div>

                {/* Cards */}
                <div>
                  <h4 className="font-medium mb-3">Kort</h4>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                          <Heart className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium">Kort Exempel</h5>
                          <p className="text-sm text-gray-600">Med ikon och beskrivning</p>
                        </div>
                        <Badge>Badge</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress & Sliders */}
                <div>
                  <h4 className="font-medium mb-3">Progress & Sliders</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Framsteg</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Humör Slider</span>
                        <span className="text-primary font-bold">7</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        defaultValue="7"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <h4 className="font-medium mb-3">Badges & Status</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                    <Badge className="bg-green-100 text-green-800">Gjort</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Rare</Badge>
                    <Badge className="bg-purple-100 text-purple-800">Epic</Badge>
                    <Badge className="bg-orange-100 text-orange-800">Legendary</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Component List */}
            <Card>
              <CardHeader>
                <CardTitle>Komponent Bibliotek</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {components.map((component, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <h4 className="font-medium">{component.name}</h4>
                      <p className="text-sm text-gray-600 mb-1">{component.description}</p>
                      <p className="text-xs text-gray-500">Exempel: {component.example}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "colors":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Färgpalett</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colorPalette.map((color, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg border shadow-sm"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <div>
                        <h4 className="font-medium">{color.name}</h4>
                        <p className="text-sm text-gray-600">{color.description}</p>
                        <p className="text-xs text-gray-500 font-mono">{color.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gradient Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Gradienter</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-16 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center text-white font-medium">
                    Primary → Secondary
                  </div>
                  <div className="h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center text-gray-700">
                    Background Gradient (Light)
                  </div>
                  <div className="h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-medium">
                    Premium Gradient
                  </div>
                  <div className="h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-medium">
                    Achievement Gradient
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility */}
            <Card>
              <CardHeader>
                <CardTitle>Tillgänglighet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Primär på vit</span>
                    <Badge className="bg-green-100 text-green-800">WCAG AA</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Sekundär på vit</span>
                    <Badge className="bg-green-100 text-green-800">WCAG AA</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span>Text på bakgrund</span>
                    <Badge className="bg-green-100 text-green-800">WCAG AAA</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "typography":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Typografi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Typsnitt</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg">Poppins (Primary)</p>
                    <p className="text-sm text-gray-600">Modern, clean, läsbar - perfekt för dating-appen</p>
                    <p className="text-xs text-gray-500 mt-2">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Storlekar & Vikter</h4>
                  <div className="space-y-4">
                    <div>
                      <h1 className="text-4xl font-bold">H1 - 36px Bold</h1>
                      <p className="text-sm text-gray-600">Huvudrubriker, app-namn</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">H2 - 24px Semibold</h2>
                      <p className="text-sm text-gray-600">Sektionsrubriker</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">H3 - 20px Medium</h3>
                      <p className="text-sm text-gray-600">Underrubriker</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">H4 - 18px Medium</h4>
                      <p className="text-sm text-gray-600">Kortrubriker</p>
                    </div>
                    <div>
                      <p className="text-base">Body - 16px Regular</p>
                      <p className="text-sm text-gray-600">Brödtext, beskrivningar</p>
                    </div>
                    <div>
                      <p className="text-sm">Small - 14px Regular</p>
                      <p className="text-sm text-gray-600">Sekundär text</p>
                    </div>
                    <div>
                      <p className="text-xs">Caption - 12px Regular</p>
                      <p className="text-sm text-gray-600">Bildtexter, disclaimers</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Text Hierarki</h4>
                  <div className="p-4 border rounded-lg">
                    <h2 className="text-xl font-semibold text-primary mb-2">Exempel Hierarki</h2>
                    <p className="text-base mb-3">
                      Detta är brödtext som förklarar huvudkonceptet i ett naturligt och läsbart sätt.
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Sekundär information i mindre text med lägre kontrast.
                    </p>
                    <p className="text-xs text-gray-500">
                      Caption text för extra detaljer eller disclaimers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <Palette className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-2">Määk Mood</h1>
            <h2 className="text-xl mb-2">Design System & Style Guide</h2>
            <p className="text-gray-600 text-sm">
              Komplett designspecifikation för Figma implementation
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: "overview", label: "Översikt", icon: Eye },
              { id: "screens", label: "Skärmar", icon: Smartphone },
              { id: "components", label: "Komponenter", icon: Grid },
              { id: "colors", label: "Färger", icon: Palette },
              { id: "typography", label: "Typografi", icon: Type }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center space-x-1"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="pb-6">
          {renderTabContent()}
        </div>

        {/* Figma Export Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Figma Implementation Guide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium">1. Färgvariabler</h4>
                <p>Skapa färgvariabler i Figma för alla färger i paletten</p>
              </div>
              <div>
                <h4 className="font-medium">2. Komponent Bibliotek</h4>
                <p>Bygg återanvändbara komponenter för buttons, cards, badges</p>
              </div>
              <div>
                <h4 className="font-medium">3. Responsiv Design</h4>
                <p>Använd 375px som primär bredd för mobil-design</p>
              </div>
              <div>
                <h4 className="font-medium">4. Prototyping</h4>
                <p>Skapa interaktiva prototyper för användarflöden</p>
              </div>
              <div>
                <h4 className="font-medium">5. Design Tokens</h4>
                <p>Exportera som design tokens för utveckling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}