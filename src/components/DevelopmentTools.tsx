import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { maakDevTools } from '../utils/development-tools-fixed';

interface DevelopmentToolsProps {
  onBack: () => void;
}

export function DevelopmentTools({ onBack }: DevelopmentToolsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [integrationStatus, setIntegrationStatus] = useState(maakDevTools.getIntegrationStatus());
  const [setupResults, setSetupResults] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeSetup, setActiveSetup] = useState<string | null>(null);

  useEffect(() => {
    // Update logs and status
    setLogs(maakDevTools.getLogs());
    setIntegrationStatus(maakDevTools.getIntegrationStatus());
  }, []);

  const setupSingleIntegration = async (integration: string) => {
    setIsLoading(true);
    setActiveSetup(integration);
    
    try {
      let result;
      
      switch (integration) {
        case 'github':
          result = await maakDevTools.setupGitHubIntegration();
          break;
        case 'supabase':
          result = await maakDevTools.setupSupabaseIntegration();
          break;
        case 'prisma':
          result = await maakDevTools.setupPrismaIntegration();
          break;
        case 'openai':
          result = await maakDevTools.setupOpenAIIntegration();
          break;
        case 'react-native':
          result = await maakDevTools.setupReactNativeIntegration();
          break;
        case 'testing':
          result = await maakDevTools.setupTestingFramework();
          break;
        case 'analytics':
          result = await maakDevTools.setupAnalyticsIntegration();
          break;
        default:
          throw new Error('Unknown integration');
      }
      
      setSetupResults([`${integration}: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`]);
      setIntegrationStatus(maakDevTools.getIntegrationStatus());
      setLogs(maakDevTools.getLogs());
      
    } catch (error) {
      setSetupResults([`${integration}: FAILED - ${(error as Error).message}`]);
    } finally {
      setIsLoading(false);
      setActiveSetup(null);
    }
  };

  const setupAllIntegrations = async () => {
    setIsLoading(true);
    setSetupProgress(0);
    setSetupResults([]);
    
    try {
      const progressInterval = setInterval(() => {
        setSetupProgress(prev => Math.min(prev + 10, 90));
      }, 1000);

      const result = await maakDevTools.setupAllIntegrations();
      
      clearInterval(progressInterval);
      setSetupProgress(100);
      
      setSetupResults(result.report);
      setIntegrationStatus(maakDevTools.getIntegrationStatus());
      setLogs(maakDevTools.getLogs());
      
    } catch (error) {
      setSetupResults(['CRITICAL ERROR: ' + (error as Error).message]);
    } finally {
      setIsLoading(false);
      setSetupProgress(0);
    }
  };

  const clearLogs = () => {
    maakDevTools.clearLogs();
    setLogs([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'ready':
      case 'configured':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
      case 'not-ready':
      case 'not-configured':
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Ansluten';
      case 'disconnected': return 'Frånkopplad';
      case 'ready': return 'Redo';
      case 'not-ready': return 'Ej redo';
      case 'configured': return 'Konfigurerad';
      case 'not-configured': return 'Ej konfigurerad';
      case 'active': return 'Aktiv';
      case 'inactive': return 'Inaktiv';
      case 'error': return 'Fel';
      default: return 'Okänd';
    }
  };

  const integrations = [
    { 
      id: 'github', 
      name: 'GitHub Repository', 
      description: 'Versionkontroll och CI/CD',
      status: integrationStatus.github,
      icon: 'GH'
    },
    { 
      id: 'supabase', 
      name: 'Supabase Backend', 
      description: 'Databas och autentisering',
      status: integrationStatus.supabase,
      icon: 'SB'
    },
    { 
      id: 'prisma', 
      name: 'Prisma ORM', 
      description: 'Databasmodellering',
      status: integrationStatus.prisma,
      icon: 'PR'
    },
    { 
      id: 'openai', 
      name: 'OpenAI Integration', 
      description: 'AI Companion funktioner',
      status: integrationStatus.openai,
      icon: 'AI'
    },
    { 
      id: 'react-native', 
      name: 'React Native', 
      description: 'Mobilappsutveckling',
      status: integrationStatus.reactNative,
      icon: 'RN'
    },
    { 
      id: 'testing', 
      name: 'Test Framework', 
      description: 'Jest och testverktyg',
      status: integrationStatus.testing,
      icon: 'TE'
    },
    { 
      id: 'analytics', 
      name: 'Analytics System', 
      description: 'GDPR-kompatibel analys',
      status: integrationStatus.analytics,
      icon: 'AN'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Tillbaka
            </Button>
            <h1 className="font-medium">MÄÄK Development Tools</h1>
            <div></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Overview */}
          <Card className="p-4">
            <h2 className="font-medium mb-3">Projekt: MÄÄK Mood v2.0</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Utvecklad från TIDE till MÄÄK</div>
              <div>Premium dejtingapp med personlighetsbaserad matchning</div>
              <div>Korall färgschema (#FF6B6B)</div>
              <div>React + TypeScript + Supabase</div>
            </div>
          </Card>

          {/* Master Setup Button */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Komplett Installation</h3>
              <Button
                onClick={setupAllIntegrations}
                disabled={isLoading}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isLoading ? 'Installerar...' : 'Installera Allt'}
              </Button>
            </div>
            
            {isLoading && setupProgress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Installation pågår...</span>
                  <span>{setupProgress}%</span>
                </div>
                <Progress value={setupProgress} className="h-2" />
              </div>
            )}

            <p className="text-sm text-gray-600">
              Konfigurerar alla nödvändiga verktyg och integrationer för MÄÄK Mood utveckling.
            </p>
          </Card>

          {/* Individual Integrations */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Individuella Integrationer</h3>
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs">
                        {integration.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{integration.name}</div>
                        <div className="text-xs text-gray-600">{integration.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(integration.status)}>
                        {getStatusText(integration.status)}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setupSingleIntegration(integration.id)}
                        disabled={isLoading || activeSetup === integration.id}
                      >
                        {activeSetup === integration.id ? 'Kör...' : 'Konfigurera'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Setup Results */}
          {setupResults.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Installationsresultat</h3>
              <div className="space-y-2">
                {setupResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`text-sm p-2 rounded ${
                      result.includes('SUCCESS') ? 'bg-green-50 text-green-800' :
                      result.includes('FAILED') ? 'bg-red-50 text-red-800' :
                      'bg-gray-50 text-gray-800'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Configuration Files */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Genererade Konfigurationsfiler</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>GitHub Workflows</span>
                <Badge className="bg-blue-100 text-blue-800">Auto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Prisma Schema</span>
                <Badge className="bg-green-100 text-green-800">Auto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Jest Test Config</span>
                <Badge className="bg-purple-100 text-purple-800">Auto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>React Native Config</span>
                <Badge className="bg-indigo-100 text-indigo-800">Auto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>OpenAI Service</span>
                <Badge className="bg-orange-100 text-orange-800">Auto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>GDPR Analytics</span>
                <Badge className="bg-red-100 text-red-800">Auto</Badge>
              </div>
            </div>
          </Card>

          {/* Development Commands */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Utvecklingskommandon</h3>
            <div className="space-y-2">
              <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                <div># Installera dependencies</div>
                <div>npm install</div>
                <div></div>
                <div># Starta utvecklingsserver</div>
                <div>npm run dev</div>
                <div></div>
                <div># Kör tester</div>
                <div>npm test</div>
                <div></div>
                <div># Prisma migrations</div>
                <div>npx prisma migrate dev</div>
                <div></div>
                <div># React Native</div>
                <div>expo start</div>
              </div>
            </div>
          </Card>

          {/* System Logs */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Systemloggar</h3>
              <Button size="sm" variant="outline" onClick={clearLogs}>
                Rensa
              </Button>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Inga loggar än
                </div>
              ) : (
                logs.slice(-10).map((log, index) => (
                  <div key={index} className={`text-xs p-2 rounded ${
                    log.includes('[ERROR]') ? 'bg-red-50 text-red-700' :
                    log.includes('[WARNING]') ? 'bg-yellow-50 text-yellow-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Migration Info */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-sm text-blue-800">
              <strong>TIDE → MÄÄK Migration:</strong> Alla verktyg är anpassade för den nya 
              MÄÄK Mood-arkitekturen med bevarad kompatibilitet. Automatiska konfigurationer 
              genereras för smidig utveckling.
            </AlertDescription>
          </Alert>

          {/* Next Steps */}
          <Card className="p-4 border-green-200">
            <h3 className="font-medium mb-3 text-green-800">Nästa Steg</h3>
            <div className="space-y-2 text-sm text-green-700">
              <div>• Kör komplett installation med "Installera Allt"</div>
              <div>• Konfigurera miljövariabler (SUPABASE_URL, OPENAI_API_KEY)</div>
              <div>• Kör databasmigreringar: npx prisma migrate dev</div>
              <div>• Starta utvecklingsserver: npm run dev</div>
              <div>• Testa React Native: expo start</div>
              <div>• Kör tester: npm test</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}