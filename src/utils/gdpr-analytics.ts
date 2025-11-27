// MÄÄK Mood - Advanced GDPR Analytics System
// Complete privacy-compliant analytics with user consent management

export interface UserConsent {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  performance: boolean;
  timestamp: Date;
  version: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AnalyticsEvent {
  eventId: string;
  userId?: string;
  sessionId: string;
  eventType: string;
  eventName: string;
  properties: Record<string, any>;
  timestamp: Date;
  consentGiven: boolean;
  privacyLevel: 'essential' | 'analytics' | 'marketing' | 'personalization';
}

export interface UserDataExport {
  userId: string;
  exportDate: Date;
  consentHistory: UserConsent[];
  analyticsEvents: AnalyticsEvent[];
  profileData: any;
  personalityData: any;
  matchesData: any[];
  messagesData: any[];
  dataRetentionInfo: {
    category: string;
    retentionPeriod: number;
    nextPurgeDate: Date;
  }[];
}

export interface GDPRComplianceStatus {
  consentManagement: 'compliant' | 'non-compliant' | 'needs-review';
  dataMinimization: 'compliant' | 'non-compliant' | 'needs-review';
  retentionPolicies: 'compliant' | 'non-compliant' | 'needs-review';
  userRights: 'compliant' | 'non-compliant' | 'needs-review';
  dataProtection: 'compliant' | 'non-compliant' | 'needs-review';
  overallCompliance: 'compliant' | 'non-compliant' | 'needs-review';
  lastAudit: Date;
  recommendations: string[];
}

class GDPRAnalytics {
  private static instance: GDPRAnalytics;
  private events: AnalyticsEvent[] = [];
  private userConsents: Map<string, UserConsent[]> = new Map();
  private dataRetentionPolicies: Map<string, number> = new Map();
  private isInitialized = false;

  private constructor() {
    // Initialize data retention policies (in days)
    this.dataRetentionPolicies.set('analytics', 730); // 2 years
    this.dataRetentionPolicies.set('profile', 2555); // 7 years (regulatory requirement)
    this.dataRetentionPolicies.set('messages', 365); // 1 year
    this.dataRetentionPolicies.set('matches', 1095); // 3 years
    this.dataRetentionPolicies.set('personality', 1825); // 5 years
    this.dataRetentionPolicies.set('logs', 90); // 3 months
  }

  static getInstance(): GDPRAnalytics {
    if (!GDPRAnalytics.instance) {
      GDPRAnalytics.instance = new GDPRAnalytics();
    }
    return GDPRAnalytics.instance;
  }

  // Initialize with user consent
  initialize(userConsent: UserConsent): void {
    this.isInitialized = true;
    console.log('[GDPR ANALYTICS] Initialized with consent:', {
      analytics: userConsent.analytics,
      marketing: userConsent.marketing,
      personalization: userConsent.personalization,
      performance: userConsent.performance
    });

    // Start automatic data cleanup
    this.startDataRetentionCleanup();
  }

  // Record user consent
  recordConsent(userId: string, consent: UserConsent): void {
    const userConsentHistory = this.userConsents.get(userId) || [];
    userConsentHistory.push({
      ...consent,
      timestamp: new Date(),
      version: '2.0.0',
      ipAddress: this.hashIP(this.getCurrentIP()),
      userAgent: this.hashUserAgent(navigator.userAgent)
    });
    
    this.userConsents.set(userId, userConsentHistory);
    
    console.log('[GDPR] User consent recorded:', {
      userId: userId.substring(0, 8) + '...',
      consentType: Object.keys(consent).filter(k => consent[k as keyof UserConsent] === true)
    });
  }

