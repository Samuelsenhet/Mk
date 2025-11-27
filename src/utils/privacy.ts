// GDPR compliance utilities för TIDE
import { apiClient } from './api';

export interface UserConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  locationTracking: boolean;
  personalizedAds: boolean;
  thirdPartySharing: boolean;
  timestamp: string;
  version: string;
}

export interface DataExportRequest {
  userId: string;
  requestType: 'full' | 'specific';
  dataTypes?: string[];
  format: 'json' | 'csv';
  email: string;
}

export interface DataDeletionRequest {
  userId: string;
  reason: string;
  keepMatchData: boolean; // For other users' experience
  email: string;
}

class PrivacyManager {
  private readonly CONSENT_VERSION = '1.0';
  private readonly DATA_RETENTION_DAYS = 365 * 2; // 2 years

  // Get current user consent
  getUserConsent(): UserConsent | null {
    const stored = localStorage.getItem('tide_user_consent');
    if (!stored) return null;
    
    try {
      const consent = JSON.parse(stored);
      return this.validateConsentVersion(consent);
    } catch {
      return null;
    }
  }

  // Update user consent
  async updateConsent(consent: Partial<UserConsent>): Promise<boolean> {
    try {
      const fullConsent: UserConsent = {
        analytics: false,
        marketing: false,
        functional: true, // Always required
        locationTracking: false,
        personalizedAds: false,
        thirdPartySharing: false,
        ...consent,
        timestamp: new Date().toISOString(),
        version: this.CONSENT_VERSION
      };

      // Store locally
      localStorage.setItem('tide_user_consent', JSON.stringify(fullConsent));
      
      // Store on server for compliance
      await apiClient.updateUserConsent(fullConsent);
      
      return true;
    } catch (error) {
      console.error('Failed to update consent:', error);
      return false;
    }
  }

  // Check if consent is required (new user or version change)
  needsConsentUpdate(): boolean {
    const current = this.getUserConsent();
    return !current || current.version !== this.CONSENT_VERSION;
  }

  // Request data export (GDPR Article 20)
  async requestDataExport(request: DataExportRequest): Promise<boolean> {
    try {
      await apiClient.requestDataExport(request);
      return true;
    } catch (error) {
      console.error('Data export request failed:', error);
      return false;
    }
  }

  // Request data deletion (GDPR Article 17)
  async requestDataDeletion(request: DataDeletionRequest): Promise<boolean> {
    try {
      // Warn user about implications
      const confirmed = window.confirm(
        'Detta kommer permanent ta bort all din data. ' +
        'Dina matchningar kommer inte längre vara tillgängliga för andra användare. ' +
        'Är du säker?'
      );
      
      if (!confirmed) return false;
      
      await apiClient.requestDataDeletion(request);
      
      // Clear local data
      this.clearLocalData();
      
      return true;
    } catch (error) {
      console.error('Data deletion request failed:', error);
      return false;
    }
  }

  // Age verification (TIDE requirement: 20+)
  verifyAge(birthDate: string): { isValid: boolean; age: number; error?: string } {
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      
      if (birth > today) {
        return { isValid: false, age: 0, error: 'Ogiltigt födelsedatum' };
      }
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      if (age < 20) {
        return { 
          isValid: false, 
          age, 
          error: 'Du måste vara 20+ för att använda TIDE.' 
        };
      }
      
      return { isValid: true, age };
    } catch {
      return { isValid: false, age: 0, error: 'Ogiltigt datumformat' };
    }
  }

  // Data minimization - only collect what's necessary
  sanitizeProfileData(profileData: any): any {
    const allowedFields = [
      'firstName', 'lastName', 'birthDate', 'gender', 'sexuality',
      'preferences', 'intentions', 'relationshipType', 'height',
      'hasChildren', 'childrenPlans', 'hometown', 'workTitle',
      'educationLevel', 'religion', 'politics', 'interests',
      'lifestyle', 'photos', 'voiceClips', 'answers'
    ];

    const sanitized: any = {};
    allowedFields.forEach(field => {
      if (profileData[field] !== undefined) {
        sanitized[field] = profileData[field];
      }
    });

    return sanitized;
  }

  // Anonymize data for analytics
  anonymizeForAnalytics(userData: any): any {
    return {
      age: this.calculateAge(userData.birthDate),
      gender: userData.gender,
      location: userData.hometown ? this.generalizeLocation(userData.hometown) : null,
      personalityType: userData.personalityType,
      relationship_intentions: userData.intentions,
      // Remove all PII
      timestamp: new Date().toISOString()
    };
  }

  // Check data retention compliance
  async checkDataRetention(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.DATA_RETENTION_DAYS);
    
    // This would typically run as a server-side job
    console.log('Checking data retention for date:', cutoffDate.toISOString());
  }

  // Cookie management
  manageCookies(consent: UserConsent) {
    // Essential cookies (always allowed)
    this.setEssentialCookies();
    
    // Analytics cookies
    if (consent.analytics) {
      this.setAnalyticsCookies();
    } else {
      this.clearAnalyticsCookies();
    }
    
    // Marketing cookies
    if (consent.marketing) {
      this.setMarketingCookies();
    } else {
      this.clearMarketingCookies();
    }
  }

  private validateConsentVersion(consent: UserConsent): UserConsent | null {
    if (consent.version !== this.CONSENT_VERSION) {
      // Need to re-request consent
      return null;
    }
    return consent;
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private generalizeLocation(location: string): string {
    // Generalize to region/county level for privacy
    const regions = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro'];
    const found = regions.find(region => location.toLowerCase().includes(region.toLowerCase()));
    return found || 'Sverige';
  }

  private clearLocalData() {
    localStorage.removeItem('tide_user_consent');
    localStorage.removeItem('tide_session_id');
    sessionStorage.clear();
  }

  private setEssentialCookies() {
    // Session management, security
    document.cookie = "tide_essential=true; path=/; secure; samesite=strict";
  }

  private setAnalyticsCookies() {
    document.cookie = "tide_analytics=true; path=/; secure; samesite=strict; max-age=31536000";
  }

  private clearAnalyticsCookies() {
    document.cookie = "tide_analytics=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  private setMarketingCookies() {
    document.cookie = "tide_marketing=true; path=/; secure; samesite=strict; max-age=31536000";
  }

  private clearMarketingCookies() {
    document.cookie = "tide_marketing=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export const privacyManager = new PrivacyManager();

// Hook for components
export function usePrivacy() {
  return {
    getUserConsent: privacyManager.getUserConsent.bind(privacyManager),
    updateConsent: privacyManager.updateConsent.bind(privacyManager),
    needsConsentUpdate: privacyManager.needsConsentUpdate.bind(privacyManager),
    requestDataExport: privacyManager.requestDataExport.bind(privacyManager),
    requestDataDeletion: privacyManager.requestDataDeletion.bind(privacyManager),
    verifyAge: privacyManager.verifyAge.bind(privacyManager),
    manageCookies: privacyManager.manageCookies.bind(privacyManager)
  };
}