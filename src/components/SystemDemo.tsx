import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { systemDemo, DemoScenario, DemoResults } from '../utils/system-demo';

interface SystemDemoProps {
  onBack: () => void;
}

export function SystemDemo({ onBack }: SystemDemoProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [demoResults, setDemoResults] = useState<DemoResults[]>([]);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoReport, setDemoReport] = useState<string>('');

  const scenarios = systemDemo.getAvailableScenarios();

  const runCompleteDemo = async () => {
    setIsRunning(true);
    setDemoResults([]);
    setDemoProgress(0);
    setCurrentScenario('Förbereder demonstration...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setDemoProgress(prev => Math.min(prev + 10, 90));
      }, 800);

      const results = await systemDemo.runCompleteDemo();
      
      clearInterval(progressInterval);
      setDemoProgress(100);
      setCurrentScenario('Demonstration slutförd!');
      
      setDemoResults(results);
      
      // Generate report
      const report = systemDemo.generateDemoReport();
      setDemoReport(report);

    } catch (error) {
      console.error('Demo failed:', error);
      setCurrentScenario('Demonstration misslyckades: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
      setCurrentScenario(null);
    }
  };

  const runSingleScenario = async (scenario: DemoScenario) => {
    setIsRunning(true);
    setCurrentScenario(scenario.name);

    try {
      const result = await systemDemo.runScenario(scenario);
      setDemoResults([result]);
    } catch (error) {
      console.error('Scenario failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentScenario(null);
    }
  };

  const downloadReport = () => {
    if (!demoReport) return;

    const blob = new Blob([demoReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `maak-mood-system-demo-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getMetricColor = (value: number, max: number = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack}>
              ← Tillbaka
            </Button>
            <h1 className="font-medium">System Demo</h1>
            <div></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Demo Overview */}
          <Card className="p-4">
            <h2 className="font-medium mb-3">MÄÄK Mood System Demonstration</h2>
            <p className="text-sm text-gray-600 mb-4">
              Interaktiv demonstration av hela MÄÄK Mood utvecklingsplattformen. 
              Visar alla integrerade verktyg och system i aktion.
            </p>
            
            <Button
              onClick={runCompleteDemo}
              disabled={isRunning}
              className="w-full mb-3"
            >
              {isRunning ? 'Kör demonstration...' : 'Kör Komplett Demo'}
            </Button>

            {isRunning && demoProgress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>{currentScenario || 'Kör demonstration...'}</span>
                  <span>{demoProgress}%</span>
                </div>
                <Progress value={demoProgress} className="h-2" />
              </div>
            )}
          </Card>

          {/* Available Scenarios */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Tillgängliga Scenarier</h3>
            <div className="space-y-3">
              {scenarios.map((scenario, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{scenario.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                    </div>
                    <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">
                      {scenario.duration}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xs font-medium mb-1">Steg:</div>
                    <div className="space-y-1">
                      {scenario.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="text-xs text-gray-600">
                          {stepIndex + 1}. {step.action}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      <strong>Förväntat:</strong> {scenario.expectedOutcome}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runSingleScenario(scenario)}
                      disabled={isRunning}
                    >
                      {currentScenario === scenario.name ? 'Kör...' : 'Kör'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Demo Results */}
          {demoResults.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Demoresultat</h3>
                {demoReport && (
                  <Button size="sm" variant="outline" onClick={downloadReport}>
                    Ladda ner rapport
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {demoResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">{result.scenario}</h4>
                      <Badge className={getStatusColor(result.success)}>
                        {result.success ? 'Framgång' : 'Misslyckad'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-xs">
                        <span className="font-medium">Körningstid:</span> {result.executionTime}ms
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Integrationer:</span> 
                        <span className={getMetricColor(result.metrics.integrations, 7)}>
                          {result.metrics.integrations}/7
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Kodkvalitet:</span> 
                        <span className={getMetricColor(result.metrics.codeQuality)}>
                          {result.metrics.codeQuality}/100
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">GDPR:</span> 
                        <span className={getMetricColor(result.metrics.gdprCompliance)}>
                          {result.metrics.gdprCompliance}/100
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
                      {result.results.slice(0, 10).map((line, lineIndex) => (
                        <div key={lineIndex}>{line}</div>
                      ))}
                      {result.results.length > 10 && (
                        <div className="text-gray-500">
                          ... och {result.results.length - 10} fler rader
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {demoResults.length > 1 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Sammanfattning</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Framgångsrika:</span> {' '}
                      {demoResults.filter(r => r.success).length}/{demoResults.length}
                    </div>
                    <div>
                      <span className="font-medium">Framgångsgrad:</span> {' '}
                      {Math.round((demoResults.filter(r => r.success).length / demoResults.length) * 100)}%
                    </div>
                    <div>
                      <span className="font-medium">Total tid:</span> {' '}
                      {demoResults.reduce((sum, r) => sum + r.executionTime, 0)}ms
                    </div>
                    <div>
                      <span className="font-medium">Genomsnitt:</span> {' '}
                      {Math.round(demoResults.reduce((sum, r) => sum + r.executionTime, 0) / demoResults.length)}ms
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* System Status Overview */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Systemöversikt</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Tillgängliga verktyg:</div>
                <div className="text-xs space-y-1">
                  <div>• Development Tools</div>
                  <div>• Project Dashboard</div>
                  <div>• GDPR Compliance</div>
                  <div>• Auto-Sync</div>
                  <div>• Data Security</div>
                  <div>• Quality Control</div>
                  <div>• System Status</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Integrationer:</div>
                <div className="text-xs space-y-1">
                  <div>• GitHub & CI/CD</div>
                  <div>• Supabase Backend</div>
                  <div>• Prisma ORM</div>
                  <div>• OpenAI Integration</div>
                  <div>• React Native</div>
                  <div>• Testing Framework</div>
                  <div>• GDPR Analytics</div>
                </div>
              </div>
            </div>

            <Alert className="mt-4 border-green-200 bg-green-50">
              <AlertDescription className="text-sm text-green-800">
                <strong>System Status:</strong> Alla verktyg är implementerade och redo för demonstration. 
                Kör "Komplett Demo" för att se hela systemet i aktion.
              </AlertDescription>
            </Alert>
          </Card>

          {/* Demo Instructions */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Instruktioner</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>1. <strong>Komplett Demo:</strong> Kör alla scenarier sekventiellt</div>
              <div>2. <strong>Enskilt Scenario:</strong> Testa specifika funktioner</div>
              <div>3. <strong>Ladda ner rapport:</strong> Få detaljerad markdown-rapport</div>
              <div>4. <strong>Granska resultat:</strong> Analysera metrics och loggar</div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              Demonstrationen kör verkliga system och API-anrop där möjligt. 
              Vissa funktioner körs i mock-läge för säkerhet.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}