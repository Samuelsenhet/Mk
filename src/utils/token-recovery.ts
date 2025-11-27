/**
 * Token Recovery Utility
 * Handles situations where API client loses its token
 */

import { apiClient } from './api';
import { authService } from './auth';

interface TokenRecoveryResult {
  success: boolean;
  tokenFound: boolean;
  tokenSet: boolean;
  source: 'localStorage' | 'authService' | 'none';
  error?: string;
}

export async function recoverToken(): Promise<TokenRecoveryResult> {
  console.log('🛠️ Token recovery initiated...');
  
  // Check if API client already has a token
  const currentStatus = apiClient.getTokenStatus();
  if (currentStatus.hasToken && currentStatus.isValid) {
    console.log('✅ API client already has valid token');
    return {
      success: true,
      tokenFound: true,
      tokenSet: true,
      source: 'none'
    };
  }
  
  console.log('🔍 API client missing token, attempting recovery...');
  
  // Try to recover from localStorage (demo sessions)
  try {
    const storedSession = localStorage.getItem('demo-session');
    if (storedSession) {
      const demoSession = JSON.parse(storedSession);
      if (demoSession.access_token?.startsWith('demo-token-')) {
        // Validate token age
        const timestamp = parseInt(demoSession.access_token.replace('demo-token-', ''));
        const ageHours = (Date.now() - timestamp) / (1000 * 60 * 60);
        
        if (ageHours < 25 && ageHours > -1) {
          console.log('🔧 Found valid demo token in localStorage, setting...');
          apiClient.setAccessToken(demoSession.access_token);
          
          // Verify it was set
          const newStatus = apiClient.getTokenStatus();
          if (newStatus.hasToken) {
            console.log('✅ Token recovery successful from localStorage');
            return {
              success: true,
              tokenFound: true,
              tokenSet: true,
              source: 'localStorage'
            };
          }
        } else {
          console.log('⏰ Demo token in localStorage expired, removing...');
          localStorage.removeItem('demo-session');
        }
      }
    }
  } catch (error) {
    console.warn('⚠️ Error checking localStorage for token:', error);
  }
  
  // Try to get fresh token from auth service
  try {
    console.log('🔄 Attempting to get fresh session from auth service...');
    const sessionResult = await authService.getSession();
    
    if (sessionResult.success && sessionResult.session?.access_token) {
      console.log('🔧 Found session in auth service, setting token...');
      apiClient.setAccessToken(sessionResult.session.access_token);
      
      // Verify it was set
      const newStatus = apiClient.getTokenStatus();
      if (newStatus.hasToken) {
        console.log('✅ Token recovery successful from auth service');
        return {
          success: true,
          tokenFound: true,
          tokenSet: true,
          source: 'authService'
        };
      }
    }
  } catch (error) {
    console.warn('⚠️ Error getting session from auth service:', error);
  }
  
  // If we get here, no token could be recovered
  console.log('❌ Token recovery failed - no valid token found');
  return {
    success: false,
    tokenFound: false,
    tokenSet: false,
    source: 'none',
    error: 'No valid token found in localStorage or auth service'
  };
}

export async function ensureTokenAvailable(): Promise<boolean> {
  const currentStatus = apiClient.getTokenStatus();
  
  if (currentStatus.hasToken && currentStatus.isValid) {
    return true;
  }
  
  console.log('🛠️ Token not available, attempting automatic recovery...');
  const recovery = await recoverToken();
  
  if (recovery.success && recovery.tokenSet) {
    console.log('✅ Token automatically recovered');
    return true;
  }
  
  console.log('❌ Token recovery failed, user may need to re-authenticate');
  return false;
}

// Auto-recovery wrapper for API calls
export async function withTokenRecovery<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    // First try the operation
    return await operation();
  } catch (error) {
    // If it's a token-related error, try recovery once
    if (error instanceof Error && 
        (error.message.includes('autentiseringstoken') || 
         error.message.includes('401') ||
         error.message.includes('Unauthorized'))) {
      
      console.log('🔄 API call failed with auth error, attempting token recovery...');
      const recovered = await ensureTokenAvailable();
      
      if (recovered) {
        console.log('🔄 Token recovered, retrying operation...');
        return await operation();
      }
    }
    
    // Re-throw the original error if recovery failed or it's not a token error
    throw error;
  }
}