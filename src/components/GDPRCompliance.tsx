import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { gdprAnalytics, GDPRComplianceStatus, UserConsent, UserDataExport } from '../utils/gdpr-analytics';

interface GDPRComplianceProps {
  onBack: () => void;
  userId?: string;
}

export function GDPRCompliance({ onBack, userId = 'demo-user' }: GDPRComplianceProps) {
  const [complianceStatus, setComplianceStatus] = useState<GDPRComplianceStatus | null>(null);
  const [userConsent, setUserConsent] = useState<UserConsent>({
    analytics: false,
    marketing: false,
    personalization: false,
    performance: false,
    timestamp: new Date(),
    version: '2.0.0'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [exportData, setExportData] = useState<UserDataExport | null>(null);
  const [showExportData, setShowExportData] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<string>('');

  useEffect(() => {
    loadComplianceStatus();
    loadUserConsent();
  }, []);

  const loadComplianceStatus = () => {
    const status = gdprAnalytics.assessCompliance();
    setComplianceStatus(status);
  };

  const loadUserConsent = () => {
    // Load from localStorage or API
    const savedConsent = localStorage.getItem('maak-user-consent');
    if (savedConsent) {
      try {
        const consent = JSON.parse(savedConsent);
        setUserConsent(consent);
      } catch (error) {
        console.error('Failed to load user consent:', error);
      }
    }
  };

  const updateConsent = (field: keyof UserConsent, value: boolean | string | Date) => {
    const updatedConsent = {
      ...userConsent,
      [field]: value,
      timestamp: new Date()
    };
    
    setUserConsent(updatedConsent);
    
    // Save consent
    localStorage.setItem('maak-user-consent', JSON.stringify(updatedConsent));
    gdprAnalytics.recordConsent(userId, updatedConsent);
    
    // Reinitialize analytics with new consent
    gdprAnalytics.initialize(updatedConsent);
    
    // Reload compliance status
    loadComplianceStatus();
  };

  const exportUserData = async () => {
    setIsLoading(true);
    try {
      const data = await gdprAnalytics.exportUserData(userId);
      setExportData(data);
      setShowExportData(true);
    } catch (error) {
      console.error('Failed to export user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserData = async () => {
    if (!window.confirm('Är du säker på att du vill radera all din data? Detta kan inte ångras.')) {
      return;
    }

    setIsLoading(true);
    setDeletionStatus('Raderar användardata...');
    
    try {
      await gdprAnalytics.deleteUserData(userId, 'user_request');
      setDeletionStatus('All användardata har raderats framgångsrikt.');
      
      // Clear local storage
      localStorage.removeItem('maak-user-consent');
      localStorage.removeItem('maak-user-session');
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      setDeletionStatus('Fel vid radering av data: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadExportData = () => {
    if (!exportData) return;

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `maak-mood-data-export-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'non-compliant':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceText = (status: string) => {
    switch (status) {
      case 'compliant': return 'Efterlever';
      case 'needs-review': return 'Behöver granskas';
      case 'non-compliant': return 'Ej efterlevnad';
      default: return 'Okänd';
    }
  };

  const getComplianceScore = () => {
    if (!complianceStatus) return 0;
    
    const statuses = [
      complianceStatus.consentManagement,
      complianceStatus.dataMinimization,
      complianceStatus.retentionPolicies,
      complianceStatus.userRights,
      complianceStatus.dataProtection
    ];
    
    const compliantCount = statuses.filter(s => s === 'compliant').length;
    return Math.round((compliantCount / statuses.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Tillbaka
            </Button>
            <h1 className="font-medium">GDPR Efterlevnad</h1>
            <div></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Compliance Overview */}
          {complianceStatus && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Efterlevnadsstatus</h2>
                <Badge className={getComplianceColor(complianceStatus.overallCompliance)}>
                  {getComplianceText(complianceStatus.overallCompliance)}
                </Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Totala efterlevnadspoäng</span>
                  <span className={getComplianceScore() >= 80 ? 'text-green-600' : 
                                  getComplianceScore() >= 60 ? 'text-yellow-600' : 'text-red-600'}>
                    {getComplianceScore()}/100
                  </span>
                </div>
                <Progress value={getComplianceScore()} className="h-2" />
              </div>

              <div className="text-xs text-gray-500">
                Senast granskad: {complianceStatus.lastAudit.toLocaleString('sv-SE')}
              </div>
            </Card>
          )}

          {/* Detailed Compliance Areas */}
          {complianceStatus && (
            <Card className="p-4">
              <h3 className="font-medium mb-4">Efterlevnadsområden</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Samtyckeshantering</span>
                  <Badge className={getComplianceColor(complianceStatus.consentManagement)}>
                    {getComplianceText(complianceStatus.consentManagement)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dataminimering</span>
                  <Badge className={getComplianceColor(complianceStatus.dataMinimization)}>
                    {getComplianceText(complianceStatus.dataMinimization)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lagringspolicyer</span>
                  <Badge className={getComplianceColor(complianceStatus.retentionPolicies)}>
                    {getComplianceText(complianceStatus.retentionPolicies)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Användarrättigheter</span>
                  <Badge className={getComplianceColor(complianceStatus.userRights)}>
                    {getComplianceText(complianceStatus.userRights)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dataskydd</span>
                  <Badge className={getComplianceColor(complianceStatus.dataProtection)}>
                    {getComplianceText(complianceStatus.dataProtection)}
                  </Badge>
                </div>
              </div>
            </Card>
          )}

          {/* User Consent Management */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Dina Samtycken</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Analytics & Statistik</div>
                  <div className="text-xs text-gray-600">Hjälper oss förbättra appen</div>
                </div>
                <Switch
                  checked={userConsent.analytics}
                  onCheckedChange={(checked) => updateConsent('analytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Marknadsföring</div>
                  <div className="text-xs text-gray-600">Personliga erbjudanden och tips</div>
                </div>
                <Switch
                  checked={userConsent.marketing}
                  onCheckedChange={(checked) => updateConsent('marketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Personalisering</div>
                  <div className="text-xs text-gray-600">Anpassad upplevelse baserat på beteende</div>
                </div>
                <Switch
                  checked={userConsent.personalization}
                  onCheckedChange={(checked) => updateConsent('personalization', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Prestandaanalys</div>
                  <div className="text-xs text-gray-600">Teknisk data för appförbättringar</div>
                </div>
                <Switch
                  checked={userConsent.performance}
                  onCheckedChange={(checked) => updateConsent('performance', checked)}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Samtycke givet: {userConsent.timestamp.toLocaleString('sv-SE')}
                <br />
                Version: {userConsent.version}
              </div>
            </div>
          </Card>

          {/* User Rights */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Dina Rättigheter</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={exportUserData}
                disabled={isLoading}
                className="w-full justify-start"
              >
                {isLoading ? 'Exporterar...' : 'Exportera Min Data'}
              </Button>
              
              <p className="text-xs text-gray-600">
                Ladda ner all data vi har om dig (Artikel 20 - Dataportabilitet)
              </p>

              <Button
                variant="outline"
                onClick={deleteUserData}
                disabled={isLoading}
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              >
                {isLoading ? 'Raderar...' : 'Radera Min Data'}
              </Button>
              
              <p className="text-xs text-gray-600">
                Ta bort all din data permanent (Artikel 17 - Rätt att bli glömd)
              </p>
            </div>

            {deletionStatus && (
              <Alert className={deletionStatus.includes('framgångsrikt') ? 
                'border-green-200 bg-green-50 mt-4' : 
                'border-red-200 bg-red-50 mt-4'
              }>
                <AlertDescription className={deletionStatus.includes('framgångsrikt') ? 
                  'text-green-800' : 'text-red-800'
                }>
                  {deletionStatus}
                </AlertDescription>
              </Alert>
            )}
          </Card>

          {/* Data Export Display */}
          {showExportData && exportData && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Din Dataexport</h3>
                <div className="space-x-2">
                  <Button size="sm" onClick={downloadExportData}>
                    Ladda ner
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowExportData(false)}
                  >
                    Stäng
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono max-h-64 overflow-y-auto">
                <div>Användar-ID: {exportData.userId}</div>
                <div>Exportdatum: {exportData.exportDate.toISOString()}</div>
                <div>Samtyckeshistorik: {exportData.consentHistory.length} poster</div>
                <div>Analytics-händelser: {exportData.analyticsEvents.length} händelser</div>
                <div>Datalagringspolicyer: {exportData.dataRetentionInfo.length} kategorier</div>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div>--- SAMTYCKEN ---</div>
                  {exportData.consentHistory.slice(-3).map((consent, i) => (
                    <div key={i}>
                      {consent.timestamp.toISOString()}: A:{consent.analytics ? 'Y' : 'N'} M:{consent.marketing ? 'Y' : 'N'} P:{consent.personalization ? 'Y' : 'N'}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Recommendations */}
          {complianceStatus && complianceStatus.recommendations.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Rekommendationer</h3>
              <div className="space-y-2">
                {complianceStatus.recommendations.map((rec, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    • {rec}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Data Retention Information */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Datalagring</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Analytics-data:</span>
                <span>2 år</span>
              </div>
              <div className="flex justify-between">
                <span>Profildata:</span>
                <span>7 år</span>
              </div>
              <div className="flex justify-between">
                <span>Meddelanden:</span>
                <span>1 år</span>
              </div>
              <div className="flex justify-between">
                <span>Matchningsdata:</span>
                <span>3 år</span>
              </div>
              <div className="flex justify-between">
                <span>Personlighetsdata:</span>
                <span>5 år</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3">
              Data raderas automatiskt efter lagringsperioden. Du kan begära radering när som helst.
            </p>
          </Card>

          {/* Legal Information */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-sm text-blue-800">
              <strong>Juridisk grund:</strong> MÄÄK Mood behandlar din data enligt GDPR (EU 2016/679). 
              Vi behandlar endast nödvändig data och med ditt samtycke. Du har rätt till tillgång, 
              rättelse, radering och dataportabilitet.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}