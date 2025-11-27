import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';
import { apiClient } from './api';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  
  async signup(userData: SignupData) {
    try {
      // First create user through our backend (which handles email confirmation)
      const backendResult = await apiClient.signup(userData);
      
      if (!backendResult.success) {
        throw new Error(backendResult.error || 'Signup failed');
      }

      // Then sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });

      if (error) {
        throw new Error(`Login after signup failed: ${error.message}`);
      }

      if (data.session?.access_token) {
        apiClient.setAccessToken(data.session.access_token);
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown signup error'
      };
    }
  }

  async login(loginData: LoginData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(loginData);

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.access_token) {
        apiClient.setAccessToken(data.session.access_token);
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown login error'
      };
    }
  }

  async logout() {
    try {
      // Clear the API client token first
      apiClient.setAccessToken(null);
      
      // Clear any demo session
      localStorage.removeItem('demo-session');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn('Supabase logout warning:', error);
        // Don't throw - local cleanup is more important
      }

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown logout error'
      };
    }
  }

  async getSession() {
    try {
      console.log('🔍 Getting session...');
      
      // First try to get demo session from localStorage
      const storedSession = localStorage.getItem('demo-session');
      if (storedSession) {
        console.log('📱 Found stored demo session');
        try {
          const demoSession = JSON.parse(storedSession);
          
          if (demoSession.access_token?.startsWith('demo-token-') && demoSession.user) {
            console.log('🎭 Valid demo session structure found');
            
            // Extract and validate demo token timestamp
            const tokenTimestamp = parseInt(demoSession.access_token.replace('demo-token-', ''));
            if (!isNaN(tokenTimestamp) && tokenTimestamp > 0) {
              const now = Date.now();
              const hoursPassed = (now - tokenTimestamp) / (1000 * 60 * 60);
              
              // Use 25-hour limit (24h + 1h grace period) to match server
              if (hoursPassed < 25 && hoursPassed > -1) {
                console.log('🔧 Setting API client token from stored demo session...');
                apiClient.setAccessToken(demoSession.access_token);
                
                // Immediately verify token was set
                const tokenStatus = apiClient.getTokenStatus();
                console.log('🔍 Token status after setting:', tokenStatus);
                
                const remaining = Math.max(0, 24 - hoursPassed);
                console.log(`✅ Demo session restored (${Math.round(remaining)}h remaining)`);
                
                return {
                  success: true,
                  session: demoSession,
                  user: demoSession.user,
                  isDemoSession: true
                };
              } else {
                console.log(`⏰ Demo session expired (${Math.round(hoursPassed)}h old, max 24h)`);
                localStorage.removeItem('demo-session');
              }
            } else {
              console.log('❌ Invalid demo token timestamp format');
              localStorage.removeItem('demo-session');
            }
          }
        } catch (parseError) {
          console.warn('❌ Failed to parse stored demo session:', parseError);
          localStorage.removeItem('demo-session');
        }
      }

      // Try to get real Supabase session with better error handling
      try {
        console.log('🔍 Checking Supabase session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('⚠️ Supabase session error:', error.message);
          // Don't throw immediately - check if it's a critical error
          if (error.message.includes('refresh_token') || error.message.includes('expired')) {
            console.log('🔄 Session expired, clearing local state');
            // Session is expired, continue to no session case
          } else {
            console.error('❌ Critical Supabase session error:', error);
          }
          return { success: false, error: error.message };
        }

        if (session?.user) {
          console.log('✅ Valid Supabase session found:', session.user.id);
          
          // Set token for API calls
          if (session.access_token) {
            apiClient.setAccessToken(session.access_token);
            console.log('🔑 API token set from Supabase session');
          }
          
          return {
            success: true,
            session,
            user: session.user,
            isDemoSession: false
          };
        } else {
          console.log('ℹ️ No valid Supabase session found');
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase connection issue:', supabaseError);
        // Don't throw - fallback to no session
      }

      // No valid session found
      console.log('❌ No valid session found (demo or Supabase)');
      return {
        success: false,
        error: 'No valid session found'
      };
      
    } catch (error) {
      console.error('💥 Critical session check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown session error'
      };
    }
  }

  // Demo user creation for testing
  private createDemoUser() {
    const demoUserId = `demo-user-${Date.now()}`;
    const demoUser = {
      id: demoUserId,
      email: 'demo@maak.se',
      phone: '+46701234567',
      user_metadata: {
        firstName: 'Demo',
        lastName: 'Användare'
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      phone_confirmed_at: new Date().toISOString(),
      role: 'authenticated'
    };
    
    return demoUser;
  }

  // Create fresh demo session - public method for external access
  createDemoSession() {
    const demoUser = this.createDemoUser();
    const demoToken = `demo-token-${Date.now()}`;
    
    const demoSession = {
      access_token: demoToken,
      refresh_token: `demo-refresh-${Date.now()}`,
      expires_in: 86400, // 24 hours
      expires_at: Math.floor(Date.now() / 1000) + 86400,
      token_type: 'bearer' as const,
      user: demoUser
    };
    
    // Store demo session locally
    localStorage.setItem('demo-session', JSON.stringify(demoSession));
    
    // Set token for API calls
    apiClient.setAccessToken(demoSession.access_token);
    
    console.log('✅ Fresh demo session created:', demoUser.id);
    console.log('🔑 New demo token:', demoSession.access_token.substring(0, 20) + '...');
    
    return {
      success: true,
      user: demoUser,
      session: demoSession,
      isDemo: true
    };
  }

  // Phone authentication with demo fallback
  async loginWithPhone(phoneNumber: string) {
    try {
      console.log('Attempting phone authentication for:', phoneNumber);
      
      // First try real SMS authentication
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: {
          channel: 'sms'
        }
      });

      if (error) {
        console.warn('SMS authentication error:', error.message);
        
        // Check if it's a provider limitation
        if (error.message.includes('Unsupported phone provider') || 
            error.message.includes('SMS not supported') ||
            error.message.includes('provider') ||
            phoneNumber.startsWith('+46')) {
          console.log('🎭 SMS inte tillgängligt för detta nummer, använder demo-läge');
          
          // Create demo session immediately for unsupported providers
          return this.createDemoSession();
        }
        
        throw error;
      }

      console.log('✅ SMS sent successfully to:', phoneNumber);
      return {
        success: true,
        message: 'SMS-kod skickad',
        needsVerification: true
      };
      
    } catch (error) {
      console.error('Phone login error:', error);
      
      // For demo purposes, fallback to demo session for Swedish numbers
      if (phoneNumber.startsWith('+46')) {
        console.log('🎭 Skapar demo-session för svenskt nummer');
        return this.createDemoSession();
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Okänt fel vid telefon-inloggning'
      };
    }
  }

  // Verify OTP with demo fallback
  async verifyOTP(phoneNumber: string, token: string) {
    try {
      console.log('Verifying OTP for:', phoneNumber, 'with token:', token);
      
      // Check if this is a demo code
      if (token === '123456' || token === '000000') {
        console.log('🎭 Demo-kod upptäckt, skapar demo-session');
        
        // Create demo user
        const demoUser = this.createDemoUser();
        const demoToken = `demo-token-${Date.now()}`;
        
        const demoSession = {
          access_token: demoToken,
          refresh_token: `demo-refresh-${Date.now()}`,
          expires_in: 86400, // 24 hours
          expires_at: Math.floor(Date.now() / 1000) + 86400,
          token_type: 'bearer' as const,
          user: demoUser
        };
        
        // Store demo session locally for persistence
        localStorage.setItem('demo-session', JSON.stringify(demoSession));
        
        // Set demo token for API calls
        apiClient.setAccessToken(demoSession.access_token);
        
        console.log('✅ Demo-användare autentiserad:', demoUser.id);
        console.log('🔑 Demo-token:', demoSession.access_token.substring(0, 20) + '...');
        
        return {
          success: true,
          user: demoUser,
          session: demoSession,
          isDemo: true
        };
      }

      // Try real OTP verification
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: token,
        type: 'sms'
      });

      if (error) {
        // If it's a provider error and user is using demo code, fallback to demo
        if ((error.message.includes('Unsupported phone provider') || 
             error.message.includes('provider') ||
             error.message.includes('Invalid') ||
             phoneNumber.startsWith('+46')) && 
            (token === '123456' || token === '000000')) {
          
          console.log('🎭 Provider error with demo code, creating demo session');
          return this.createDemoSession();
        }
        
        throw error;
      }

      if (data.session?.access_token) {
        apiClient.setAccessToken(data.session.access_token);
      }

      console.log('✅ Real OTP verification successful');
      return {
        success: true,
        user: data.user,
        session: data.session,
        isDemo: false
      };
      
    } catch (error) {
      console.error('OTP verification error:', error);
      
      // Final fallback for demo codes
      if ((token === '123456' || token === '000000') && phoneNumber.startsWith('+46')) {
        console.log('🎭 Final fallback: Creating demo session for Swedish number with demo code');
        return this.createDemoSession();
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Okänt fel vid OTP-verifiering'
      };
    }
  }

  // Auth state change listener
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.warn('Get user error:', error);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Refresh session
  async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      if (data.session?.access_token) {
        apiClient.setAccessToken(data.session.access_token);
      }
      
      return {
        success: true,
        session: data.session,
        user: data.user
      };
    } catch (error) {
      console.error('Session refresh error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Session refresh failed'
      };
    }
  }
}

export const authService = new AuthService();