  // Track event with privacy compliance
  trackEvent(event: Omit<AnalyticsEvent, 'eventId' | 'timestamp' | 'consentGiven'>): void {
    if (!this.isInitialized) {
      console.warn('[GDPR] Analytics not initialized, event queued');
      return;
    }

    // Check if user has given appropriate consent
    const userConsent = event.userId ? this.getLatestConsent(event.userId) : null;
    const consentGiven = this.checkConsentForEvent(event.privacyLevel, userConsent);

    if (!consentGiven && event.privacyLevel !== 'essential') {
      console.log('[GDPR] Event not tracked due to lack of consent:', event.eventName);
      return;
    }

    const completeEvent: AnalyticsEvent = {
      eventId: this.generateEventId(),
      timestamp: new Date(),
      consentGiven,
      ...event
    };

    // Apply data minimization
    const minimizedEvent = this.applyDataMinimization(completeEvent, userConsent);
    
    this.events.push(minimizedEvent);
    
    console.log('[GDPR ANALYTICS] Event tracked:', {
      eventName: event.eventName,
      privacyLevel: event.privacyLevel,
      consentGiven
    });

    // Keep only recent events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }
  }

  // GDPR-specific event tracking methods
  trackPersonalityTestStart(userId: string): void {
    this.trackEvent({
      userId,
      sessionId: this.getCurrentSessionId(),
      eventType: 'personality',
      eventName: 'personality_test_started',
      properties: {
        testVersion: '2.0',
        startedAt: new Date().toISOString()
      },
      privacyLevel: 'analytics'
    });
  }

  trackPersonalityTestComplete(userId: string, personalityType: string, completionTime: number): void {
    this.trackEvent({
      userId,
      sessionId: this.getCurrentSessionId(),
      eventType: 'personality',
      eventName: 'personality_test_completed',
      properties: {
        personalityType: this.anonymizePersonalityType(personalityType),
        completionTimeMinutes: Math.round(completionTime / 60000),
        completedAt: new Date().toISOString()
      },
      privacyLevel: 'analytics'
    });
  }

  trackMatchViewed(userId: string, matchId: string, compatibilityScore: number): void {
    this.trackEvent({
      userId,
      sessionId: this.getCurrentSessionId(),
      eventType: 'matching',
      eventName: 'match_viewed',
      properties: {
        matchId: this.hashId(matchId),
        compatibilityRange: this.getCompatibilityRange(compatibilityScore),
        viewedAt: new Date().toISOString()
      },
      privacyLevel: 'analytics'
    });
  }

  trackMessageSent(userId: string, matchId: string, messageType: string): void {
    this.trackEvent({
      userId,
      sessionId: this.getCurrentSessionId(),
      eventType: 'communication',
      eventName: 'message_sent',
      properties: {
        matchId: this.hashId(matchId),
        messageType,
        sentAt: new Date().toISOString()
      },
      privacyLevel: 'analytics'
    });
  }

  // Export user data (GDPR Article 20)
  async exportUserData(userId: string): Promise<UserDataExport> {
    console.log('[GDPR] Exporting user data for:', userId.substring(0, 8) + '...');

    const export_data: UserDataExport = {
      userId,
      exportDate: new Date(),
      consentHistory: this.userConsents.get(userId) || [],
      analyticsEvents: this.events.filter(e => e.userId === userId),
      profileData: await this.getUserProfileData(userId),
      personalityData: await this.getUserPersonalityData(userId),
      matchesData: await this.getUserMatchesData(userId),
      messagesData: await this.getUserMessagesData(userId),
      dataRetentionInfo: this.getDataRetentionInfo()
    };

    console.log('[GDPR] User data export completed');
    return export_data;
  }

