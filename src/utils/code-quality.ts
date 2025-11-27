// Clean Code Quality Utilities for MÄÄK Mood
// Ensures encoding-safe, production-ready code

interface QualityReport {
  score: number;
  issues: QualityIssue[];
  recommendations: string[];
  cleanCodeMetrics: CleanCodeMetrics;
}

interface QualityIssue {
  type: 'encoding' | 'performance' | 'security' | 'accessibility' | 'maintainability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location?: string;
  solution?: string;
}

interface CleanCodeMetrics {
  encodingSafety: number;
  performanceScore: number;
  securityScore: number;
  maintainabilityIndex: number;
  accessibilityScore: number;
}

class CodeQualityAnalyzer {
  private static instance: CodeQualityAnalyzer;
  private qualityRules: Map<string, (code: string) => QualityIssue[]>;

  private constructor() {
    this.qualityRules = new Map();
    this.initializeRules();
  }

  static getInstance(): CodeQualityAnalyzer {
    if (!CodeQualityAnalyzer.instance) {
      CodeQualityAnalyzer.instance = new CodeQualityAnalyzer();
    }
    return CodeQualityAnalyzer.instance;
  }

  private initializeRules(): void {
    // Encoding safety rules
    this.qualityRules.set('encoding-safety', (code: string) => {
      const issues: QualityIssue[] = [];
      
      // Check for problematic Unicode characters
      const problematicChars = /[^\x00-\x7F\u00C0-\u017F\u0100-\u024F]/g;
      const matches = code.match(problematicChars);
      
      if (matches) {
        issues.push({
          type: 'encoding',
          severity: 'high',
          message: `Potentiellt problematiska Unicode-tecken hittade: ${matches.slice(0, 5).join(', ')}`,
          solution: 'Ersätt med ASCII-kompatibla alternativ eller säkerställ UTF-8 encoding'
        });
      }

      // Check for emoji usage in code
      const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
      const emojiMatches = code.match(emojiRegex);
      
      if (emojiMatches) {
        issues.push({
          type: 'encoding',
          severity: 'medium',
          message: `Emojis hittade i kod (${emojiMatches.length} st)`,
          solution: 'Ersätt emojis med text-baserade alternativ för bättre kompatibilitet'
        });
      }

      return issues;
    });

    // Performance rules
    this.qualityRules.set('performance', (code: string) => {
      const issues: QualityIssue[] = [];
      
      // Check for excessive console.log statements
      const consoleCount = (code.match(/console\.(log|warn|error)/g) || []).length;
      if (consoleCount > 50) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          message: `Många console-utskrifter (${consoleCount} st)`,
          solution: 'Överväg att använda ett loggningsbibliotek eller reducera antalet utskrifter'
        });
      }

