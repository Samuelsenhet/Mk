import { projectId, publicAnonKey } from './supabase/info';
import { sessionlessAuth } from './auth-sessionless';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e34211d6`;

class SessionlessApiClient {
  private autoRetryEnabled = true;
  private maxRetries = 3;

  // Auto error correction system for API calls
  private async withAutoCorrection<T>(
    operation: () => Promise<T>,
    context: string,
    retryCount = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      // Only log if it's the first attempt or final failure
      if (retryCount === 0 || retryCount >= this.maxRetries - 1) {
        console.warn(`🔄 API error in ${context} (attempt ${retryCount + 1}/${this.maxRetries}):`, error);
      }
      
      if (this.autoRetryEnabled && retryCount < this.maxRetries - 1) {
        // Check if it's a recoverable error
        if (error instanceof Error) {
          // Session/auth errors
          if (error.message.includes('401') || 
              error.message.includes('Unauthorized') ||
              error.message.includes('session') ||
              error.message.includes('authenticated')) {
            
            console.log('🔐 Auth error detected, attempting session recovery...');
            try {
              const sessionResult = await sessionlessAuth.getSession();
              if (sessionResult.success) {
                console.log('✅ Session recovered, retrying operation...');
                await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
                return this.withAutoCorrection(operation, context, retryCount + 1);
              }
            } catch (recoveryError) {
              console.warn('⚠️ Session recovery failed:', recoveryError);
            }
          }
          
          // Network/connectivity errors
          if (error.message.includes('fetch') || 
              error.message.includes('network') ||
              error.message.includes('timeout')) {
            
            console.log('🌐 Network error detected, retrying with backoff...');
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            return this.withAutoCorrection(operation, context, retryCount + 1);
          }
          
          // Server errors (5xx)
          if (error.message.includes('500') || 
              error.message.includes('502') ||
              error.message.includes('503')) {
            
            console.log('🖥️ Server error detected, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return this.withAutoCorrection(operation, context, retryCount + 1);
          }
        }
      }
      
      throw error;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    return this.withAutoCorrection(
      async () => {
        const url = `${BASE_URL}${endpoint}`;
        console.log(`🌐 API Request: ${endpoint}`);
        
        // Get session info and validate
        const sessionInfo = sessionlessAuth.getSessionInfo();
        console.log(`🔍 Session info for ${endpoint}:`, sessionInfo ? {
          userId: sessionInfo.userId?.substring(0, 15) + '...',
          sessionId: sessionInfo.sessionId?.substring(0, 20) + '...',
          isDemo: sessionInfo.isDemo
        } : 'null');
        
        // Build headers based on endpoint requirements
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        // Check if this endpoint requires authentication
        const isProtectedEndpoint = endpoint.includes('/matches') || 
                                   endpoint.includes('/profile') || 
                                   endpoint.includes('/personality') ||
                                   endpoint.includes('/community') ||
                                   endpoint.includes('/privacy');
        
        if (isProtectedEndpoint) {
          if (sessionInfo && sessionInfo.sessionId) {
            // Use session-based auth for protected endpoints (TOKEN-FREE APPROACH)
            headers['X-Session-Id'] = sessionInfo.sessionId;
            headers['X-User-ID'] = sessionInfo.userId;
            headers['X-Is-Demo'] = sessionInfo.isDemo ? 'true' : 'false';
            headers['Authorization'] = `Bearer ${publicAnonKey}`; // Still include for Supabase access
            console.log(`🔑 Protected endpoint with session: ${sessionInfo.sessionId.substring(0, 20)}...`);
          } else {
            console.error('🚨 No valid session found for protected endpoint:', endpoint);
            console.log('🆘 Attempting emergency session recovery...');
            
            try {
              const emergencyResult = await sessionlessAuth.emergencySessionRecovery();
              if (emergencyResult.success && emergencyResult.session) {
                const emergencySessionInfo = sessionlessAuth.getSessionInfo();
                if (emergencySessionInfo) {
                  headers['X-Session-Id'] = emergencySessionInfo.sessionId;
                  headers['X-User-ID'] = emergencySessionInfo.userId;
                  headers['X-Is-Demo'] = emergencySessionInfo.isDemo ? 'true' : 'false';
                  console.log('🆘 Using emergency session with Authorization header');
                } else {
                  console.warn('🆘 Emergency session recovered but no session info available, using public auth');
                }
              } else {
                console.warn('🆘 Emergency session recovery failed, using public auth only');
              }
            } catch (emergencyError) {
              console.warn('🚨 Emergency recovery failed, proceeding anyway:', emergencyError);
              // Continue anyway - server will return 401 if needed
            }
          }
        } else {
          // Public endpoints only need basic auth
          headers['Authorization'] = `Bearer ${publicAnonKey}`;
          console.log(`🔑 Public endpoint with Bearer token: ${endpoint}`);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        try {
          const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            let errorData: any = {};
            try {
              errorData = await response.json();
            } catch (jsonError) {
              errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
            }

            const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
            
            // Only log critical errors (not 401 or 500 since we handle them gracefully)
            if (response.status !== 401 && response.status !== 500) {
              console.error(`❌ API Error [${response.status}] ${endpoint}:`, errorMessage);
            } else {
              console.warn(`⚠️ API Warning [${response.status}] ${endpoint}:`, errorMessage, '(will retry or use fallback)');
            }
            
            throw new Error(errorMessage);
          }

          const responseData = await response.json();
          console.log(`✅ API Success [${endpoint}]`);
          return responseData;

        } catch (fetchError) {
          clearTimeout(timeoutId);
          
          if (fetchError instanceof Error) {
            if (fetchError.name === 'AbortError') {
              throw new Error('Begäran tog för lång tid. Kontrollera din internetanslutning.');
            }
            if (fetchError.message.includes('Failed to fetch')) {
              throw new Error('Nätverksfel. Kontrollera din internetanslutning.');
            }
          }
          
          throw fetchError;
        }
      },
      `request:${endpoint}`
    );
  }

  // Authentication endpoints
  async signup(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
  }) {
    return this.withAutoCorrection(
      () => this.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
      'signup'
    );
  }

  // Profile management
  async createProfile(profileData: any) {
    return this.withAutoCorrection(
      () => this.request('/profile', {
        method: 'POST',
        body: JSON.stringify(profileData),
      }),
      'createProfile'
    );
  }

  async getProfile() {
    return this.withAutoCorrection(
      () => this.request('/profile'),
      'getProfile'
    );
  }

  // Personality test
  async savePersonalityResults(personalityData: any) {
    return this.withAutoCorrection(
      () => this.request('/personality', {
        method: 'POST',
        body: JSON.stringify(personalityData),
      }),
      'savePersonalityResults'
    );
  }

  async getPersonalityResults() {
    return this.withAutoCorrection(
      () => this.request('/personality'),
      'getPersonalityResults'
    );
  }

  // Matching
  async getMatches() {
    return this.withAutoCorrection(
      () => this.request('/matches'),
      'getMatches'
    );
  }

  // Chat
  async sendMessage(recipientId: string, message: string, type = 'text') {
    return this.withAutoCorrection(
      () => this.request('/chat/send', {
        method: 'POST',
        body: JSON.stringify({ recipientId, message, type }),
      }),
      'sendMessage'
    );
  }

  async getChatHistory(recipientId: string) {
    return this.withAutoCorrection(
      () => this.request(`/chat/${recipientId}`),
      'getChatHistory'
    );
  }

  // Community
  async getDailyQuestion() {
    return this.withAutoCorrection(
      () => this.request('/community/daily-question'),
      'getDailyQuestion'
    );
  }

  async answerDailyQuestion(answerIndex: number) {
    return this.withAutoCorrection(
      () => this.request('/community/daily-question/answer', {
        method: 'POST',
        body: JSON.stringify({ answerIndex }),
      }),
      'answerDailyQuestion'
    );
  }

  // Social Media Trends (NYTT)
  async getSocialMediaTrends(personalityType?: string) {
    return this.withAutoCorrection(
      () => this.request(`/community/social-trends${personalityType ? `?personality=${personalityType}` : ''}`),
      'getSocialMediaTrends'
    );
  }

  async likeSocialPost(postId: string) {
    return this.withAutoCorrection(
      () => this.request('/community/social-trends/like', {
        method: 'POST',
        body: JSON.stringify({ postId }),
      }),
      'likeSocialPost'
    );
  }

  // Daily Matches System (NYTT)
  async getDailyMatches(personalityType?: string) {
    return this.withAutoCorrection(
      () => this.request(`/matches/daily${personalityType ? `?personality=${personalityType}` : ''}`),
      'getDailyMatches'
    );
  }

  async refreshDailyMatches() {
    return this.withAutoCorrection(
      () => this.request('/matches/daily/refresh', {
        method: 'POST',
      }),
      'refreshDailyMatches'
    );
  }

  // Privacy & GDPR compliance
  async updateUserConsent(consentData: any) {
    return this.withAutoCorrection(
      () => this.request('/privacy/consent', {
        method: 'POST',
        body: JSON.stringify(consentData),
      }),
      'updateUserConsent'
    );
  }

  async getUserConsent() {
    return this.withAutoCorrection(
      () => this.request('/privacy/consent'),
      'getUserConsent'
    );
  }

  async requestDataExport(exportRequest: any) {
    return this.withAutoCorrection(
      () => this.request('/privacy/export', {
        method: 'POST',
        body: JSON.stringify(exportRequest),
      }),
      'requestDataExport'
    );
  }

  async requestDataDeletion(deletionRequest: any) {
    return this.withAutoCorrection(
      () => this.request('/privacy/delete', {
        method: 'POST',
        body: JSON.stringify(deletionRequest),
      }),
      'requestDataDeletion'
    );
  }

  // Analytics tracking
  async logAnalytics(analyticsEvent: any) {
    return this.withAutoCorrection(
      () => this.request('/analytics/track', {
        method: 'POST',
        body: JSON.stringify(analyticsEvent),
      }),
      'logAnalytics'
    );
  }

  // Health check - TOKEN FREE
  async healthCheck() {
    // Health check doesn't use auto-correction to avoid infinite loops
    const url = `${BASE_URL}/health`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Use standard Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Health check failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Configuration methods
  setAutoRetry(enabled: boolean) {
    this.autoRetryEnabled = enabled;
    console.log(`🔄 Auto retry ${enabled ? 'enabled' : 'disabled'}`);
  }

  setMaxRetries(maxRetries: number) {
    this.maxRetries = Math.max(1, Math.min(10, maxRetries));
    console.log(`🔄 Max retries set to ${this.maxRetries}`);
  }

  // Status methods
  getClientStatus() {
    const sessionInfo = sessionlessAuth.getSessionInfo();
    return {
      autoRetryEnabled: this.autoRetryEnabled,
      maxRetries: this.maxRetries,
      hasValidSession: !!sessionInfo,
      sessionType: sessionInfo?.isDemo ? 'demo' : 'real',
      userId: sessionInfo?.userId,
      isAuthenticated: sessionlessAuth.isAuthenticated()
    };
  }
}

export const sessionlessApiClient = new SessionlessApiClient();