/**
 * MÄÄK Mood - Token-Free Auth Demo
 * Demonstrerar det nya token-fria auth-systemet
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Key,
  Globe,
  Zap,
  Database,
  Code
} from 'lucide-react';
import { authUtils, SessionInfo } from '../utils/auth-utils';

interface TokenFreeDemoProps {
  onBack: () => void;
}

export function TokenFreeDemo({ onBack }: TokenFreeDemoProps) {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [sessionHealth, setSessionHealth] = useState<any>(null);
  const [apiTestResults, setApiTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSessionInfo();
  }, []);

  const loadSessionInfo = async () => {
    try {
      const info = authUtils.getSessionInfo();
      setSessionInfo(info);
      
      const health = await authUtils.verifySessionHealth();
      setSessionHealth(health);
    } catch (error) {
      console.error('Failed to load session info:', error);
    }
  };

  const testTokenFreeAPI = async () => {
    setLoading(true);
    const results = [];
    
    const endpoints = [
      { name: 'Profil', endpoint: '/profile' },
      { name: 'Personlighet', endpoint: '/personality' },
      { name: 'Matchningar', endpoint: '/matches' }
    ];

    for (const { name, endpoint } of endpoints) {
      try {
        const startTime = Date.now();
        const result = await authUtils.apiRequest(endpoint);
        const duration = Date.now() - startTime;
        
        results.push({
          name,
          endpoint,
          status: 'success',
          duration: `${duration}ms`,
          response: result.success ? 'Data hämtad' : 'Fel i svaret'
        });
      } catch (error) {
        results.push({
          name,
          endpoint,
          status: 'error',
          duration: 'N/A',
          response: error instanceof Error ? error.message : 'Okänt fel'
        });
      }
    }
    
    setApiTestResults(results);
    setLoading(false);
  };

  const createNewSession = async () => {
    try {
      authUtils.clearSession();
      await authUtils.initSession();
      await loadSessionInfo();
    } catch (error) {
      console.error('Failed to create new session:', error);
    }
  };

  const formatSessionAge = (ageMs: number) => {
    const hours = Math.floor(ageMs / (1000 * 60 * 60));
    const minutes = Math.floor((ageMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl">Token-Free Auth Demo</h1>
          <p className="text-sm text-gray-600">MÄÄK Mood säkerhetssystem</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="testing">Testning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <CardTitle className="text-lg">Token-Fri Säkerhet</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Ingen Bearer Token</h4>
                    <p className="text-sm text-gray-600">
                      Använder X-Session-Id header istället för Authorization Bearer tokens
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Lokal Session-hantering</h4>
                    <p className="text-sm text-gray-600">
                      Session-ID genereras lokalt och sparas i localStorage
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Automatisk Återställning</h4>
                    <p className="text-sm text-gray-600">
                      Auto-retry med max 3 försök för alla API-anrop
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Demo-Fallback</h4>
                    <p className="text-sm text-gray-600">
                      Smidig övergång till demo-data vid API-problem
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Code className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">React Native-kompatibel</h4>
                <p className="text-sm text-gray-600">
                  Implementerad enligt din React Native-guide för fullständig kompatibilitet.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Aktuell Session</CardTitle>
                <Button size="sm" onClick={loadSessionInfo}>
                  Uppdatera
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionInfo ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Session-ID:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {sessionInfo.sessionId.substring(0, 12)}...
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Användar-ID:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {sessionInfo.userId.substring(0, 12)}...
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Demo-session:</span>
                    <Badge className={sessionInfo.isDemo ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                      {sessionInfo.isDemo ? 'Ja' : 'Nej'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">E-post:</span>
                    <span className="text-sm text-gray-600">{sessionInfo.userEmail}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Ingen session hittades</p>
                </div>
              )}
            </CardContent>
          </Card>

          {sessionHealth && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session-hälsa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge className={sessionHealth.healthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {sessionHealth.healthy ? 'Frisk' : 'Behöver uppdatering'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ålder:</span>
                  <span className="text-sm text-gray-600">
                    {formatSessionAge(sessionHealth.sessionAge)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Behöver uppdatering:</span>
                  <Badge className={sessionHealth.needsRefresh ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                    {sessionHealth.needsRefresh ? 'Ja' : 'Nej'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Button 
            onClick={createNewSession} 
            className="w-full"
            variant="outline"
          >
            <Key className="w-4 h-4 mr-2" />
            Skapa ny session
          </Button>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">API-testning</CardTitle>
                <Button 
                  size="sm" 
                  onClick={testTokenFreeAPI}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {loading ? 'Testar...' : 'Testa API'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Testar alla API-endpoints med token-fri autentisering och X-Session-Id headers.
              </p>
              
              {apiTestResults.length > 0 && (
                <div className="space-y-3">
                  {apiTestResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{result.name}</span>
                        <Badge className={result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {result.status === 'success' ? 'Lyckades' : 'Misslyckades'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Endpoint: {result.endpoint}</div>
                        <div>Tid: {result.duration}</div>
                        <div>Svar: {result.response}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Database className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Mock API Integration</h4>
                <p className="text-sm text-gray-600">
                  Alla API-anrop simuleras med demo-data och automatisk fel-återställning.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}