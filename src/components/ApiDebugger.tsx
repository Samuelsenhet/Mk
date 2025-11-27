import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { sessionlessApiClient } from "../utils/api-sessionless";
import { sessionlessAuth } from "../utils/auth-sessionless";
import { ArrowLeft, Play, CheckCircle, XCircle, Clock } from "lucide-react";
import { AuthTestComponent } from "./AuthTestComponent";

interface ApiDebuggerProps {
  onBack: () => void;
}

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  result?: any;
  error?: string;
  duration?: number;
}

export function ApiDebugger({ onBack }: ApiDebuggerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([]);

  const apiTests = [
    {
      name: "Health Check",
      test: () => sessionlessApiClient.healthCheck()
    },
    {
      name: "Get Session",
      test: () => sessionlessAuth.getSession()
    },
    {
      name: "Daily Matches",
      test: () => sessionlessApiClient.getDailyMatches("ENFP")
    },
    {
      name: "Daily Question",
      test: () => sessionlessApiClient.getDailyQuestion()
    },
    {
      name: "Social Trends",
      test: () => sessionlessApiClient.getSocialMediaTrends("ENFP")
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    for (const apiTest of apiTests) {
      const testResult: TestResult = {
        name: apiTest.name,
        status: 'pending'
      };

      setTests(prev => [...prev, testResult]);

      try {
        const startTime = Date.now();
        const result = await apiTest.test();
        const endTime = Date.now();

        testResult.status = 'success';
        testResult.result = result;
        testResult.duration = endTime - startTime;

        setTests(prev => prev.map(t => 
          t.name === apiTest.name ? testResult : t
        ));

      } catch (error) {
        testResult.status = 'error';
        testResult.error = error instanceof Error ? error.message : 'Unknown error';

        setTests(prev => prev.map(t => 
          t.name === apiTest.name ? testResult : t
        ));
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tillbaka</span>
          </Button>
          <h1 className="text-2xl">API Debugger</h1>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Testa alla API-endpoints för att identifiera fel
              </p>
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? 'Kör tester...' : 'Kör alla tester'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {tests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Resultat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(test.status)}
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {test.duration && (
                          <span className="text-sm text-gray-500">
                            {test.duration}ms
                          </span>
                        )}
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                    </div>

                    {test.error && (
                      <div className="bg-red-50 border border-red-200 rounded p-3 mt-2">
                        <p className="text-red-700 text-sm">{test.error}</p>
                      </div>
                    )}

                    {test.result && test.status === 'success' && (
                      <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
                        <pre className="text-green-700 text-xs overflow-auto max-h-32">
                          {JSON.stringify(test.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Snabbåtgärder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Sessionless Auth State:', sessionlessAuth.getSessionInfo());
                }}
              >
                Logga Session State
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  sessionlessApiClient.setMaxRetries(5);
                  console.log('Increased retry count to 5');
                }}
              >
                Öka Retry Count
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  sessionlessApiClient.setAutoRetry(true);
                  console.log('Auto retry enabled');
                }}
              >
                Aktivera Auto Retry
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Reload App
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auth Test Component */}
        <AuthTestComponent />

        {/* Debug Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Current URL:</span>
                <span className="text-gray-600">{window.location.href}</span>
              </div>
              <div className="flex justify-between">
                <span>User Agent:</span>
                <span className="text-gray-600 truncate">{navigator.userAgent}</span>
              </div>
              <div className="flex justify-between">
                <span>Local Storage Keys:</span>
                <span className="text-gray-600">{Object.keys(localStorage).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Session Storage Keys:</span>
                <span className="text-gray-600">{Object.keys(sessionStorage).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}