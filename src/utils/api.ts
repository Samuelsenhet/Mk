import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e34211d6`;

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    console.log('🔧 setAccessToken called with:', token ? `${token.substring(0, 20)}...` : 'null');
    this.accessToken = token;
    
    if (token) {
      const tokenType = token.startsWith('demo-token-') ? 'Demo' : 'Supabase';
      const preview = token.substring(0, 20) + '...';
      console.log(`🔑 API Client token updated [${tokenType}]:`, preview);
      
      // For demo tokens, validate they're not expired
      if (token.startsWith('demo-token-')) {
        const timestamp = parseInt(token.replace('demo-token-', ''));
        const age = (Date.now() - timestamp) / (1000 * 60 * 60);
        if (age > 24) {
          console.warn('⚠️ Demo token är', Math.round(age), 'timmar gammal (max 24h)');
        } else {
          console.log('✅ Demo token är', Math.round(age * 10) / 10, 'timmar gammal (giltig)');
        }
      }
    } else {
      console.log('🔑 API Client token cleared (set to null)');
    }
    
    // Immediately verify the token was stored
    console.log('🔍 Verification - stored token:', this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null');
  }

  private async request(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<any> {
    const url = `${BASE_URL}${endpoint}`;
    const maxRetries = 2;
    
    // Detailed token debugging
    console.log(`🌐 API Request [${retryCount}/${maxRetries}]:`, endpoint);
    console.log(`🔍 Current stored token:`, this.accessToken ? `${this.accessToken.substring(0, 20)}...` : 'null');
    
    // Use access token if available, otherwise fall back to public anon key for open endpoints
    let authToken: string | null = null;
    
    if (this.accessToken) {
      authToken = this.accessToken;
      console.log(`🔑 Using stored token [${this.accessToken.startsWith('demo-token-') ? 'Demo' : 'Supabase'}]`);
    } else if (endpoint.includes('/auth/') || endpoint.includes('/health')) {
      authToken = publicAnonKey;
      console.log(`🔑 Using public anon key for open endpoint: ${endpoint}`);
    } else {
      console.error('❌ No authentication token available for protected endpoint:', endpoint);
      console.error('❌ Stored accessToken:', this.accessToken);
      console.error('❌ PublicAnonKey available:', !!publicAnonKey);
      
      // Try to recover token from localStorage
      try {
        console.log('🛠️ Attempting token recovery from localStorage...');
        const storedSession = localStorage.getItem('demo-session');
        if (storedSession) {
          const demoSession = JSON.parse(storedSession);
          if (demoSession.access_token?.startsWith('demo-token-')) {
            const timestamp = parseInt(demoSession.access_token.replace('demo-token-', ''));
            const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
            
            if (ageHours < 25 && ageHours > -1) {
              console.log('✅ Valid demo token found in localStorage, using it');
              this.setAccessToken(demoSession.access_token);
              authToken = demoSession.access_token;
            } else {
              console.log('⏰ Demo token expired, removing');
              localStorage.removeItem('demo-session');
            }
          }
        }
      } catch (recoveryError) {
        console.warn('⚠️ Token recovery failed:', recoveryError);
      }
      
      // If still no token after recovery attempt
      if (!authToken) {
        throw new Error('Ingen autentiseringstoken tillgänglig. Vänligen logga in igen.');
      }
    }
    
    console.log(`🔐 Final auth token for ${endpoint}:`, authToken ? `${authToken.substring(0, 20)}...` : 'null');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...options.headers,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
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
          console.warn('Failed to parse error response as JSON:', jsonError);
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        // Enhanced 401 error handling with better logic
        if (response.status === 401 && retryCount < maxRetries) {
          console.warn(`🔐 401 Unauthorized [attempt ${retryCount + 1}/${maxRetries + 1}] - Attempting to recover...`);
          
          // Handle demo tokens
          if (this.accessToken?.startsWith('demo-token-')) {
            console.log('🎭 Demo token 401 - validating demo session...');
            
            try {
              const storedSession = localStorage.getItem('demo-session');
              if (storedSession) {
                const demoSession = JSON.parse(storedSession);
                
                // Check if token matches and is still valid (within 24h)
                if (demoSession.access_token && demoSession.access_token !== this.accessToken) {
                  console.log('🔄 Demo token mismatch, updating to stored token...');
                  this.setAccessToken(demoSession.access_token);
                  return this.request(endpoint, options, retryCount + 1);
                }
                
                // Check token age with same tolerance as server
                const timestamp = parseInt(demoSession.access_token.replace('demo-token-', ''));
                if (!isNaN(timestamp) && timestamp > 0) {
                  const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
                  
                  // Use 25h limit (24h + 1h grace) to match server validation
                  if (ageHours < 25 && ageHours > -1) {
                    console.log(`✅ Demo token still valid (${Math.round(ageHours * 10) / 10}h old), retrying...`);
                    // Progressive backoff: wait longer on subsequent retries
                    const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 5000);
                    await new Promise(resolve => setTimeout(resolve, backoffDelay));
                    return this.request(endpoint, options, retryCount + 1);
                  } else {
                    console.log(`⏰ Demo token expired (${Math.round(ageHours)}h old, max 24h), clearing session`);
                    localStorage.removeItem('demo-session');
                    this.setAccessToken(null);
                    throw new Error('Demo-session har gått ut efter 24 timmar. Logga in igen.');
                  }
                } else {
                  console.log('❌ Invalid demo token timestamp format');
                  localStorage.removeItem('demo-session');
                  this.setAccessToken(null);
                  throw new Error('Demo-token har ogiltigt format. Logga in igen.');
                }
              } else {
                console.log('❌ No demo session found in localStorage');
                this.setAccessToken(null);
                throw new Error('Demo-session hittades inte. Logga in igen.');
              }
            } catch (demoError) {
              console.error('💥 Demo session validation error:', demoError);
              
              // If it's already a specific error message, re-throw it
              if (demoError instanceof Error && 
                  (demoError.message.includes('gått ut') || 
                   demoError.message.includes('hittades inte') ||
                   demoError.message.includes('ogiltigt format'))) {
                throw demoError;
              }
              
              // Generic fallback error with more helpful message
              throw new Error('Demo-session kunde inte valideras. Prova logga in igen eller använd diagnostikpanelen.');
            }
          } else {
            // Handle real Supabase tokens
            console.log('🔄 Supabase token 401 - attempting session refresh...');
            try {
              const { authService } = await import('./auth');
              const sessionResult = await authService.getSession();
              
              if (sessionResult.success && sessionResult.session?.access_token) {
                if (sessionResult.session.access_token !== this.accessToken) {
                  console.log('✅ New Supabase session obtained, retrying...');
                  this.setAccessToken(sessionResult.session.access_token);
                  return this.request(endpoint, options, retryCount + 1);
                } else {
                  console.log('⚠️ Same token returned, may be server issue');
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  return this.request(endpoint, options, retryCount + 1);
                }
              } else {
                console.log('❌ Session refresh failed or no valid session');
                throw new Error('Session kunde inte uppdateras. Logga in igen.');
              }
            } catch (refreshError) {
              console.error('❌ Session refresh failed:', refreshError);
              throw new Error('Session-uppdatering misslyckades. Logga in igen.');
            }
          }
        }
        
        // Log detailed error info for debugging
        console.error(`❌ API Error [${response.status}] ${endpoint}:`, errorData);
        
        const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log(`✅ API Success [${endpoint}]:`, Object.keys(responseData).join(', '));
      return responseData;
      
    } catch (error) {
      console.error(`💥 API Exception [${endpoint}]:`, error);
      
      // Handle network errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Begäran tog för lång tid. Kontrollera din internetanslutning.');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Nätverksfel. Kontrollera din internetanslutning och försök igen.');
        }
        if (error.message.includes('401') || error.message.includes('gått ut') || error.message.includes('logga in')) {
          throw error; // Re-throw auth errors as-is
        }
        if (error.message.includes('403')) {
          throw new Error('Åtkomst nekad. Du har inte behörighet för denna åtgärd.');
        }
        if (error.message.includes('404')) {
          throw new Error('Resursen hittades inte.');
        }
        if (error.message.includes('500')) {
          throw new Error('Serverfel. Försök igen om en stund.');
        }
      }
      
      // Generic fallback
      throw new Error(error instanceof Error ? error.message : 'Okänt nätverksfel. Försök igen.');
    }
  }

  // Authentication
  async signup(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Profile management
  async createProfile(profileData: any) {
    return this.request('/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile() {
    return this.request('/profile');
  }

  // Personality test
  async savePersonalityResults(personalityData: any) {
    return this.request('/personality', {
      method: 'POST',
      body: JSON.stringify(personalityData),
    });
  }

  async getPersonalityResults() {
    return this.request('/personality');
  }

  // Matching
  async getMatches() {
    return this.request('/matches');
  }

  // Chat
  async sendMessage(recipientId: string, message: string, type = 'text') {
    return this.request('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ recipientId, message, type }),
    });
  }

  async getChatHistory(recipientId: string) {
    return this.request(`/chat/${recipientId}`);
  }

  // Community
  async getDailyQuestion() {
    return this.request('/community/daily-question');
  }

  async answerDailyQuestion(answerIndex: number) {
    return this.request('/community/daily-question/answer', {
      method: 'POST',
      body: JSON.stringify({ answerIndex }),
    });
  }

  // Privacy & GDPR compliance
  async updateUserConsent(consentData: any) {
    return this.request('/privacy/consent', {
      method: 'POST',
      body: JSON.stringify(consentData),
    });
  }

  async getUserConsent() {
    return this.request('/privacy/consent');
  }

  async requestDataExport(exportRequest: any) {
    return this.request('/privacy/export', {
      method: 'POST',
      body: JSON.stringify(exportRequest),
    });
  }

  async requestDataDeletion(deletionRequest: any) {
    return this.request('/privacy/delete', {
      method: 'POST',
      body: JSON.stringify(deletionRequest),
    });
  }

  // Analytics tracking
  async logAnalytics(analyticsEvent: any) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(analyticsEvent),
    });
  }

  // Debug method to check current token status
  getTokenStatus() {
    return {
      hasToken: !!this.accessToken,
      tokenType: this.accessToken?.startsWith('demo-token-') ? 'demo' : 'supabase',
      tokenPreview: this.accessToken ? this.accessToken.substring(0, 20) + '...' : null,
      tokenLength: this.accessToken?.length || 0
    };
  }

  // Health check - always use public anon key, no user auth required
  async healthCheck() {
    const url = `${BASE_URL}/health`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Always use public key for health
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
}

export const apiClient = new ApiClient();