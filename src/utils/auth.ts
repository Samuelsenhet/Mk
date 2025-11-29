import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { app } from "./firebase/client";
import { apiClient } from './api';

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

export class AuthService {
  
  async signup(userData: SignupData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      // You might want to create a user profile in Firestore here as well
      return { success: true, user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown signup error' };
    }
  }

  async login(loginData: LoginData) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown login error' };
    }
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

  getSession() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve({ success: true, user, session: user.toJSON() });
        } else {
          resolve({ success: false, error: 'No user is signed in.' });
        }
      });
    });
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
  onAuthStateChange(callback: (user: any) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Refresh session (handled automatically by Firebase SDK)
  async refreshSession() {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      apiClient.setAccessToken(token);
      return { success: true, user };
    }
    return { success: false, error: 'No user is signed in.' };
  }
}

export const authService = new AuthService();