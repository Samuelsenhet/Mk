import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { AuthScreens } from "./components/AuthScreens";
import { ProfileCreation } from "./components/ProfileCreation";
import { PersonalityTest } from "./components/PersonalityTest";
import { PersonalityTestDemo } from "./components/PersonalityTestDemo";
import { PersonalityTestIntro } from "./components/PersonalityTestIntro";
import { MatchingSystem } from "./components/MatchingSystem";
import { AICompanion } from "./components/AICompanion";
import { ChatInterface } from "./components/ChatInterface";
import { CommunityFeatures } from "./components/CommunityFeatures";
import { PairingHub } from "./components/PairingHub";
import { Navigation } from "./components/Navigation";
import { ConsentBanner } from "./components/ConsentBanner";
import { PrivacySettings } from "./components/PrivacySettings";
import { PremiumSubscription } from "./components/PremiumSubscription";
import { HingeProfile } from "./components/HingeProfile";
// REMOVED: DailyMoodCheckin enligt Figma-analys - var "oaktuell"
import { AchievementSystem } from "./components/AchievementSystem";
import { DesignOverview } from "./components/DesignOverview";
import { FigmaDesignSystem } from "./components/FigmaDesignSystem";
import { FigmaExporter } from "./components/FigmaExporter";
import { FigmaImportGuide } from "./components/FigmaImportGuide";
import { FigmaFlowClarification } from "./components/FigmaFlowClarification";
import { FigmaFlowExplanation } from "./components/FigmaFlowExplanation";
import { AuthDebugPanel } from "./components/AuthDebugPanel";
import { FigmaPrototypeBuilder } from "./components/FigmaPrototypeBuilder";
import { ArchetypeExplorer } from "./components/ArchetypeExplorer";
import { MatchTabs } from "./components/MatchTabs";
import { FeatureShowcase } from "./components/FeatureShowcase";
import { FigmaEnhancementDemo } from "./components/FigmaEnhancementDemo";
import { AutoSync } from "./components/AutoSync";
import { DataSecurity } from "./components/DataSecurity";
import { QualityControl } from "./components/QualityControl";
import { SystemStatus } from "./components/SystemStatus";
import { DevelopmentTools } from "./components/DevelopmentTools";
import { ProjectDashboard } from "./components/ProjectDashboard";
import { GDPRCompliance } from "./components/GDPRCompliance";
import { SystemDemo } from "./components/SystemDemo";
import { TokenFreeDemo } from "./components/TokenFreeDemo";
import { ApiDebugger } from "./components/ApiDebugger";

import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { sessionlessAuth } from "./utils/auth-sessionless";
import { sessionlessApiClient } from "./utils/api-sessionless";
import { authUtils } from "./utils/auth-utils";
import { privacyManager, UserConsent } from "./utils/privacy";
import { analytics, useAnalytics } from "./utils/analytics";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { defaultUserMatches } from "./utils/mockMatchData";

type AppState = 
  | "loading"
  | "welcome" 
  | "auth"
  | "onboarding"
  | "main-app";

type AuthMode = "login" | "signup";
type MainTab = "matches" | "chats" | "pairing" | "profile" | "profile-legacy" | "privacy" | "premium" | "mood" | "achievements" | "design" | "figma" | "export" | "import-guide" | "flow-clarification" | "flow-explanation" | "auth-debug" | "auto-sync" | "data-security" | "quality-control" | "system-status" | "dev-tools" | "project-dashboard" | "gdpr-compliance" | "system-demo" | "prototype-builder" | "archetype-explorer" | "feature-showcase" | "token-free-demo" | "api-debugger" | "personality-test" | "personality-demo" | "personality-intro" | "figma-enhancements";

