import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { X, Shield, Eye, Target, MapPin, Share2 } from "lucide-react";
import { usePrivacy, UserConsent } from "../utils/privacy";
import { analytics } from "../utils/analytics";

interface ConsentBannerProps {
  onConsentComplete: (consent: UserConsent) => void;
  onDismiss?: () => void;
  showAdvanced?: boolean;
}

export function ConsentBanner({ onConsentComplete, onDismiss, showAdvanced = false }: ConsentBannerProps) {
  const { updateConsent } = usePrivacy();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(showAdvanced);
  const [consent, setConsent] = useState({
    analytics: false,
    marketing: false,
    functional: true, // Always true
    locationTracking: false,
    personalizedAds: false,
    thirdPartySharing: false
  });

  const handleAcceptAll = async () => {
    const fullConsent = {
      ...consent,
      analytics: true,
      marketing: true,
      locationTracking: true,
      personalizedAds: true,
      thirdPartySharing: false // Keep this false by default
    };

    const success = await updateConsent(fullConsent);
    if (success) {
      analytics.initialize(fullConsent);
      analytics.track('consent_given', { type: 'accept_all' });
      onConsentComplete(fullConsent as UserConsent);
    }
  };

  const handleAcceptNecessary = async () => {
    const necessaryOnly = {
      ...consent,
      analytics: false,
      marketing: false,
      locationTracking: false,
      personalizedAds: false,
      thirdPartySharing: false
    };

    const success = await updateConsent(necessaryOnly);
    if (success) {
      analytics.initialize(necessaryOnly);
      analytics.trackCritical('consent_given', { type: 'necessary_only' });
      onConsentComplete(necessaryOnly as UserConsent);
    }
  };

  const handleCustomSave = async () => {
    const success = await updateConsent(consent);
    if (success) {
      analytics.initialize(consent);
      analytics.track('consent_given', { 
        type: 'custom',
        analytics: consent.analytics,
        marketing: consent.marketing,
        locationTracking: consent.locationTracking
      });
      onConsentComplete(consent as UserConsent);
    }
  };

  const consentItems = [
    {
      key: 'analytics' as keyof typeof consent,
      icon: Eye,
      title: 'Analytics och förbättringar',
      description: 'Hjälper oss förstå hur appen används för att förbättra din upplevelse',
      required: false
    },
    {
      key: 'marketing' as keyof typeof consent,
      icon: Target,
      title: 'Marknadsföring',
      description: 'Personliga erbjudanden och tips för bättre matchningar',
      required: false
    },
    {
      key: 'locationTracking' as keyof typeof consent,
      icon: MapPin,
      title: 'Platsspårning',
      description: 'Mer exakta avståndsberäkningar och lokala rekommendationer',
      required: false
    },
    {
      key: 'personalizedAds' as keyof typeof consent,
      icon: Target,
      title: 'Personaliserad reklam',
      description: 'Reklam anpassad efter dina intressen och beteende',
      required: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-t-xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl">Din integritet</h2>
            </div>
            {onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Vi bryr oss om din integritet. Välj vilken data du är bekväm med att dela för att förbättra din TIDE-upplevelse.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Alltid aktiv</span>
              </div>
              <p className="text-xs text-green-700">
                Grundläggande funktioner som är nödvändiga för att appen ska fungera
              </p>
            </div>

            {!showAdvancedSettings ? (
              <div className="space-y-3">
                <Button
                  onClick={handleAcceptAll}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Acceptera alla
                </Button>
                
                <Button
                  onClick={handleAcceptNecessary}
                  variant="outline"
                  className="w-full"
                >
                  Endast nödvändiga
                </Button>

                <Button
                  onClick={() => setShowAdvancedSettings(true)}
                  variant="ghost"
                  className="w-full text-sm"
                >
                  Anpassa inställningar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium">Anpassa dina val</h3>
                
                <div className="space-y-4">
                  {consentItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium">{item.title}</h4>
                            <Switch
                              checked={consent[item.key] as boolean}
                              onCheckedChange={(checked) => 
                                setConsent(prev => ({ ...prev, [item.key]: checked }))
                              }
                              disabled={item.required}
                            />
                          </div>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleCustomSave}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Spara mina val
                  </Button>
                  
                  <Button
                    onClick={() => setShowAdvancedSettings(false)}
                    variant="ghost"
                    className="w-full text-sm"
                  >
                    Tillbaka
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Du kan ändra dessa inställningar när som helst i din profil.{" "}
                <a href="#" className="text-primary underline">
                  Läs mer om vår integritetspolicy
                </a>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}