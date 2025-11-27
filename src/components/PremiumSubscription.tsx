import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check, Crown, Star, Zap, Heart, ArrowLeft } from "lucide-react";

interface PremiumSubscriptionProps {
  onBack: () => void;
  onSubscribe: (plan: string) => void;
  currentPlan?: "free" | "premium" | "platinum";
}

const plans = [
  {
    id: "free",
    name: "Basic",
    price: "Gratis",
    period: "",
    popular: false,
    features: [
      "5 matchningar per dag",
      "Standard personlighetsinsikter",
      "Grundläggande chattfunktioner",
      "Community access"
    ],
    limits: [
      "Begränsade filteralternativ",
      "Ingen prioriterad matchning",
      "Ingen röstmeddelanden"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: "149",
    period: "/månad",
    popular: true,
    features: [
      "Obegränsade matchningar",
      "Avancerade personlighetsinsikter",
      "AI Companion för alla konversationer",
      "Röstmeddelanden & videochatt",
      "Prioriterad matchning",
      "Avancerade filter",
      "Se vem som gillar dig",
      "Osynlig läsning"
    ],
    limits: []
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "249",
    period: "/månad",
    popular: false,
    features: [
      "Allt i Premium +",
      "VIP matchningsprioritet",
      "Personlig dating coach (AI)",
      "Realtids kompatibilitetsanalyser",
      "Exklusiva events & meetups",
      "Premium profil badge",
      "Avancerad analytics dashboard",
      "Relationship progress tracking"
    ],
    limits: []
  }
];

export function PremiumSubscription({ onBack, onSubscribe, currentPlan = "free" }: PremiumSubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setLoading(true);
    try {
      // Simulate subscription process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubscribe(planId);
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "premium":
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case "platinum":
        return <Star className="w-6 h-6 text-purple-500" />;
      default:
        return <Heart className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Button>
          
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <Crown className="w-8 h-8" />
            </div>
            <h1 className="text-2xl text-primary mb-2">Välj din plan</h1>
            <p className="text-gray-600 text-sm">
              Upptäck dina perfekta matchningar med premium-funktioner
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === plan.id 
                  ? "ring-2 ring-primary shadow-lg" 
                  : "hover:shadow-md"
              } ${
                plan.popular ? "border-primary" : ""
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1">
                  <span className="text-xs font-medium flex items-center justify-center">
                    <Zap className="w-3 h-3 mr-1" />
                    MEST POPULÄR
                  </span>
                </div>
              )}
              
              <CardHeader className={`${plan.popular ? "pt-8" : "pt-4"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getPlanIcon(plan.id)}
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-primary">
                          {plan.price === "Gratis" ? plan.price : `${plan.price} kr`}
                        </span>
                        <span className="text-sm text-gray-500">{plan.period}</span>
                      </div>
                    </div>
                  </div>
                  
                  {currentPlan === plan.id && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Nuvarande
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Inkluderat:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.limits.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Begränsningar:</h4>
                      <ul className="space-y-1">
                        {plan.limits.map((limit, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-500">
                            <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex-shrink-0" />
                            {limit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPlan !== currentPlan && (
          <div className="space-y-4">
            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90 rounded-[25px]"
              onClick={() => handleSubscribe(selectedPlan)}
              disabled={loading}
            >
              {loading ? (
                "Behandlar..."
              ) : selectedPlan === "free" ? (
                "Växla till Basic"
              ) : (
                `Uppgradera till ${plans.find(p => p.id === selectedPlan)?.name}`
              )}
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5">
                  i
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Ingen bindningstid</p>
                  <p>Avsluta prenumerationen när som helst. Första månaden får du 50% rabatt!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            Genom att prenumerera godkänner du våra{" "}
            <span className="text-primary underline">användarvillkor</span> och{" "}
            <span className="text-primary underline">automatisk förnyelse</span>.
          </p>
        </div>
      </div>
    </div>
  );
}