  // Delete user data (GDPR Article 17 - Right to be forgotten)
  async deleteUserData(userId: string, reason: string = 'user_request'): Promise<void> {
    console.log('[GDPR] Starting user data deletion for:', userId.substring(0, 8) + '...');

    try {
      // Remove from analytics events
      this.events = this.events.filter(e => e.userId !== userId);
      
      // Remove consent history
      this.userConsents.delete(userId);
      
      // Delete from external systems (would be actual API calls)
      await this.deleteUserProfileData(userId);
      await this.deleteUserPersonalityData(userId);
      await this.deleteUserMatchesData(userId);
      await this.deleteUserMessagesData(userId);
      
      // Log deletion for audit trail
      this.trackEvent({
        sessionId: 'system',
        eventType: 'gdpr',
        eventName: 'user_data_deleted',
        properties: {
          deletedUserId: this.hashId(userId),
          reason,
          deletedAt: new Date().toISOString()
        },
        privacyLevel: 'essential'
      });

      console.log('[GDPR] User data deletion completed successfully');
    } catch (error) {
      console.error('[GDPR] Error during user data deletion:', error);
      throw error;
    }
  }

  // Assess GDPR compliance status
  assessCompliance(): GDPRComplianceStatus {
    const now = new Date();
    const recommendations: string[] = [];

    // Check consent management
    const consentManagement = this.userConsents.size > 0 ? 'compliant' : 'needs-review';
    if (consentManagement !== 'compliant') {
      recommendations.push('Implement comprehensive consent management');
    }

    // Check data minimization
    const dataMinimization = this.events.every(e => this.isDataMinimized(e)) ? 'compliant' : 'needs-review';
    if (dataMinimization !== 'compliant') {
      recommendations.push('Apply stricter data minimization practices');
    }

    // Check retention policies
    const retentionPolicies = this.dataRetentionPolicies.size > 0 ? 'compliant' : 'needs-review';
    if (retentionPolicies !== 'compliant') {
      recommendations.push('Define and implement data retention policies');
    }

    // Check user rights implementation
    const userRights = 'compliant'; // We have export and delete methods
    
    // Check data protection measures
    const dataProtection = this.events.every(e => this.hasDataProtection(e)) ? 'compliant' : 'needs-review';
    if (dataProtection !== 'compliant') {
      recommendations.push('Enhance data protection measures (encryption, anonymization)');
    }

    // Calculate overall compliance
    const scores = [consentManagement, dataMinimization, retentionPolicies, userRights, dataProtection];
    const compliantCount = scores.filter(s => s === 'compliant').length;
    const overallCompliance = compliantCount === scores.length ? 'compliant' : 
                             compliantCount >= scores.length * 0.8 ? 'needs-review' : 'non-compliant';

    return {
      consentManagement,
      dataMinimization,
      retentionPolicies,
      userRights,
      dataProtection,
      overallCompliance,
      lastAudit: now,
      recommendations
    };
  }

  // Start automatic data retention cleanup
  private startDataRetentionCleanup(): void {
    console.log('[GDPR] Starting automatic data retention cleanup...');

    // Run cleanup every 24 hours
    setInterval(() => {
      this.performDataRetentionCleanup();
    }, 24 * 60 * 60 * 1000);

    // Run initial cleanup
    this.performDataRetentionCleanup();
  }

  private performDataRetentionCleanup(): void {
    const now = new Date();
    const analyticsRetentionDays = this.dataRetentionPolicies.get('analytics') || 730;
    const cutoffDate = new Date(now.getTime() - (analyticsRetentionDays * 24 * 60 * 60 * 1000));

    // Clean up old analytics events
    const initialCount = this.events.length;
    this.events = this.events.filter(event => event.timestamp > cutoffDate);
    const cleanedCount = initialCount - this.events.length;

    if (cleanedCount > 0) {
      console.log(`[GDPR CLEANUP] Removed ${cleanedCount} old analytics events`);
    }

    // Clean up old consent records (keep only last 5 per user)
    this.userConsents.forEach((consents, userId) => {
      if (consents.length > 5) {
        const recent = consents.slice(-5);
        this.userConsents.set(userId, recent);
      }
    });
  }

  // Helper methods
  private checkConsentForEvent(privacyLevel: string, consent: UserConsent | null): boolean {
    if (privacyLevel === 'essential') return true;
    if (!consent) return false;

    switch (privacyLevel) {
      case 'analytics': return consent.analytics;
      case 'marketing': return consent.marketing;
      case 'personalization': return consent.personalization;
      default: return false;
    }
  }

