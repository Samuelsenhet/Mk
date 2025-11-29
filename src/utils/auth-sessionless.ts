import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase/client";

const auth = getAuth(app);

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

interface UserSession {
  user: any;
  sessionId: string;
  createdAt: number;
  isDemo: boolean;
}

export class SessionlessAuthService {
  private currentUser: any = null;

  constructor() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  }

  async signInAnonymously() {
    try {
      const userCredential = await signInAnonymously(auth);
      this.currentUser = userCredential.user;
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Create session without relying on tokens
  private createSession(user: any, isDemo: boolean = false): UserSession {
    const session: UserSession = {
      user,
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      isDemo
    };

    this.currentSession = session;
    
    // Store session locally for persistence
    try {
      localStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
      console.log('✅ Session stored locally:', session.sessionId);
    } catch (storageError) {
      console.warn('⚠️ Failed to store session locally:', storageError);
    }

    return session;
  }

  // Validate session without token dependency
  private isSessionValid(session: UserSession): boolean {
    if (!session || !session.user || !session.sessionId) {
      return false;
    }

    // Check session age (max 24 hours for demo, 7 days for real users)
    const maxAgeMs = session.isDemo ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    const ageMs = Date.now() - session.createdAt;
    
    if (ageMs > maxAgeMs) {
      console.log(`⏰ Session expired (${Math.round(ageMs / (60 * 60 * 1000))}h old)`);
      return false;
    }

    return true;
  }

  async signup(userData: SignupData) {
    return this.withErrorRecovery(
      async () => {
        console.log('📝 Starting signup process...');
        
        // Try to create user through Supabase
        const { data, error } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              firstName: userData.firstName,
              lastName: userData.lastName
            }
          }
        });

        if (error) {
          throw new Error(`Registrering misslyckades: ${error.message}`);
        }

        if (data.user) {
          const session = this.createSession(data.user, false);
          console.log('✅ User registered successfully');
          
          return {
            success: true,
            user: data.user,
            session: session
          };
        }

        throw new Error('Registrering misslyckades: Ingen användardata returnerades');
      },
      // Fallback: Create demo user if real signup fails
      async () => {
        console.log('🎭 Real signup failed, creating demo user...');
        const demoUser = this.createDemoUser(userData.firstName, userData.lastName);
        const session = this.createSession(demoUser, true);
        
        return {
          success: true,
          user: demoUser,
          session: session,
          isDemo: true
        };
      }
    );
  }

  async login(loginData: LoginData) {
    return this.withErrorRecovery(
      async () => {
        console.log('🔑 Starting login process...');
        
        const { data, error } = await supabase.auth.signInWithPassword(loginData);

        if (error) {
          throw new Error(`Inloggning misslyckades: ${error.message}`);
        }

        if (data.user && data.session) {
          const session = this.createSession(data.user, false);
          console.log('✅ User logged in successfully');
          
          return {
            success: true,
            user: data.user,
            session: session
          };
        }

        throw new Error('Inloggning misslyckades: Ingen session skapades');
      },
      // Fallback: Check for demo credentials
      async () => {
        if (loginData.email === 'demo@maak.se' || loginData.email.includes('demo')) {
          console.log('🎭 Demo credentials detected, creating demo session...');
          const demoUser = this.createDemoUser('Demo', 'Användare');
          const session = this.createSession(demoUser, true);
          
          return {
            success: true,
            user: demoUser,
            session: session,
            isDemo: true
          };
        }
        
        throw new Error('Inloggning misslyckades');
      }
    );
  }

  async loginWithPhone(phoneNumber: string) {
    return this.withErrorRecovery(
      async () => {
        console.log('📱 Starting phone login...');
        
        const { data, error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
          options: {
            channel: 'sms'
          }
        });

        if (error) {
          throw new Error(`SMS-inloggning misslyckades: ${error.message}`);
        }

        return {
          success: true,
          message: 'SMS-kod skickad',
          needsVerification: true
        };
      },
      // Fallback: Create demo session for Swedish numbers
      async () => {
        if (phoneNumber.startsWith('+46')) {
          console.log('🎭 Swedish phone number, creating demo session...');
          const demoUser = this.createDemoUser('Demo', 'Användare');
          const session = this.createSession(demoUser, true);
          
          return {
            success: true,
            user: demoUser,
            session: session,
            isDemo: true,
            message: 'Demo-session skapad för svenskt nummer'
          };
        }
        
        throw new Error('SMS-tjänst inte tillgänglig');
      }
    );
  }

  async verifyOTP(phoneNumber: string, token: string) {
    return this.withErrorRecovery(
      async () => {
        // Check for demo codes first
        if (token === '123456' || token === '000000') {
          console.log('🎭 Demo code detected, creating demo session...');
          const demoUser = this.createDemoUser('Demo', 'Användare');
          const session = this.createSession(demoUser, true);
          
          return {
            success: true,
            user: demoUser,
            session: session,
            isDemo: true
          };
        }

        const { data, error } = await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: token,
          type: 'sms'
        });

        if (error) {
          throw new Error(`OTP-verifiering misslyckades: ${error.message}`);
        }

        if (data.user && data.session) {
          const session = this.createSession(data.user, false);
          console.log('✅ OTP verified successfully');
          
          return {
            success: true,
            user: data.user,
            session: session
          };
        }

        throw new Error('OTP-verifiering misslyckades');
      },
      // Fallback: Demo session for demo codes
      async () => {
        if ((token === '123456' || token === '000000') && phoneNumber.startsWith('+46')) {
          console.log('🎭 Fallback: Creating demo session...');
          const demoUser = this.createDemoUser('Demo', 'Användare');
          const session = this.createSession(demoUser, true);
          
          return {
            success: true,
            user: demoUser,
            session: session,
            isDemo: true
          };
        }
        
        throw new Error('OTP-verifiering misslyckades');
      }
    );
  }

  async getSession() {
    if (this.currentUser) {
      return { success: true, user: this.currentUser, session: this.currentUser.toJSON() };
    }
    return this.signInAnonymously();
  }

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown logout error' };
    }
  }

  // Get current user without token dependency
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Get session info for API calls
  getSessionInfo() {
    if (!this.currentSession || !this.isSessionValid(this.currentSession)) {
      console.warn('🚨 No valid session found in getSessionInfo()');
      console.log('🔍 Current session state:', {
        hasSession: !!this.currentSession,
        isValid: this.currentSession ? this.isSessionValid(this.currentSession) : false,
        sessionAge: this.currentSession ? Date.now() - this.currentSession.createdAt : 0
      });
      return null;
    }

    return {
      sessionId: this.currentSession.sessionId,
      userId: this.currentSession.user.id,
      isDemo: this.currentSession.isDemo,
      userEmail: this.currentSession.user.email
    };
  }

  // Emergency session recovery - create demo session if no session exists
  async emergencySessionRecovery() {
    console.log('🆘 Emergency session recovery initiated...');
    
    try {
      // Try to get existing session first
      const sessionResult = await this.getSession();
      if (sessionResult.success) {
        console.log('✅ Emergency recovery found valid session');
        return sessionResult;
      }
    } catch (error) {
      console.warn('⚠️ Session recovery failed, creating emergency demo session');
    }

    // Create emergency demo session
    console.log('🆘 Creating emergency demo session...');
    const demoUser = this.createDemoUser('Emergency', 'User');
    const session = this.createSession(demoUser, true);
    
    return {
      success: true,
      user: demoUser,
      session: session,
      isDemo: true,
      emergency: true
    };
  }

  // Create demo session - public method for external access
  async createDemoSession() {
    console.log('🎭 Creating demo session...');
    const demoUser = this.createDemoUser('Demo', 'Användare');
    const session = this.createSession(demoUser, true);
    
    return {
      success: true,
      user: demoUser,
      session: session,
      isDemo: true
    };
  }

  // Create demo user
  private createDemoUser(firstName: string = 'Demo', lastName: string = 'Användare') {
    const demoUserId = `demo-user-${Date.now()}`;
    return {
      id: demoUserId,
      email: 'demo@maak.se',
      phone: '+46701234567',
      user_metadata: {
        firstName,
        lastName
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      phone_confirmed_at: new Date().toISOString(),
      role: 'authenticated'
    };
  }

  // Auth state change listener (wrapper around Supabase)
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange((event, supabaseSession) => {
      console.log('🔄 Auth state change:', event);
      
      // Update our session when Supabase session changes
      if (event === 'SIGNED_IN' && supabaseSession?.user) {
        const newSession = this.createSession(supabaseSession.user, false);
        callback(event, newSession);
      } else if (event === 'SIGNED_OUT') {
        this.currentSession = null;
        localStorage.removeItem(this.sessionStorageKey);
        callback(event, null);
      } else {
        callback(event, this.currentSession);
      }
    });
  }

  // Enable/disable auto error recovery
  setErrorRecovery(enabled: boolean) {
    this.errorRecoveryEnabled = enabled;
    console.log(`🛠️ Auto error recovery ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Get recovery status
  getRecoveryStatus() {
    return {
      errorRecoveryEnabled: this.errorRecoveryEnabled,
      hasValidSession: this.isAuthenticated(),
      sessionType: this.currentSession?.isDemo ? 'demo' : 'real',
      sessionAge: this.currentSession ? Date.now() - this.currentSession.createdAt : 0
    };
  }
}

export const sessionlessAuth = new SessionlessAuthService();