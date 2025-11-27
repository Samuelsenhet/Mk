import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { sessionlessAuth } from "../utils/auth-sessionless";
import { sessionlessApiClient } from "../utils/api-sessionless";

interface AuthDebugPanelProps {
  onBack: () => void;
}

export function AuthDebugPanel({ onBack }: AuthDebugPanelProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  const runDiagnostics = async () => {
    setIsLoading(true);
    const results: any = {};
    
    try {
      // Test 1: Check sessionless auth system
      console.log("[DIAGNOSTIC 1] Checking sessionless auth system...");
      const sessionlessSession = localStorage.getItem('maak-user-session');
      results.sessionlessAuth = {
        exists: !!sessionlessSession,
        data: sessionlessSession ? JSON.parse(sessionlessSession) : null,
        valid: false
      };
      
      if (sessionlessSession) {
        try {
          const session = JSON.parse(sessionlessSession);
          if (session.sessionId && session.user) {
            const ageMs = Date.now() - session.createdAt;
            const ageHours = ageMs / (1000 * 60 * 60);
            const maxAgeHours = session.isDemo ? 24 : 168; // 24h for demo, 7 days for real
            results.sessionlessAuth.ageHours = ageHours;
            results.sessionlessAuth.maxAgeHours = maxAgeHours;
            results.sessionlessAuth.valid = ageHours < maxAgeHours && ageHours > -1;
            results.sessionlessAuth.isDemo = session.isDemo;
            results.sessionlessAuth.userId = session.user.id;
          }
        } catch (e) {
          results.sessionlessAuth.error = e instanceof Error ? e.message : 'Parse error';
        }
      }

      // Test 2: Check sessionless auth service
      console.log("[DIAGNOSTIC 2] Testing sessionless auth service...");
      try {
        const sessionResult = await sessionlessAuth.getSession();
        results.authService = {
          success: sessionResult.success,
          hasSession: !!sessionResult.session,
          hasUser: !!sessionResult.user,
          isDemo: sessionResult.isDemo,
          error: sessionResult.error
        };
        
        // Get recovery status
        const recoveryStatus = sessionlessAuth.getRecoveryStatus();
        results.authService.recoveryStatus = recoveryStatus;
      } catch (error) {
        results.authService = {
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      // Test 2.5: Check sessionless API client status
      console.log("[DIAGNOSTIC 2.5] Checking sessionless API client...");
      try {
        const clientStatus = sessionlessApiClient.getClientStatus();
        results.apiClientStatus = {
          ...clientStatus,
          isValid: clientStatus.hasValidSession && clientStatus.isAuthenticated
        };
      } catch (error) {
        results.apiClientStatus = {
          error: error instanceof Error ? error.message : 'Client status check failed',
          hasValidSession: false,
          isValid: false
        };
      }

      // Test 3: Test API health check
      console.log("[DIAGNOSTIC 3] Testing API health...");
      try {
        const healthResult = await sessionlessApiClient.healthCheck();
        results.apiHealth = {
          status: healthResult.status,
          services: healthResult.services,
          version: healthResult.version,
          timestamp: healthResult.timestamp
        };
      } catch (error) {
        results.apiHealth = {
          error: error instanceof Error ? error.message : 'Health check failed'
        };
      }

      // Test 4: Test authenticated endpoints
      console.log("[DIAGNOSTIC 4] Testing authenticated endpoints...");
      try {
        const profileResult = await sessionlessApiClient.getProfile();
        results.profileEndpoint = {
          success: true,
          hasProfile: !!profileResult.profile
        };
      } catch (error) {
        results.profileEndpoint = {
          success: false,
          error: error instanceof Error ? error.message : 'Profile test failed'
        };
      }

      try {
        const personalityResult = await sessionlessApiClient.getPersonalityResults();
        results.personalityEndpoint = {
          success: true,
          hasPersonality: !!personalityResult.personality
        };
      } catch (error) {
        results.personalityEndpoint = {
          success: false,
          error: error instanceof Error ? error.message : 'Personality test failed'
        };
      }

      // Test 5: Browser and environment info
      results.environment = {
        userAgent: navigator.userAgent,
        location: window.location.href,
        localStorage: typeof Storage !== "undefined",
        fetch: typeof fetch !== "undefined",
        timestamp: new Date().toISOString()
      };

      setTestResults(results);
      
    } catch (error) {
      console.error("Diagnostics failed:", error);
      setTestResults({
        error: error instanceof Error ? error.message : 'Diagnostics failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllSessions = async () => {
    try {
      localStorage.removeItem('maak-user-session');
      localStorage.removeItem('demo-session'); // Legacy cleanup
      await sessionlessAuth.logout();
      alert("Alla sessioner rensade! Appen kommer att starta om.");
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear sessions:", error);
      alert("Fel vid rensning av sessioner.");
    }
  };

  const refreshSession = async () => {
    setIsLoading(true);
    try {
      console.log('[REFRESH] Refreshing sessionless auth session...');
      const result = await sessionlessAuth.getSession();
      console.log("Session refresh result:", result);
      setIsLoading(false);
      runDiagnostics(); // Re-run diagnostics
    } catch (error) {
      console.error("Session refresh failed:", error);
      setIsLoading(false);
    }
  };

  const recoverSession = async () => {
    setIsLoading(true);
    try {
      console.log('[RECOVERY] Sessionless auth recovery initiated...');
      
      // Try to get session with built-in auto recovery
      const sessionResult = await sessionlessAuth.getSession();
      
      if (sessionResult.success && sessionResult.session) {
        alert(`Session återställd! ${sessionResult.isDemo ? 'Demo' : 'Real'} session hittad.`);
        console.log('[SUCCESS] Session recovery successful');
      } else {
        // Try to create a demo session as fallback
        console.log('[DEMO] Creating demo session as fallback...');
        const demoResult = await sessionlessAuth.verifyOTP('+46701234567', '123456');
        
        if (demoResult.success) {
          alert('Demo session skapad som fallback!');
        } else {
          alert('Kunde inte återställa session. Vänligen logga in igen.');
        }
      }
      
      setIsLoading(false);
      runDiagnostics(); // Re-run diagnostics
    } catch (error) {
      console.error("Session recovery failed:", error);
      alert("Session-återställning misslyckades!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusBadge = (condition: boolean) => (
    <Badge className={condition ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
      {condition ? "✅ OK" : "❌ FAIL"}
    </Badge>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">🔧 Autentiserings-diagnostik</h1>
        <Button variant="outline" onClick={onBack}>
          Tillbaka
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Control Panel */}
        <Card className="p-6">
          <h2 className="text-lg mb-4">Kontrollpanel</h2>
          <div className="flex gap-3 flex-wrap">
            <Button 
              onClick={runDiagnostics} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "🔄 Kör test..." : "🔍 Kör diagnostik"}
            </Button>
            <Button 
              onClick={refreshSession} 
              disabled={isLoading}
              variant="outline"
            >
              🔄 Uppdatera session
            </Button>
            <Button 
              onClick={recoverSession} 
              disabled={isLoading}
              variant="outline"
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              🛠️ Återställ session
            </Button>
            <Button 
              onClick={clearAllSessions} 
              variant="destructive"
            >
              🗑️ Rensa alla sessioner
            </Button>
          </div>
        </Card>

        {/* Test Results */}
        {testResults && Object.keys(testResults).length > 0 && (
          <>
            {/* Sessionless Auth Status */}
            {testResults.sessionlessAuth && (
              <Card className="p-6">
                <h2 className="text-lg mb-4">Sessionless Auth Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Session finns:</span>
                    {getStatusBadge(testResults.sessionlessAuth.exists)}
                  </div>
                  {testResults.sessionlessAuth.exists && (
                    <>
                      <div className="flex justify-between items-center">
                        <span>Session giltig:</span>
                        {getStatusBadge(testResults.sessionlessAuth.valid)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Session typ:</span>
                        <Badge className={testResults.sessionlessAuth.isDemo ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}>
                          {testResults.sessionlessAuth.isDemo ? "Demo" : "Real"}
                        </Badge>
                      </div>
                      {testResults.sessionlessAuth.ageHours !== undefined && (
                        <div className="flex justify-between items-center">
                          <span>Session ålder:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {Math.round(testResults.sessionlessAuth.ageHours * 10) / 10}h 
                            (max {testResults.sessionlessAuth.maxAgeHours}h)
                          </code>
                        </div>
                      )}
                      {testResults.sessionlessAuth.userId && (
                        <div className="flex justify-between items-center">
                          <span>User ID:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {testResults.sessionlessAuth.userId.substring(0, 20)}...
                          </code>
                        </div>
                      )}
                    </>
                  )}
                  {testResults.sessionlessAuth.error && (
                    <div className="text-red-600 text-sm">
                      Fel: {testResults.sessionlessAuth.error}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Auth Service Status */}
            {testResults.authService && (
              <Card className="p-6">
                <h2 className="text-lg mb-4">Sessionless Auth Service Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Service fungerar:</span>
                    {getStatusBadge(testResults.authService.success)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Har session:</span>
                    {getStatusBadge(testResults.authService.hasSession)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Har användare:</span>
                    {getStatusBadge(testResults.authService.hasUser)}
                  </div>
                  {testResults.authService.isDemo !== undefined && (
                    <div className="flex justify-between items-center">
                      <span>Demo läge:</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {testResults.authService.isDemo ? "Ja" : "Nej"}
                      </Badge>
                    </div>
                  )}
                  {testResults.authService.recoveryStatus && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Auto Error Recovery:</span>
                      <div className="ml-4 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recovery aktiverad:</span>
                          {getStatusBadge(testResults.authService.recoveryStatus.errorRecoveryEnabled)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Session typ:</span>
                          <Badge className="bg-gray-100 text-gray-800 text-xs">
                            {testResults.authService.recoveryStatus.sessionType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  {testResults.authService.error && (
                    <div className="text-red-600 text-sm">
                      Fel: {testResults.authService.error}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* API Client Status */}
            {testResults.apiClientStatus && (
              <Card className="p-6">
                <h2 className="text-lg mb-4">Sessionless API Client Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Har giltig session:</span>
                    {getStatusBadge(testResults.apiClientStatus.hasValidSession)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Är autentiserad:</span>
                    {getStatusBadge(testResults.apiClientStatus.isAuthenticated)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Auto retry aktiverat:</span>
                    {getStatusBadge(testResults.apiClientStatus.autoRetryEnabled)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Max retries:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {testResults.apiClientStatus.maxRetries}
                    </code>
                  </div>
                  {testResults.apiClientStatus.sessionType && (
                    <div className="flex justify-between items-center">
                      <span>Session typ:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {testResults.apiClientStatus.sessionType}
                      </Badge>
                    </div>
                  )}
                  {testResults.apiClientStatus.userId && (
                    <div className="flex justify-between items-center">
                      <span>User ID:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {testResults.apiClientStatus.userId.substring(0, 20)}...
                      </code>
                    </div>
                  )}
                  {testResults.apiClientStatus.error && (
                    <div className="text-red-600 text-sm">
                      Fel: {testResults.apiClientStatus.error}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* API Status */}
            {testResults.apiHealth && (
              <Card className="p-6">
                <h2 className="text-lg mb-4">API Server Status</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Server status:</span>
                    <Badge className={
                      testResults.apiHealth.status === 'healthy' 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }>
                      {testResults.apiHealth.status || "Unknown"}
                    </Badge>
                  </div>
                  {testResults.apiHealth.services && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Services:</span>
                      {Object.entries(testResults.apiHealth.services).map(([service, status]) => (
                        <div key={service} className="flex justify-between items-center ml-4">
                          <span className="text-sm">{service}:</span>
                          {getStatusBadge(status === 'ok')}
                        </div>
                      ))}
                    </div>
                  )}
                  {testResults.apiHealth.version && (
                    <div className="flex justify-between items-center">
                      <span>Version:</span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {testResults.apiHealth.version}
                      </code>
                    </div>
                  )}
                  {testResults.apiHealth.error && (
                    <div className="text-red-600 text-sm">
                      Fel: {testResults.apiHealth.error}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Endpoint Tests */}
            <Card className="p-6">
              <h2 className="text-lg mb-4">Endpoint Tests</h2>
              <div className="space-y-3">
                {testResults.profileEndpoint && (
                  <div className="flex justify-between items-center">
                    <span>/profile endpoint:</span>
                    {getStatusBadge(testResults.profileEndpoint.success)}
                    {testResults.profileEndpoint.error && (
                      <span className="text-red-600 text-xs ml-2">
                        {testResults.profileEndpoint.error}
                      </span>
                    )}
                  </div>
                )}
                {testResults.personalityEndpoint && (
                  <div className="flex justify-between items-center">
                    <span>/personality endpoint:</span>
                    {getStatusBadge(testResults.personalityEndpoint.success)}
                    {testResults.personalityEndpoint.error && (
                      <span className="text-red-600 text-xs ml-2">
                        {testResults.personalityEndpoint.error}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Environment Info */}
            {testResults.environment && (
              <Card className="p-6">
                <h2 className="text-lg mb-4">Miljöinformation</h2>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>URL:</strong> {testResults.environment.location}
                  </div>
                  <div>
                    <strong>Timestamp:</strong> {testResults.environment.timestamp}
                  </div>
                  <div>
                    <strong>LocalStorage:</strong> {getStatusBadge(testResults.environment.localStorage)}
                  </div>
                  <div>
                    <strong>Fetch API:</strong> {getStatusBadge(testResults.environment.fetch)}
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-gray-600">User Agent</summary>
                    <code className="block bg-gray-100 p-2 rounded mt-2 text-xs break-all">
                      {testResults.environment.userAgent}
                    </code>
                  </details>
                </div>
              </Card>
            )}
          </>
        )}

        {/* Error Display */}
        {testResults.error && (
          <Card className="p-6 border-red-200">
            <h2 className="text-lg mb-4 text-red-800">Diagnostikfel</h2>
            <div className="bg-red-50 p-4 rounded">
              <code className="text-red-800 text-sm">{testResults.error}</code>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-6 bg-blue-50">
          <h2 className="text-lg mb-4">Snabblösningar</h2>
          <div className="space-y-3 text-sm">
            <div>
              <strong>401-fel på /profile eller /personality:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>Kör "Uppdatera session" ovan - auto error recovery kan lösa detta</li>
                <li>Kör "Återställ session" för manuell session-recovery</li>
                <li>Om demo-session: kontrollera att den är mindre än 24 timmar gammal</li>
                <li>Om real session: den är giltig i 7 dagar</li>
              </ul>
            </div>
            <div>
              <strong>Server health check misslyckas:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>Auto retry aktiverat - vänta några sekunder för automatisk återhämtning</li>
                <li>Kontrollera internetanslutning</li>
                <li>Rensa alla sessioner och starta om vid ihållande problem</li>
              </ul>
            </div>
            <div>
              <strong>Sessionless auth problem:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>Demo-sessioner är giltiga i 24 timmar, real sessioner i 7 dagar</li>
                <li>Auto error recovery försöker automatiskt lösa session-problem</li>
                <li>Använd kod "123456" för ny demo-inloggning vid +46 nummer</li>
                <li>Sessionless auth använder localStorage för session-persistering</li>
              </ul>
            </div>
            <div>
              <strong>Auto Error Recovery:</strong>
              <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                <li>✅ Automatisk session-återhämtning vid 401-fel</li>
                <li>✅ Automatisk retry vid nätverksfel (max 3 försök)</li>
                <li>✅ Exponential backoff för server-fel</li>
                <li>✅ Fallback till demo-läge vid kritiska fel</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}