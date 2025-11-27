import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Shield, Download, Trash2, Eye, Target, MapPin, Bell, Users, Lock } from "lucide-react";
import { usePrivacy, UserConsent, DataExportRequest, DataDeletionRequest } from "../utils/privacy";
import { analytics } from "../utils/analytics";

interface PrivacySettingsProps {
  userId: string;
  userEmail: string;
  onBack: () => void;
}

export function PrivacySettings({ userId, userEmail, onBack }: PrivacySettingsProps) {
  const { getUserConsent, updateConsent, requestDataExport, requestDataDeletion } = usePrivacy();
  const [consent, setConsent] = useState<UserConsent | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const currentConsent = getUserConsent();
    setConsent(currentConsent);
  }, []);

  const handleConsentChange = async (key: keyof UserConsent, value: boolean) => {
    if (!consent) return;

    const updatedConsent = { ...consent, [key]: value };
    setLoading(true);

    try {
      const success = await updateConsent(updatedConsent);
      if (success) {
        setConsent(updatedConsent);
        analytics.updateConsent(updatedConsent);
        analytics.track('privacy_setting_changed', { setting: key, value });
      }
    } catch (error) {
      console.error('Failed to update consent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async () => {
    setExportLoading(true);
    try {
      const request: DataExportRequest = {
        userId,
        requestType: 'full',
        format: 'json',
        email: userEmail
      };

      const success = await requestDataExport(request);
      if (success) {
        analytics.track('data_export_requested');
        alert('Din dataexport har begärts. Du kommer att få en e-post inom 30 dagar.');
      } else {
        alert('Något gick fel. Försök igen senare.');
      }
    } catch (error) {
      console.error('Export request failed:', error);
      alert('Något gick fel. Försök igen senare.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    setDeleteLoading(true);
    try {
      const request: DataDeletionRequest = {
        userId,
        reason: 'User requested deletion',
        keepMatchData: false,
        email: userEmail
      };

      const success = await requestDataDeletion(request);
      if (success) {
        analytics.track('data_deletion_requested');
        // User will be logged out automatically
      }
    } catch (error) {
      console.error('Deletion request failed:', error);
      alert('Något gick fel. Försök igen senare.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!consent) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Laddar integritetsinställningar...</p>
        </div>
      </div>
    );
  }

  const privacyItems = [
    {
      key: 'analytics' as keyof UserConsent,
      icon: Eye,
      title: 'Analytics och förbättringar',
      description: 'Hjälper oss förstå hur appen används',
      category: 'Data'
    },
    {
      key: 'marketing' as keyof UserConsent,
      icon: Target,
      title: 'Marknadsföring',
      description: 'Personliga erbjudanden och tips',
      category: 'Marknadsföring'
    },
    {
      key: 'locationTracking' as keyof UserConsent,
      icon: MapPin,
      title: 'Platsspårning',
      description: 'Mer exakta avståndsberäkningar',
      category: 'Plats'
    },
    {
      key: 'personalizedAds' as keyof UserConsent,
      icon: Target,
      title: 'Personaliserad reklam',
      description: 'Reklam anpassad efter dina intressen',
      category: 'Marknadsföring'
    },
    {
      key: 'thirdPartySharing' as keyof UserConsent,
      icon: Share2,
      title: 'Datadelning med tredje part',
      description: 'Dela anonymiserad data med partners',
      category: 'Data'
    }
  ];

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          ←
        </Button>
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl">Integritet & Data</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Consent Overview */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Samtyckesstatus</h2>
            <Badge variant="outline" className="text-xs">
              v{consent.version}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Senast uppdaterad: {new Date(consent.timestamp).toLocaleDateString('sv-SE')}
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-sm font-medium text-green-800">Aktiva</div>
              <div className="text-lg font-bold text-green-600">
                {Object.entries(consent).filter(([key, value]) => 
                  key !== 'timestamp' && key !== 'version' && value === true
                ).length}
              </div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-medium text-gray-600">Inaktiva</div>
              <div className="text-lg font-bold text-gray-500">
                {Object.entries(consent).filter(([key, value]) => 
                  key !== 'timestamp' && key !== 'version' && value === false
                ).length}
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy Controls */}
        <Card className="p-4">
          <h2 className="font-medium mb-4">Datainställningar</h2>
          
          <div className="space-y-4">
            {privacyItems.map((item, index) => {
              const Icon = item.icon;
              const isEnabled = consent[item.key] as boolean;
              
              return (
                <div key={item.key}>
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h3 className="text-sm font-medium">{item.title}</h3>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(value) => handleConsentChange(item.key, value)}
                          disabled={loading || item.key === 'functional'}
                        />
                      </div>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  {index < privacyItems.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Functional Notice */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Lock className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Grundläggande funktioner
              </h3>
              <p className="text-xs text-blue-700">
                Vissa funktioner är alltid aktiva för att appen ska fungera korrekt, 
                som autentisering och säkerhetsåtgärder.
              </p>
            </div>
          </div>
        </Card>

        {/* Data Rights */}
        <Card className="p-4">
          <h2 className="font-medium mb-4">Dina dataärgörheter</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="text-sm font-medium">Exportera min data</h3>
                  <p className="text-xs text-gray-600">
                    Få en kopia av all din data
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDataExport}
                disabled={exportLoading}
              >
                {exportLoading ? 'Skickar...' : 'Exportera'}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div>
                  <h3 className="text-sm font-medium">Radera mitt konto</h3>
                  <p className="text-xs text-gray-600">
                    Permanent borttagning av all data
                  </p>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Radera
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Radera mitt konto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Detta kommer permanent ta bort all din data från TIDE, 
                      inklusive profil, matchningar och meddelanden. 
                      Denna åtgärd kan inte ångras.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDataDeletion}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Raderar...' : 'Ja, radera mitt konto'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>

        {/* Help */}
        <Card className="p-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Behöver du hjälp?</h3>
          <p className="text-xs text-gray-600 mb-3">
            Läs mer om hur vi skyddar din integritet och vilka rättigheter du har.
          </p>
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="text-xs justify-start h-auto p-0">
              Integritetspolicy
            </Button>
            <Button variant="ghost" size="sm" className="text-xs justify-start h-auto p-0">
              Användarvillkor
            </Button>
            <Button variant="ghost" size="sm" className="text-xs justify-start h-auto p-0">
              Kontakta support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}