function AppContent() {
  const [appState, setAppState] = useState<AppState>("loading");
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [activeTab, setActiveTab] = useState<MainTab>("matches");
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPersonality, setUserPersonality] = useState<any>(null);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [showAICompanion, setShowAICompanion] = useState(false);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [userConsent, setUserConsent] = useState<UserConsent | null>(null);
  const [userSubscription, setUserSubscription] = useState<"free" | "premium" | "platinum">("free");
  // REMOVED: Mood checkin state enligt Figma-analys - oaktuell funktion
  
  const { trackPersonalityTestStart, trackPersonalityTestComplete, trackMatchView, trackChatStart } = useAnalytics();

  // Initialize app and check for existing session with auto error recovery
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[INIT] 🚀 Startar MÄÄK Mood med token-fri sessionless auth och automatisk felåterställning...');
        console.log('[TOKEN-FREE] ✅ Nytt auth-system aktiverat enligt React Native-guide');
        
        // Initialize token-free session system
        await authUtils.initSession();
        
        // Enable auto error recovery
        sessionlessAuth.setErrorRecovery(true);
        sessionlessApiClient.setAutoRetry(true);
        sessionlessApiClient.setMaxRetries(3);
        
        // Check session health with new token-free system
        const sessionHealth = await authUtils.verifySessionHealth();
        console.log('[SESSION HEALTH] Session-hälsa kontrollerad:', sessionHealth);
        
        // Check for existing session or create demo session
        let sessionResult = await sessionlessAuth.getSession();
        
        // If no session exists, create a demo session for immediate functionality
        if (!sessionResult.success || !sessionResult.session) {
          console.log('[SESSION RECOVERY] Ingen session hittades, skapar demo-session...');
          const demoResult = await sessionlessAuth.createDemoSession();
          if (demoResult.success) {
            sessionResult = demoResult;
            console.log('[SESSION RECOVERY] Demo-session skapad framgångsrikt');
          }
        }
        
        if (sessionResult.success && sessionResult.session && sessionResult.user) {
          setUser(sessionResult.user);
          setSession(sessionResult.session);
          
          console.log('[AUTH SUCCESS] Giltig session hittades:', {
            userId: sessionResult.user.id,
            isDemo: sessionResult.isDemo,
            sessionId: sessionResult.session.sessionId?.substring(0, 20) + '...'
          });
          
          // Check for consent
          const currentConsent = privacyManager.getUserConsent();
          if (currentConsent) {
            setUserConsent(currentConsent);
            analytics.initialize(currentConsent);
          } else if (privacyManager.needsConsentUpdate()) {
            setShowConsentBanner(true);
          }
          
          let hasProfile = false;
          let hasPersonality = false;
          
          // Test API connectivity with auto error recovery
          try {
            console.log('[API HEALTH] Testar API-serverns hälsa med automatisk återställning...');
            const healthResult = await sessionlessApiClient.healthCheck();
            console.log('[API HEALTH SUCCESS] API-server är frisk:', healthResult.status);
          } catch (healthError) {
            console.warn('[API HEALTH WARNING] API-hälsokontroll misslyckades (automatisk återställning kommer hantera detta):', healthError);
            // Continue anyway - auto recovery will handle API issues
          }
          
          // Try to load user profile with new token-free API system
          try {
            console.log('[PROFILE FETCH] Hämtar användarprofil med token-fri API...');
            const profileResult = await authUtils.apiRequest('/profile');
            if (profileResult.profile) {
              setUserProfile(profileResult.profile);
              hasProfile = true;
              console.log('[PROFILE SUCCESS] Användarprofil laddades framgångsrikt med token-fri API');
            }
          } catch (error) {
            console.log("[PROFILE WARNING] Profilhämtning misslyckades (token-fri återställning försökt):", error);
            // Fallback to mock data with token-free system
            try {
              const mockProfile = authUtils.createDemoUser().sessionInfo;
              if (mockProfile) {
                hasProfile = true;
                console.log('[PROFILE FALLBACK] Använder demo-profil för token-fri session');
              }
            } catch (fallbackError) {
              console.log('[PROFILE INFO] Ingen profil hittades - användare behöver onboarding');
            }
          }

          // Try to load personality results with new token-free API system
          try {
            console.log('[PERSONALITY FETCH] Hämtar personlighetsresultat med token-fri API...');
            const personalityResult = await authUtils.apiRequest('/personality');
            if (personalityResult.personality) {
              setUserPersonality(personalityResult.personality);
              hasPersonality = true;
              console.log('[PERSONALITY SUCCESS] Personlighetsresultat laddades framgångsrikt med token-fri API');
            }
          } catch (error) {
            console.log("[PERSONALITY WARNING] Personlighetshämtning misslyckades (token-fri återställning försökt):", error);
            // Token-free system handles this gracefully
            if (error instanceof Error && error.message.includes('404')) {
              console.log('[PERSONALITY INFO] Inga personlighetsresultat hittades - användare behöver ta testet');
            } else {
              console.log('[PERSONALITY INFO] Personlighetsdata-problem - kommer använda demo-data');
            }
          }

          // Determine if user needs onboarding
          const needsOnboarding = !hasProfile || !hasPersonality;
          setNeedsOnboarding(needsOnboarding);
          
          console.log('[ONBOARDING STATUS] Onboarding-status:', {
            hasProfile,
            hasPersonality,
            needsOnboarding
          });
          
          setAppState(needsOnboarding ? "onboarding" : "main-app");
        } else {
          console.log('[AUTH ERROR] Ingen giltig session hittades, visa välkomstskärm');
          setAppState("welcome");
        }
      } catch (error) {
        console.error("Appinitialisering misslyckades:", error);
        setAppState("welcome");
      }
    };

    initializeApp();

    // Listen for auth state changes with auto error recovery
    const { data: { subscription } } = sessionlessAuth.onAuthStateChange((event, session) => {
      console.log("[AUTH STATE CHANGE] Auth-tillståndsändring (sessionless):", event, session?.sessionId?.substring(0, 20) + '...');
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setSession(session);
        setAppState("onboarding"); // New users need onboarding
        console.log('[AUTH SUCCESS] Användare inloggad med sessionless auth');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setUserPersonality(null);
        setAppState("welcome");
        console.log('[AUTH LOGOUT] Användare utloggad, rensade all data');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleGetStarted = () => {
    setAuthMode("signup");
    setAppState("auth");
  };

  const handleLogin = () => {
    setAuthMode("login");
    setAppState("auth");
  };

  const handleAuthSuccess = (user: any, session: any) => {
    console.log('[AUTH SUCCESS] Autentisering lyckades med sessionless auth:', user.id);
    setUser(user);
    setSession(session);
    
    // Verify session info is available
    const sessionInfo = sessionlessAuth.getSessionInfo();
    console.log('[AUTH SUCCESS] Session info verified:', sessionInfo ? {
      userId: sessionInfo.userId?.substring(0, 15) + '...',
      sessionId: sessionInfo.sessionId?.substring(0, 20) + '...',
      isDemo: sessionInfo.isDemo
    } : 'null');
    
    // Check if user needs to give consent
    if (privacyManager.needsConsentUpdate()) {
      setShowConsentBanner(true);
    }
    
    setAppState("onboarding");
  };

  const handleBackToWelcome = () => {
    setAppState("welcome");
  };

  const handleProfileComplete = async (profileData: any) => {
    try {
      console.log('[PROFILE SAVE] Sparar användarprofil med sessionless auth...', profileData);
      
      // Check if we have a valid session (sessionless auth handles validation)
      if (!sessionlessAuth.isAuthenticated()) {
        console.error('[SESSION ERROR] Ingen giltig session för att spara profil');
        throw new Error('Session har gått ut. Vänligen logga in igen.');
      }
      
      const result = await sessionlessApiClient.createProfile(profileData);
      if (result.success) {
        setUserProfile(profileData);
        console.log('[PROFILE SUCCESS] Profil sparad framgångsrikt med automatisk felåterställning');
        console.log('[PROFILE SUCCESS] Profildata satt:', profileData);
        console.log('[PROFILE SUCCESS] Fortsätter till personlighetstest...');
        // State will remain "onboarding" to show personality test next
      } else {
        console.error("[PROFILE ERROR] Misslyckades att spara profil:", result.error);
        
        // Även om API:t misslyckas, sätt profilen lokalt så att onboarding kan fortsätta
        console.log('[PROFILE FALLBACK] Sätter profil lokalt för att fortsätta onboarding...');
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error("[PROFILE CRITICAL ERROR] Profil-sparningsfel (efter automatisk återställning):", error);
      
      // Även vid fel, sätt profilen lokalt så att användaren kan fortsätta
      console.log('[PROFILE EMERGENCY FALLBACK] Sätter profil lokalt vid fel för att fortsätta...');
      setUserProfile(profileData);
      
      // Auto recovery is built into the API client, so this is a final failure
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('session')) {
          console.warn('[SESSION RECOVERY ERROR] Sessionsproblem kvarstår efter automatisk återställning, omdirigerar...');
          setAppState("welcome");
          return;
        }
        console.error('Fel vid sparning av profil (men fortsätter med lokal data):', error.message);
      }
    }
  };

  const handlePersonalityComplete = async (personalityResult: any) => {
    try {
      console.log('[PERSONALITY SAVE] Sparar personlighetsresultat med sessionless auth...');
      
      // Check if we have a valid session (sessionless auth handles validation)
      if (!sessionlessAuth.isAuthenticated()) {
        console.error('[SESSION ERROR] Ingen giltig session för att spara personlighetsresultat');
        throw new Error('Session har gått ut. Vänligen logga in igen.');
      }
      
      const result = await sessionlessApiClient.savePersonalityResults(personalityResult);
      if (result.success) {
        setUserPersonality(personalityResult);
        setNeedsOnboarding(false);
        console.log('[PERSONALITY SUCCESS] Personlighetsresultat sparade framgångsrikt med automatisk felåterställning');
        
        // Track personality test completion
        if (user) {
          try {
            trackPersonalityTestComplete(user.id, personalityResult);
          } catch (analyticsError) {
            console.warn('[ANALYTICS WARNING] Analytics-spårning misslyckades (icke-kritiskt):', analyticsError);
          }
        }
        
        // Return to main app after completing test
        setActiveTab("profile");
        
        // Don't set state here, let the useEffect handle it
      } else {
        console.error("[PERSONALITY ERROR] Misslyckades att spara personlighetsresultat:", result.error);
        throw new Error(result.error || 'Kunde inte spara personlighetsresultat');
      }
    } catch (error) {
      console.error("[PERSONALITY CRITICAL ERROR] Personlighets-sparningsfel (efter automatisk återställning):", error);
      
      // Auto recovery is built into the API client
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('session')) {
          console.warn('[SESSION RECOVERY ERROR] Sessionsproblem kvarstår efter automatisk återställning, omdirigerar...');
          setAppState("welcome");
          return;
        }
        console.error('Fel vid sparning av personlighetsresultat:', error.message);
      }
    }
  };

  const handleRetakePersonalityTest = () => {
    setActiveTab("personality-intro");
  };

  const handleStartPersonalityTest = () => {
    setActiveTab("personality-test");
  };

  const handleStartChat = (profile: any) => {
    setSelectedMatch(profile);
    setShowAICompanion(true);
    
    // Track chat start
    if (user) {
      trackChatStart(user.id, profile.id);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedMatch) return;
    
    try {
      await sessionlessApiClient.sendMessage(selectedMatch.id, message);
      setActiveChat(selectedMatch);
      setShowAICompanion(false);
      setActiveTab("chats");
      console.log('[MESSAGE SUCCESS] Meddelande skickat med automatisk felåterställning');
    } catch (error) {
      console.error("Misslyckades att skicka meddelande (efter automatisk återställning):", error);
    }
  };

  const handleBackToMatches = () => {
    setSelectedMatch(null);
    setShowAICompanion(false);
    setActiveChat(null);
    setActiveTab("matches");
  };

  const handleConsentComplete = (consent: UserConsent) => {
    setUserConsent(consent);
    setShowConsentBanner(false);
    analytics.initialize(consent);
    privacyManager.manageCookies(consent);
  };

  const handleShowPrivacySettings = () => {
    setActiveTab("privacy");
  };

  const handleBackFromPrivacy = () => {
    setActiveTab("profile");
  };

  const handleSubscribe = (plan: string) => {
    setUserSubscription(plan as "free" | "premium" | "platinum");
    setActiveTab("profile");
  };

  // REMOVED: Mood checkin handlers enligt Figma-analys - oaktuell funktion

  // Loading state
  if (appState === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 animate-pulse">
            M
          </div>
          <p className="text-gray-600">Laddar MÄÄK Mood med automatisk felåterställning...</p>
        </div>
      </div>
    );
  }

  // Welcome screen
  if (appState === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} onLogin={handleLogin} />;
  }

  // Authentication screens
  if (appState === "auth") {
    return (
      <AuthScreens
        mode={authMode}
        onSuccess={handleAuthSuccess}
        onBack={handleBackToWelcome}
        onSwitchMode={setAuthMode}
      />
    );
  }

  // Onboarding flow
  if (appState === "onboarding") {
    console.log('[ONBOARDING] Onboarding-tillstånd:', { userProfile: !!userProfile, userPersonality: !!userPersonality });
    
    if (!userProfile) {
      console.log('[ONBOARDING] Visar ProfileCreation...');
      return <ProfileCreation onComplete={handleProfileComplete} />;
    }
    
    if (!userPersonality) {
      console.log('[ONBOARDING] Visar PersonalityTest...');
      return <PersonalityTest onComplete={handlePersonalityComplete} />;
    }

    // If we have both profile and personality, redirect to main app
    console.log('[ONBOARDING] Båda profil och personlighet finns, går till main app...');
    setAppState("main-app");
    setNeedsOnboarding(false);
    return null;
  }

  // Main application
  if (appState === "main-app") {
    // REMOVED: Daily mood check-in enligt Figma-analys - oaktuell funktion

    // Premium subscription view
    if (activeTab === "premium") {
      return (
        <PremiumSubscription
          onBack={() => setActiveTab("profile")}
          onSubscribe={handleSubscribe}
          currentPlan={userSubscription}
        />
      );
    }

    // Achievements view
    if (activeTab === "achievements") {
      return (
        <AchievementSystem
          onBack={() => setActiveTab("profile")}
          userAchievements={[]} // Would come from API
          totalPoints={1250}
        />
      );
    }

    // Design overview view (dev tool)
    if (activeTab === "design") {
      return (
        <DesignOverview
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Figma design system view (dev tool)
    if (activeTab === "figma") {
      return (
        <FigmaDesignSystem
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Figma exporter view (dev tool)
    if (activeTab === "export") {
      return (
        <FigmaExporter
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Figma import guide view (dev tool)
    if (activeTab === "import-guide") {
      return (
        <FigmaImportGuide
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Figma flow clarification view (dev tool)
    if (activeTab === "flow-clarification") {
      return (
        <FigmaFlowClarification
          onBack={() => setActiveTab("profile")}
          onStartExport={() => setActiveTab("import-guide")}
        />
      );
    }

    // Figma flow explanation view (dev tool)
    if (activeTab === "flow-explanation") {
      return (
        <FigmaFlowExplanation
          onBack={() => setActiveTab("profile")}
          onStartGuide={() => setActiveTab("import-guide")}
        />
      );
    }

    // Auth debug panel (dev tool)
    if (activeTab === "auth-debug") {
      return (
        <AuthDebugPanel
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Auto sync panel
    if (activeTab === "auto-sync") {
      return (
        <AutoSync
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Data security panel
    if (activeTab === "data-security") {
      return (
        <DataSecurity
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Quality control panel
    if (activeTab === "quality-control") {
      return (
        <QualityControl
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // System status panel
    if (activeTab === "system-status") {
      return (
        <SystemStatus
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Development tools panel
    if (activeTab === "dev-tools") {
      return (
        <DevelopmentTools
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Project dashboard panel
    if (activeTab === "project-dashboard") {
      return (
        <ProjectDashboard
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // GDPR compliance panel
    if (activeTab === "gdpr-compliance") {
      return (
        <GDPRCompliance
          onBack={() => setActiveTab("profile")}
          userId={user?.id}
        />
      );
    }

    // System demo panel
    if (activeTab === "system-demo") {
      return (
        <SystemDemo
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Prototype builder panel
    if (activeTab === "prototype-builder") {
      return (
        <FigmaPrototypeBuilder
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Archetype explorer panel
    if (activeTab === "archetype-explorer") {
      return (
        <ArchetypeExplorer
          onBack={() => setActiveTab("profile")}
          userPersonality={userPersonality}
        />
      );
    }

    // Feature showcase panel
    if (activeTab === "feature-showcase") {
      return (
        <FeatureShowcase
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Token-free demo panel
    if (activeTab === "token-free-demo") {
      return (
        <TokenFreeDemo
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // API debugger panel
    if (activeTab === "api-debugger") {
      return (
        <ApiDebugger
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Figma enhancements demo
    if (activeTab === "figma-enhancements") {
      return (
        <FigmaEnhancementDemo
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Personality test standalone
    if (activeTab === "personality-test") {
      return (
        <PersonalityTest
          onComplete={handlePersonalityComplete}
        />
      );
    }

    // Personality test demo
    if (activeTab === "personality-demo") {
      return (
        <PersonalityTestDemo
          onBack={() => setActiveTab("profile")}
        />
      );
    }

    // Personality test intro
    if (activeTab === "personality-intro") {
      return (
        <PersonalityTestIntro
          onStartTest={handleStartPersonalityTest}
          onBack={() => setActiveTab("profile")}
        />
      );
    }



    // AI Companion flow
    if (showAICompanion && selectedMatch) {
      return (
        <AICompanion
          matchProfile={selectedMatch}
          userPersonality={userPersonality}
          onSendMessage={handleSendMessage}
        />
      );
    }

    // Active chat view
    if (activeChat) {
      return (
        <ChatInterface
          matchProfile={activeChat}
          onBack={handleBackToMatches}
        />
      );
    }

    // Main tab content
    const renderTabContent = () => {
      switch (activeTab) {
        case "matches":
          return (
            <MatchingSystem
              userPersonality={userPersonality}
              onStartChat={handleStartChat}
            />
          );
        
        case "chats":
          return (
            <MatchTabs
              onStartChat={handleStartChat}
              onShowProfile={(profile) => {
                setSelectedMatch(profile);
                trackMatchView(user?.id || 'current-user', profile.id, profile.compatibilityScore);
              }}
            />
          );

        case "pairing":
          return (
            <CommunityFeatures 
              onStartChat={handleStartChat}
              userPersonality={userPersonality}
              userMatches={defaultUserMatches} // Mock data för matchade användare
            />
          );

        case "profile":
          return (
            <HingeProfile 
              onEdit={() => {
                // Navigate to profile editing
                console.log('Edit profile clicked');
              }}
              onRetakePersonalityTest={handleRetakePersonalityTest}
            />
          );

        case "profile-legacy":
          return (
            <div className="max-w-md mx-auto p-6 pb-20">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  {userProfile?.firstName?.[0] || "U"}
                </div>
                <h2 className="text-xl">{userProfile?.firstName || "Din profil"}</h2>
                {userPersonality && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">
                      {userPersonality.type} - {userPersonality.name}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Profil komplett</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Grundläggande info</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Personlighetstest</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Foton</span>
                      <span className="text-yellow-600">0/4</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Statistik</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl text-primary">12</div>
                      <div className="text-xs text-gray-600">Matchningar</div>
                    </div>
                    <div>
                      <div className="text-2xl text-primary">3</div>
                      <div className="text-xs text-gray-600">Konversationer</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Snabbåtkomst</h3>
                  <div className="space-y-2 text-sm">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("personality-test")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          🧠
                        </div>
                        <span>Personlighetstest</span>
                        <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">30 frågor</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("personality-demo")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          📊
                        </div>
                        <span>Test Demo & Guide</span>
                        <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">Info</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("premium")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          P
                        </div>
                        <span>Premium</span>
                        {userSubscription !== "free" && (
                          <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">{userSubscription}</Badge>
                        )}
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("achievements")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          A
                        </div>
                        <span>Prestationer</span>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    {/* REMOVED: Humör Check-in enligt Figma-analys - oaktuell funktion */}

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("design")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          D
                        </div>
                        <span>Design System</span>
                        <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">Dev</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("figma")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          F
                        </div>
                        <span>Figma System</span>
                        <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Pro</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("export")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          E
                        </div>
                        <span>TIDE Export</span>
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Auto</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("flow-explanation")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          EN
                        </div>
                        <span>Export Flow (EN)</span>
                        <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">English</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("flow-clarification")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          SV
                        </div>
                        <span>Korrekt Flöde (SV)</span>
                        <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs">Svenska</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("import-guide")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          G
                        </div>
                        <span>Steg-för-steg Guide</span>
                        <Badge className="ml-2 bg-pink-100 text-pink-800 text-xs">New</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("auth-debug")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          S
                        </div>
                        <span>Sessionless Auth Debug</span>
                        <Badge className="ml-2 bg-red-100 text-red-800 text-xs">New</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("auto-sync")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          SY
                        </div>
                        <span>Auto-Synkronisering</span>
                        <Badge className="ml-2 bg-emerald-100 text-emerald-800 text-xs">Säkerhet</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("data-security")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          DS
                        </div>
                        <span>Datasäkerhet</span>
                        <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Kritisk</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("quality-control")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          QC
                        </div>
                        <span>Kvalitetskontroll</span>
                        <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">Clean Code</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("system-status")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          SS
                        </div>
                        <span>Systemstatus</span>
                        <Badge className="ml-2 bg-gray-100 text-gray-800 text-xs">Övervakning</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("dev-tools")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-purple-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          DT
                        </div>
                        <span>Development Tools</span>
                        <Badge className="ml-2 bg-violet-100 text-violet-800 text-xs">TIDE→MÄÄK</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("project-dashboard")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-600 to-blue-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          PD
                        </div>
                        <span>Projekt Dashboard</span>
                        <Badge className="ml-2 bg-cyan-100 text-cyan-800 text-xs">Master Hub</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("gdpr-compliance")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          GD
                        </div>
                        <span>GDPR Efterlevnad</span>
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">EU-lag</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("system-demo")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          SD
                        </div>
                        <span>System Demo</span>
                        <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">Live Test</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("prototype-builder")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          PB
                        </div>
                        <span>Prototype Builder</span>
                        <Badge className="ml-2 bg-indigo-100 text-indigo-800 text-xs">Figma</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("archetype-explorer")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          AE
                        </div>
                        <span>Archetype Explorer</span>
                        <Badge className="ml-2 bg-purple-100 text-purple-800 text-xs">16 Typer</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("feature-showcase")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          FS
                        </div>
                        <span>Feature Showcase</span>
                        <Badge className="ml-2 bg-emerald-100 text-emerald-800 text-xs">Alla Nya</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("token-free-demo")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-emerald-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          TF
                        </div>
                        <span>Token-Free Auth</span>
                        <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Nytt System</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("api-debugger")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-red-600 to-orange-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          🔧
                        </div>
                        <span>API Debugger</span>
                        <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Fel-fix</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("figma-enhancements")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          FE
                        </div>
                        <span>Figma-förbättringar</span>
                        <Badge className="ml-2 bg-pink-100 text-pink-800 text-xs">Komplett</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={() => setActiveTab("profile-legacy")}
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-xs mr-2">
                          LP
                        </div>
                        <span>Legacy Profil</span>
                        <Badge className="ml-2 bg-gray-100 text-gray-800 text-xs">Före Hinge-fix</Badge>
                      </div>
                      <span className="text-gray-400">→</span>
                    </Button>

                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Inställningar</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>Notifikationer</span>
                      <div className="w-10 h-6 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Synlig för andra</span>
                      <div className="w-10 h-6 bg-primary rounded-full"></div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-0 h-auto"
                      onClick={handleShowPrivacySettings}
                    >
                      <span>Integritet & Data</span>
                      <span className="text-gray-400">→</span>
                    </Button>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={async () => {
                      const result = await sessionlessAuth.logout();
                      if (result.success) {
                        console.log('[LOGOUT SUCCESS] Utloggning lyckades med sessionless auth');
                        // App will automatically redirect due to auth state change
                      }
                    }}
                  >
                    Logga ut
                  </Button>
                </div>

                <div className="bg-white border rounded-lg p-4 mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setActiveTab("profile")}
                  >
                    ← Tillbaka till Hinge-stil Profil
                  </Button>
                </div>
              </div>
            </div>
          );

        case "privacy":
          return (
            <PrivacySettings
              userId={user?.id || ""}
              userEmail={user?.email || ""}
              onBack={handleBackFromPrivacy}
            />
          );

        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {renderTabContent()}
        {activeTab !== "privacy" && activeTab !== "profile-legacy" && activeTab !== "personality-test" && activeTab !== "personality-demo" && (
          <Navigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            unreadMessages={1}
          />
        )}
        
        {/* GDPR Consent Banner */}
        {showConsentBanner && (
          <ConsentBanner
            onConsentComplete={handleConsentComplete}
            onDismiss={() => setShowConsentBanner(false)}
          />
        )}
      </div>
    );
  }

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}