      // Check for unnecessary re-renders
      if (code.includes('useEffect') && !code.includes('dependency array')) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          message: 'useEffect utan dependency array kan orsaka onödiga re-renders',
          solution: 'Lägg till dependency array för att optimera prestanda'
        });
      }

      return issues;
    });

    // Security rules
    this.qualityRules.set('security', (code: string) => {
      const issues: QualityIssue[] = [];
      
      // Check for hardcoded sensitive data
      const sensitivePatterns = [
        /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
        /api[_-]?key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
        /secret\s*[:=]\s*['"`][^'"`]+['"`]/gi
      ];

      sensitivePatterns.forEach(pattern => {
        if (pattern.test(code)) {
          issues.push({
            type: 'security',
            severity: 'critical',
            message: 'Potentiellt känslig data hårdkodad',
            solution: 'Använd miljövariabler eller säker konfiguration'
          });
        }
      });

      return issues;
    });

    // Accessibility rules
    this.qualityRules.set('accessibility', (code: string) => {
      const issues: QualityIssue[] = [];
      
      // Check for missing alt attributes on images
      if (code.includes('<img') && !code.includes('alt=')) {
        issues.push({
          type: 'accessibility',
          severity: 'high',
          message: 'Bilder saknar alt-attribut',
          solution: 'Lägg till beskrivande alt-text för alla bilder'
        });
      }

      // Check for missing labels on form inputs
      if (code.includes('<input') && !code.includes('aria-label') && !code.includes('<label')) {
        issues.push({
          type: 'accessibility',
          severity: 'high',
          message: 'Formulärfält saknar labels',
          solution: 'Lägg till label-element eller aria-label attribut'
        });
      }

      return issues;
    });
  }

  analyzeCode(code: string, filename?: string): QualityReport {
    const allIssues: QualityIssue[] = [];
    
    // Run all quality rules
    this.qualityRules.forEach((rule, ruleName) => {
      const issues = rule(code);
      allIssues.push(...issues.map(issue => ({
        ...issue,
        location: filename || 'Unknown file'
      })));
    });

    // Calculate metrics
    const metrics = this.calculateMetrics(code, allIssues);
    
    // Calculate overall score
    const score = this.calculateOverallScore(metrics, allIssues);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(allIssues, metrics);

    return {
      score,
      issues: allIssues,
      recommendations,
      cleanCodeMetrics: metrics
    };
  }

  private calculateMetrics(code: string, issues: QualityIssue[]): CleanCodeMetrics {
    const totalLines = code.split('\n').length;
    const encodingIssues = issues.filter(i => i.type === 'encoding').length;
    const performanceIssues = issues.filter(i => i.type === 'performance').length;
    const securityIssues = issues.filter(i => i.type === 'security').length;
    const accessibilityIssues = issues.filter(i => i.type === 'accessibility').length;

    return {
      encodingSafety: Math.max(0, 100 - (encodingIssues * 10)),
      performanceScore: Math.max(0, 100 - (performanceIssues * 5)),
      securityScore: Math.max(0, 100 - (securityIssues * 20)),
      maintainabilityIndex: Math.max(0, 100 - ((totalLines > 500 ? 10 : 0) + (issues.length * 2))),
      accessibilityScore: Math.max(0, 100 - (accessibilityIssues * 15))
    };
  }

  private calculateOverallScore(metrics: CleanCodeMetrics, issues: QualityIssue[]): number {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    
    // Critical issues severely impact score
    if (criticalIssues > 0) return Math.max(0, 50 - (criticalIssues * 20));
    
    const averageMetric = (
      metrics.encodingSafety +
      metrics.performanceScore +
      metrics.securityScore +
      metrics.maintainabilityIndex +
      metrics.accessibilityScore
    ) / 5;

    // Deduct points for high severity issues
    const deduction = highIssues * 5;
    return Math.max(0, Math.min(100, averageMetric - deduction));
  }

  private generateRecommendations(issues: QualityIssue[], metrics: CleanCodeMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.encodingSafety < 90) {
      recommendations.push('Förbättra encoding-säkerhet genom att ersätta problematiska Unicode-tecken');
    }

    if (metrics.securityScore < 90) {
      recommendations.push('Förstärk säkerhet genom att undvika hårdkodade hemligheter');
    }

    if (metrics.accessibilityScore < 80) {
      recommendations.push('Förbättra tillgänglighet med alt-texter och labels');
    }

    if (metrics.performanceScore < 85) {
      recommendations.push('Optimera prestanda genom att minska console-utskrifter och förbättra React hooks');
    }

    if (issues.length === 0) {
      recommendations.push('Utmärkt! Koden följer alla kvalitetsstandarder.');
    }

    return recommendations;
  }

  // Clean code formatting utilities
  static formatConsoleMessage(message: string): string {
    // Remove emojis and problematic characters
    return message
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[^\x00-\x7F\u00C0-\u017F\u0100-\u024F]/g, '')
      .trim();
  }

  static generateCleanId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  }

  static sanitizeUserInput(input: string): string {
    return input
      .replace(/[<>\"'&]/g, '')
      .replace(/[^\w\s@.-]/g, '')
      .trim()
      .substring(0, 255);
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static startTimer(operation: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      const existing = this.metrics.get(operation) || [];
      existing.push(duration);
      this.metrics.set(operation, existing.slice(-100)); // Keep last 100 measurements
      
      console.log(`[PERFORMANCE] ${operation}: ${duration.toFixed(2)}ms`);
    };
  }

  static getAverageTime(operation: string): number {
    const times = this.metrics.get(operation) || [];
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  static getPerformanceReport(): Record<string, { average: number, count: number }> {
    const report: Record<string, { average: number, count: number }> = {};
    
    this.metrics.forEach((times, operation) => {
      report[operation] = {
        average: times.reduce((a, b) => a + b, 0) / times.length,
        count: times.length
      };
    });

    return report;
  }
}

export const codeQualityAnalyzer = CodeQualityAnalyzer.getInstance();
export const codeQuality = codeQualityAnalyzer; // Backward compatibility
export { CodeQualityAnalyzer, type QualityReport, type QualityIssue, type CleanCodeMetrics };