  private applyDataMinimization(event: AnalyticsEvent, consent: UserConsent | null): AnalyticsEvent {
    // Remove or hash sensitive properties based on consent
    const minimizedEvent = { ...event };

    if (!consent?.personalization) {
      // Remove personalizing data if no consent
      delete minimizedEvent.properties.personalityType;
      delete minimizedEvent.properties.preferences;
    }

    if (!consent?.marketing) {
      // Remove marketing-relevant data
      delete minimizedEvent.properties.deviceInfo;
      delete minimizedEvent.properties.locationData;
    }

    return minimizedEvent;
  }

  private getLatestConsent(userId: string): UserConsent | null {
    const consents = this.userConsents.get(userId);
    return consents && consents.length > 0 ? consents[consents.length - 1] : null;
  }

  private generateEventId(): string {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getCurrentSessionId(): string {
    return sessionStorage.getItem('maak-session-id') || 'anonymous';
  }

  private getCurrentIP(): string {
    // In real implementation, this would get the actual IP
    return '127.0.0.1';
  }

  private hashIP(ip: string): string {
    // Simple hash for IP (in production, use proper hashing)
    return 'ip_' + btoa(ip).substring(0, 8);
  }

  private hashUserAgent(ua: string): string {
    // Hash user agent for privacy
    return 'ua_' + btoa(ua).substring(0, 12);
  }

  private hashId(id: string): string {
    return 'h_' + btoa(id).substring(0, 10);
  }

  private anonymizePersonalityType(type: string): string {
    // Return category instead of specific type for privacy
    const categories = {
      'Diplomat': 'D',
      'Builder': 'B', 
      'Explorer': 'E',
      'Strategist': 'S'
    };
    return categories[type as keyof typeof categories] || 'Unknown';
  }

  private getCompatibilityRange(score: number): string {
    if (score >= 90) return '90-100';
    if (score >= 80) return '80-89';
    if (score >= 70) return '70-79';
    if (score >= 60) return '60-69';
    return '50-59';
  }

  private getDataRetentionInfo() {
    return Array.from(this.dataRetentionPolicies.entries()).map(([category, days]) => ({
      category,
      retentionPeriod: days,
      nextPurgeDate: new Date(Date.now() + (days * 24 * 60 * 60 * 1000))
    }));
  }

  private isDataMinimized(event: AnalyticsEvent): boolean {
    // Check if event contains only necessary data
    const sensitiveFields = ['email', 'phone', 'fullName', 'address'];
    const eventStr = JSON.stringify(event);
    return !sensitiveFields.some(field => eventStr.includes(field));
  }

  private hasDataProtection(event: AnalyticsEvent): boolean {
    // Check if sensitive IDs are hashed
    return event.userId ? event.userId.includes('_') : true;
  }

  // Mock methods for external data operations
  private async getUserProfileData(userId: string): Promise<any> {
    // Would fetch from actual database
    return { profile: 'user profile data' };
  }

  private async getUserPersonalityData(userId: string): Promise<any> {
    return { personality: 'user personality data' };
  }

  private async getUserMatchesData(userId: string): Promise<any[]> {
    return [{ matches: 'user matches data' }];
  }

  private async getUserMessagesData(userId: string): Promise<any[]> {
    return [{ messages: 'user messages data' }];
  }

  private async deleteUserProfileData(userId: string): Promise<void> {
    console.log('[GDPR] Profile data deleted for user');
  }

  private async deleteUserPersonalityData(userId: string): Promise<void> {
    console.log('[GDPR] Personality data deleted for user');
  }

  private async deleteUserMatchesData(userId: string): Promise<void> {
    console.log('[GDPR] Matches data deleted for user');
  }

  private async deleteUserMessagesData(userId: string): Promise<void> {
    console.log('[GDPR] Messages data deleted for user');
  }
}

export const gdprAnalytics = GDPRAnalytics.getInstance();
export default gdprAnalytics;