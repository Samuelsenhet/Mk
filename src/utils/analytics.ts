// GDPR-compliant analytics för TIDE
interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

interface UserConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

class TideAnalytics {
  private consent: UserConsent = {
    analytics: false,
    marketing: false,
    functional: true // Always allowed for core functionality
  };
  
  private eventQueue: AnalyticsEvent[] = [];
  private isInitialized = false;

  // Initialize with user consent
  initialize(consent: UserConsent) {
    this.consent = consent;
    this.isInitialized = true;
    
    // Process queued events if consent given
    if (consent.analytics) {
      this.flushQueue();
    } else {
      this.eventQueue = []; // Clear queue if no consent
    }
  }

  // Track user events (only if consent given)
  track(event: string, properties?: Record<string, any>, userId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      },
      userId,
      timestamp: Date.now()
    };

    if (!this.isInitialized || !this.consent.analytics) {
      // Queue events until consent is given
      this.eventQueue.push(analyticsEvent);
      return;
    }

    this.sendEvent(analyticsEvent);
  }

  // Critical events for app functionality (always tracked)
  trackCritical(event: string, properties?: Record<string, any>) {
    this.sendEvent({
      event: `critical_${event}`,
      properties,
      timestamp: Date.now()
    });
  }

  // Dating app specific events
  trackPersonalityTestStart(userId: string) {
    this.track('personality_test_started', { step: 'begin' }, userId);
  }

  trackPersonalityTestComplete(userId: string, personality: any) {
    this.track('personality_test_completed', {
      personality_type: personality.type,
      archetype: personality.name,
      completion_time: Date.now()
    }, userId);
  }

  trackMatchView(userId: string, matchId: string, compatibilityScore: number) {
    this.track('match_viewed', {
      match_id: matchId,
      compatibility_score: compatibilityScore
    }, userId);
  }

  trackChatStart(userId: string, matchId: string) {
    this.track('chat_started', {
      match_id: matchId,
      chat_type: 'ai_icebreaker'
    }, userId);
  }

  trackMessageSent(userId: string, matchId: string, messageType: 'text' | 'voice' | 'ai_generated') {
    this.track('message_sent', {
      match_id: matchId,
      message_type: messageType
    }, userId);
  }

  trackDailyQuestionAnswer(userId: string, questionId: string, answerIndex: number) {
    this.track('daily_question_answered', {
      question_id: questionId,
      answer_index: answerIndex
    }, userId);
  }

  trackPremiumUpgrade(userId: string, plan: string) {
    this.track('premium_upgrade', {
      plan,
      upgrade_source: 'app'
    }, userId);
  }

  // Retention metrics
  trackRetention(userId: string, daysSinceSignup: number) {
    this.track('user_retention', {
      days_since_signup: daysSinceSignup,
      is_active: true
    }, userId);
  }

  // GDPR utilities
  updateConsent(consent: UserConsent) {
    this.consent = consent;
    
    if (!consent.analytics) {
      this.eventQueue = []; // Clear queue if consent withdrawn
    }
  }

  exportUserData(userId: string): Promise<any[]> {
    // Return all data for this user (GDPR Article 20)
    return Promise.resolve([]);
  }

  deleteUserData(userId: string): Promise<void> {
    // Delete all user data (GDPR Article 17)
    this.track('user_data_deletion_requested', { user_id: userId });
    return Promise.resolve();
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      // In production, send to your analytics service
      console.log('Analytics Event:', event);
      
      // Example: Send to Supabase for analysis
      // await apiClient.logAnalytics(event);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  private flushQueue() {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) this.sendEvent(event);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('tide_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('tide_session_id', sessionId);
    }
    return sessionId;
  }
}

export const analytics = new TideAnalytics();

// Hook for components to use analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackCritical: analytics.trackCritical.bind(analytics),
    trackPersonalityTestStart: analytics.trackPersonalityTestStart.bind(analytics),
    trackPersonalityTestComplete: analytics.trackPersonalityTestComplete.bind(analytics),
    trackMatchView: analytics.trackMatchView.bind(analytics),
    trackChatStart: analytics.trackChatStart.bind(analytics),
    trackMessageSent: analytics.trackMessageSent.bind(analytics),
    trackDailyQuestionAnswer: analytics.trackDailyQuestionAnswer.bind(analytics),
    trackPremiumUpgrade: analytics.trackPremiumUpgrade.bind(analytics),
    updateConsent: analytics.updateConsent.bind(analytics)
  };
}