import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { maakProjectManager, ProjectStatus, DeploymentPlan } from '../utils/project-manager';
import { maakDevTools } from '../utils/development-tools-fixed';

interface ProjectDashboardProps {
  onBack: () => void;
}

export function ProjectDashboard({ onBack }: ProjectDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus | null>(null);
  const [deploymentPlan, setDeploymentPlan] = useState<DeploymentPlan | null>(null);
  const [setupResults, setSetupResults] = useState<string[]>([]);
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [statusReport, setStatusReport] = useState<string>('');

  useEffect(() => {
    // Load initial project status
    loadProjectStatus();
  }, []);

  const loadProjectStatus = async () => {
    try {
      const status = await maakProjectManager.assessProjectHealth();
      setProjectStatus(status);
    } catch (error) {
      console.error('Failed to load project status:', error);
    }
  };

  const runCompleteSetup = async () => {
    setIsLoading(true);
    setActiveOperation('setup');
    setSetupResults([]);

    try {
      const result = await maakProjectManager.setupCompleteProject();
      setSetupResults(result.report);
      
      // Reload project status after setup
      await loadProjectStatus();

    } catch (error) {
      setSetupResults(['ERROR: ' + (error as Error).message]);
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };

  const createDeploymentPlan = async (environment: 'staging' | 'production') => {
    setIsLoading(true);
    setActiveOperation(`deployment-${environment}`);

    try {
      const plan = await maakProjectManager.createDeploymentPlan(environment);
      setDeploymentPlan(plan);
    } catch (error) {
      console.error('Failed to create deployment plan:', error);
    } finally {
      setIsLoading(false);
      setActiveOperation(null);
    }
  };

  const generateStatusReport = () => {
    const report = maakProjectManager.generateStatusReport();
    setStatusReport(report);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'clean':
      case 'connected':
      case 'secure':
      case 'optimal':
      case 'passing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
      case 'needs-attention':
      case 'partial':
      case 'moderate':
      case 'good':
      case 'failing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
      case 'disconnected':
      case 'vulnerable':
      case 'poor':
      case 'missing':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'healthy': 'Hälsosam',
      'warning': 'Varning',
      'critical': 'Kritisk',
      'clean': 'Ren',
      'needs-attention': 'Behöver uppmärksamhet',
      'connected': 'Ansluten',
      'partial': 'Delvis',
      'disconnected': 'Frånkopplad',
      'secure': 'Säker',
      'moderate': 'Måttlig',
      'vulnerable': 'Sårbar',
      'optimal': 'Optimal',
      'good': 'Bra',
      'poor': 'Dålig',
      'passing': 'Godkänd',
      'failing': 'Underkänd',
      'missing': 'Saknas'
    };
    return statusMap[status] || status;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
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
            <h1 className="font-medium">Projekt Dashboard</h1>
            <div></div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Project Overview */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">MÄÄK Mood v2.0</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={loadProjectStatus}
                disabled={isLoading}
              >
                {isLoading ? 'Uppdaterar...' : 'Uppdatera'}
              </Button>
            </div>

            {projectStatus && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Övergripande Status</span>
                  <Badge className={getStatusColor(projectStatus.overall)}>
                    {getStatusText(projectStatus.overall)}
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-500">
                  Senast uppdaterad: {projectStatus.lastUpdate.toLocaleString('sv-SE')}
                </div>
              </div>
            )}
          </Card>

          {/* Project Metrics */}
          {projectStatus && (
            <Card className="p-4">
              <h3 className="font-medium mb-4">Projektmätningar</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Kodkvalitet</span>
                    <span className={getScoreColor(projectStatus.metrics.codeQuality)}>
                      {projectStatus.metrics.codeQuality}/100
                    </span>
                  </div>
                  <Progress value={projectStatus.metrics.codeQuality} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Testtäckning</span>
                    <span className={getScoreColor(projectStatus.metrics.testCoverage)}>
                      {projectStatus.metrics.testCoverage}%
                    </span>
                  </div>
                  <Progress value={projectStatus.metrics.testCoverage} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Prestanda</span>
                    <span className={getScoreColor(projectStatus.metrics.performance)}>
                      {projectStatus.metrics.performance}/100
                    </span>
                  </div>
                  <Progress value={projectStatus.metrics.performance} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Säkerhet</span>
                    <span className={getScoreColor(projectStatus.metrics.security)}>
                      {projectStatus.metrics.security}/100
                    </span>
                  </div>
                  <Progress value={projectStatus.metrics.security} className="h-2" />
                </div>
              </div>
            </Card>
          )}

          {/* Component Status */}
          {projectStatus && (
            <Card className="p-4">
              <h3 className="font-medium mb-4">Komponentstatus</h3>
              <div className="space-y-3">
                {Object.entries(projectStatus.components).map(([key, status]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {key === 'codebase' ? 'Kodbas' :
                       key === 'integrations' ? 'Integrationer' :
                       key === 'security' ? 'Säkerhet' :
                       key === 'performance' ? 'Prestanda' :
                       key === 'testing' ? 'Testning' : key}
                    </span>
                    <Badge className={getStatusColor(status)}>
                      {getStatusText(status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Snabbåtgärder</h3>
            <div className="space-y-3">
              <Button
                onClick={runCompleteSetup}
                disabled={isLoading}
                className="w-full"
              >
                {activeOperation === 'setup' ? 'Konfigurerar...' : 'Komplett Projektsetup'}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => createDeploymentPlan('staging')}
                  disabled={isLoading}
                  size="sm"
                >
                  {activeOperation === 'deployment-staging' ? 'Skapar...' : 'Staging Plan'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => createDeploymentPlan('production')}
                  disabled={isLoading}
                  size="sm"
                >
                  {activeOperation === 'deployment-production' ? 'Skapar...' : 'Prod Plan'}
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={generateStatusReport}
                className="w-full"
                size="sm"
              >
                Generera Statusrapport
              </Button>
            </div>
          </Card>

          {/* Setup Results */}
          {setupResults.length > 0 && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Setupresultat</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {setupResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`text-xs p-2 rounded ${
                      result.includes('✓') ? 'bg-green-50 text-green-800' :
                      result.includes('✗') ? 'bg-red-50 text-red-800' :
                      result.includes('⚠') ? 'bg-yellow-50 text-yellow-800' :
                      result.includes('[STEP') ? 'bg-blue-50 text-blue-800 font-medium' :
                      'bg-gray-50 text-gray-800'
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Deployment Plan */}
          {deploymentPlan && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                  Driftsättningsplan - {deploymentPlan.environment}
                </h3>
                <Badge className={deploymentPlan.readiness ? 
                  'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                }>
                  {deploymentPlan.readiness ? 'Redo' : 'Ej redo'}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Uppskattad tid:</span> {deploymentPlan.estimatedTime}
                </div>

                {deploymentPlan.blockers.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-2">Blockeringar:</div>
                    {deploymentPlan.blockers.map((blocker, index) => (
                      <div key={index} className="text-xs text-red-600 ml-2">
                        • {blocker}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium mb-2">Checklista:</div>
                  <div className="space-y-1">
                    {deploymentPlan.checklist.map((item, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <span className={`mr-2 ${item.completed ? 'text-green-600' : 'text-red-600'}`}>
                          {item.completed ? '✓' : '✗'}
                        </span>
                        <span className={item.critical ? 'font-medium' : ''}>
                          {item.task}
                        </span>
                        {item.critical && (
                          <Badge className="ml-2 text-xs bg-orange-100 text-orange-800">
                            Kritisk
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {deploymentPlan.recommendations.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Rekommendationer:</div>
                    {deploymentPlan.recommendations.map((rec, index) => (
                      <div key={index} className="text-xs text-gray-600 ml-2">
                        • {rec}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Status Report */}
          {statusReport && (
            <Card className="p-4">
              <h3 className="font-medium mb-3">Statusrapport</h3>
              <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                {statusReport}
              </div>
            </Card>
          )}

          {/* Tips */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-sm text-blue-800">
              <strong>Tips:</strong> Kör "Komplett Projektsetup" för att automatiskt konfigurera 
              alla nödvändiga verktyg och integrationer för MÄÄK Mood-utveckling.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}