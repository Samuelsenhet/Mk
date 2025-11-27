import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { sessionlessApiClient } from "../utils/api-sessionless";
import { sessionlessAuth } from "../utils/auth-sessionless";

export function AuthTestComponent() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results: any[] = [];

    // Test 1: Check session
    try {
      const sessionResult = await sessionlessAuth.getSession();
      results.push({
        test: "Session Check",
        status: sessionResult.success ? "✅ PASS" : "❌ FAIL",
        details: sessionResult.success ? `User ID: ${sessionResult.user?.id}` : sessionResult.error
      });
    } catch (error) {
      results.push({
        test: "Session Check",
        status: "❌ ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 2: Health check
    try {
      const healthResult = await sessionlessApiClient.healthCheck();
      results.push({
        test: "API Health",
        status: healthResult.status === "healthy" ? "✅ PASS" : "⚠️ DEGRADED",
        details: `Status: ${healthResult.status}`
      });
    } catch (error) {
      results.push({
        test: "API Health",
        status: "❌ ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 3: Daily Question
    try {
      const questionResult = await sessionlessApiClient.getDailyQuestion();
      results.push({
        test: "Daily Question",
        status: questionResult.question ? "✅ PASS" : "❌ FAIL",
        details: questionResult.question ? `Question: ${questionResult.question.question}` : "No question returned"
      });
    } catch (error) {
      results.push({
        test: "Daily Question",
        status: "❌ ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 4: Daily Matches
    try {
      const matchesResult = await sessionlessApiClient.getDailyMatches("ENFP");
      results.push({
        test: "Daily Matches",
        status: matchesResult.similarityMatches ? "✅ PASS" : "❌ FAIL",
        details: matchesResult.similarityMatches ? `${matchesResult.similarityMatches.length} similarity matches` : "No matches returned"
      });
    } catch (error) {
      results.push({
        test: "Daily Matches",
        status: "❌ ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }

    // Test 5: Social Trends
    try {
      const trendsResult = await sessionlessApiClient.getSocialMediaTrends("ENFP");
      results.push({
        test: "Social Trends",
        status: trendsResult.trending_hashtags ? "✅ PASS" : "❌ FAIL",
        details: trendsResult.trending_hashtags ? `${trendsResult.trending_hashtags.length} trending hashtags` : "No trends returned"
      });
    } catch (error) {
      results.push({
        test: "Social Trends",
        status: "❌ ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const createDemoSession = async () => {
    try {
      const result = await sessionlessAuth.createDemoSession();
      if (result.success) {
        alert("Demo session skapad! Kör testerna igen.");
      }
    } catch (error) {
      alert("Failed to create demo session: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto m-4">
      <CardHeader>
        <CardTitle>🔧 API & Auth Test Suite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runTests} disabled={isLoading}>
            {isLoading ? "Testar..." : "Kör alla tester"}
          </Button>
          <Button onClick={createDemoSession} variant="outline">
            Skapa demo-session
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Test Resultat:</h3>
            {testResults.map((result, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{result.test}</span>
                  <span className="text-sm">{result.status}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">{result.details}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Debugging Info:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Session Info: {JSON.stringify(sessionlessAuth.getSessionInfo())}</div>
            <div>Is Authenticated: {sessionlessAuth.isAuthenticated() ? "✅" : "❌"}</div>
            <div>Client Status: {JSON.stringify(sessionlessApiClient.getClientStatus())}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}