/**
 * Insights Engine - AI-Powered Analytics Intelligence
 * 
 * Provides:
 * - Anomaly detection
 * - Trend analysis
 * - Pattern recognition
 * - Actionable recommendations
 */

class InsightsEngine {
  constructor() {
    this.insights = [];
  }

  /**
   * Analyze entire portfolio and generate insights
   */
  analyzePortfolio(portfolioData) {
    const insights = [];

    // 1. Anomaly Detection
    insights.push(...this.detectAnomalies(portfolioData));

    // 2. Trend Analysis
    insights.push(...this.analyzeTrends(portfolioData));

    // 3. Performance Analysis
    insights.push(...this.analyzePerformance(portfolioData));

    // 4. Traffic Source Analysis
    insights.push(...this.analyzeTrafficSources(portfolioData));

    // 5. Generate Recommendations
    insights.push(...this.generateRecommendations(portfolioData, insights));

    // Sort by priority
    return insights.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Detect anomalies (traffic spikes/drops)
   */
  detectAnomalies(portfolioData) {
    const anomalies = [];
    const { properties } = portfolioData;

    properties.forEach(site => {
      const change = site.change?.sessions || 0;
      const current = site.current?.sessions || 0;

      // Critical drop (>50%)
      if (change < -50 && current > 500) {
        anomalies.push({
          type: 'anomaly',
          severity: 'critical',
          category: 'traffic_drop',
          site: site.name,
          title: `Critical Traffic Drop: ${site.name}`,
          message: `Traffic dropped ${Math.abs(change).toFixed(0)}% (${current.toLocaleString()} sessions). Requires immediate investigation.`,
          change: change,
          current: current,
          impact: 'high',
          priority: 95,
          actions: [
            'Check for Pinterest algorithm changes',
            'Review Google Search Console for penalties',
            'Verify GA4 tracking is working',
            'Check for technical issues (site down, broken pages)'
          ],
          icon: '🔴',
          color: 'red'
        });
      }
      // Significant drop (30-50%)
      else if (change < -30 && current > 500) {
        anomalies.push({
          type: 'anomaly',
          severity: 'warning',
          category: 'traffic_drop',
          site: site.name,
          title: `Significant Decline: ${site.name}`,
          message: `Traffic down ${Math.abs(change).toFixed(0)}% (${current.toLocaleString()} sessions). Monitor closely.`,
          change: change,
          current: current,
          impact: 'medium',
          priority: 75,
          actions: [
            'Analyze traffic source breakdown',
            'Review recent content changes',
            'Check competitor performance'
          ],
          icon: '⚠️',
          color: 'orange'
        });
      }
      // Moderate drop (20-30%)
      else if (change < -20 && current > 500) {
        anomalies.push({
          type: 'anomaly',
          severity: 'notice',
          category: 'traffic_drop',
          site: site.name,
          title: `Traffic Declining: ${site.name}`,
          message: `Traffic down ${Math.abs(change).toFixed(0)}%. Watch for continued decline.`,
          change: change,
          current: current,
          impact: 'low',
          priority: 50,
          actions: [
            'Review recent analytics trends',
            'Check seasonal patterns'
          ],
          icon: '📉',
          color: 'yellow'
        });
      }

      // Unusual spike (>100%)
      if (change > 100 && current > 500) {
        anomalies.push({
          type: 'anomaly',
          severity: 'positive',
          category: 'traffic_spike',
          site: site.name,
          title: `Traffic Surge: ${site.name}`,
          message: `Traffic increased ${change.toFixed(0)}% (${current.toLocaleString()} sessions). Investigate what's working!`,
          change: change,
          current: current,
          impact: 'high',
          priority: 80,
          actions: [
            'Identify viral content or trending topics',
            'Analyze traffic sources driving growth',
            'Replicate successful strategies',
            'Capitalize on momentum with new content'
          ],
          icon: '🚀',
          color: 'green'
        });
      }

      // Zero traffic (possible tracking issue)
      if (current === 0 && site.previous?.sessions > 100) {
        anomalies.push({
          type: 'anomaly',
          severity: 'critical',
          category: 'no_data',
          site: site.name,
          title: `No Traffic Data: ${site.name}`,
          message: `Zero sessions detected. Likely GA4 tracking issue or API problem.`,
          change: -100,
          current: 0,
          impact: 'high',
          priority: 100,
          actions: [
            'Verify GA4 tracking code is installed',
            'Check API credentials',
            'Confirm property ID is correct'
          ],
          icon: '🔌',
          color: 'red'
        });
      }
    });

    return anomalies;
  }

  /**
   * Analyze trends (growing, declining, stable)
   */
  analyzeTrends(portfolioData) {
    const trends = [];
    const { properties } = portfolioData;

    // Fastest growing sites
    const growing = properties
      .filter(p => p.change?.sessions > 20 && p.current?.sessions > 500)
      .sort((a, b) => b.change.sessions - a.change.sessions)
      .slice(0, 3);

    growing.forEach((site, index) => {
      if (index === 0) {
        trends.push({
          type: 'trend',
          severity: 'positive',
          category: 'growth',
          site: site.name,
          title: `🌟 Top Performer: ${site.name}`,
          message: `Leading portfolio with ${site.change.sessions.toFixed(0)}% growth (${site.current.sessions.toLocaleString()} sessions). This is your star site.`,
          change: site.change.sessions,
          current: site.current.sessions,
          impact: 'high',
          priority: 70,
          actions: [
            'Scale content production',
            'Analyze what\'s working (topics, formats, length)',
            'Apply successful strategies to other sites',
            'Consider increasing ad density if RPM is good'
          ],
          icon: '⭐',
          color: 'green'
        });
      }
    });

    // Portfolio-level trend
    const portfolioChange = portfolioData.totals?.change?.sessions || 0;
    if (Math.abs(portfolioChange) > 10) {
      trends.push({
        type: 'trend',
        severity: portfolioChange > 0 ? 'positive' : 'notice',
        category: 'portfolio',
        site: 'Portfolio',
        title: `Portfolio ${portfolioChange > 0 ? 'Growing' : 'Declining'}`,
        message: `Overall portfolio ${portfolioChange > 0 ? 'up' : 'down'} ${Math.abs(portfolioChange).toFixed(1)}% across all sites.`,
        change: portfolioChange,
        current: portfolioData.totals?.current?.sessions,
        impact: 'high',
        priority: portfolioChange < 0 ? 85 : 65,
        actions: portfolioChange < 0 ? [
          'Identify which sites are dragging performance',
          'Review Google/Pinterest algorithm updates',
          'Check for seasonal trends',
          'Consider content refresh strategy'
        ] : [
          'Maintain momentum',
          'Double down on what\'s working',
          'Explore new content opportunities'
        ],
        icon: portfolioChange > 0 ? '📈' : '📉',
        color: portfolioChange > 0 ? 'green' : 'yellow'
      });
    }

    return trends;
  }

  /**
   * Analyze performance (revenue, engagement, quality)
   */
  analyzePerformance(portfolioData) {
    const performance = [];
    const { properties } = portfolioData;

    // High engagement sites
    const highEngagement = properties
      .filter(p => p.current?.engagementRate > 0.4 && p.current?.sessions > 500)
      .sort((a, b) => b.current.engagementRate - a.current.engagementRate)
      .slice(0, 3);

    if (highEngagement.length > 0) {
      const top = highEngagement[0];
      performance.push({
        type: 'performance',
        severity: 'positive',
        category: 'engagement',
        site: top.name,
        title: `High Engagement: ${top.name}`,
        message: `${(top.current.engagementRate * 100).toFixed(1)}% engagement rate - visitors are highly engaged. Quality traffic source.`,
        change: top.change?.sessions || 0,
        current: top.current.sessions,
        impact: 'medium',
        priority: 60,
        actions: [
          'Excellent traffic quality - maintain content standards',
          'Good candidate for premium ad networks',
          'Consider email list building for engaged audience'
        ],
        icon: '💎',
        color: 'blue'
      });
    }

    // Low engagement warning
    const lowEngagement = properties
      .filter(p => p.current?.engagementRate < 0.15 && p.current?.sessions > 1000)
      .sort((a, b) => a.current.engagementRate - b.current.engagementRate);

    if (lowEngagement.length > 0) {
      const worst = lowEngagement[0];
      performance.push({
        type: 'performance',
        severity: 'notice',
        category: 'engagement',
        site: worst.name,
        title: `Low Engagement: ${worst.name}`,
        message: `Only ${(worst.current.engagementRate * 100).toFixed(1)}% engagement. Visitors bouncing quickly.`,
        change: worst.change?.sessions || 0,
        current: worst.current.sessions,
        impact: 'medium',
        priority: 55,
        actions: [
          'Improve content quality and relevance',
          'Review site speed and user experience',
          'Check traffic source quality (bot traffic?)',
          'Consider better content targeting'
        ],
        icon: '⚡',
        color: 'yellow'
      });
    }

    return performance;
  }

  /**
   * Analyze traffic sources
   */
  analyzeTrafficSources(portfolioData) {
    const trafficInsights = [];

    // This would analyze traffic source data from GA4
    // For now, placeholder for when we have source-level data

    return trafficInsights;
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(portfolioData, insights) {
    const recommendations = [];
    const { properties } = portfolioData;

    // Recommendation: Sites to scale
    const topPerformers = properties
      .filter(p => p.change?.sessions > 15 && p.current?.sessions > 2000)
      .sort((a, b) => b.current.sessions - a.current.sessions)
      .slice(0, 3);

    if (topPerformers.length > 0) {
      recommendations.push({
        type: 'recommendation',
        severity: 'positive',
        category: 'scale',
        site: 'Portfolio',
        title: `📊 Scale These Sites`,
        message: `${topPerformers.map(s => s.name.replace(' - GA4', '')).join(', ')} are performing well. Increase content production.`,
        impact: 'high',
        priority: 65,
        actions: [
          'Allocate more editor time to top performers',
          'Analyze successful content formats',
          'Increase publishing frequency',
          'Invest in better images/graphics'
        ],
        icon: '📈',
        color: 'green'
      });
    }

    // Recommendation: Sites to consider cutting
    const underperformers = properties
      .filter(p => p.current?.sessions < 200 && p.change?.sessions < -10)
      .sort((a, b) => a.current.sessions - b.current.sessions)
      .slice(0, 3);

    if (underperformers.length > 0) {
      recommendations.push({
        type: 'recommendation',
        severity: 'notice',
        category: 'optimize',
        site: 'Portfolio',
        title: `⚠️ Low-Performing Sites`,
        message: `${underperformers.map(s => s.name.replace(' - GA4', '')).join(', ')} have minimal traffic. Consider redirecting resources.`,
        impact: 'medium',
        priority: 50,
        actions: [
          'Evaluate ROI of maintaining these sites',
          'Consider shutting down or selling',
          'Redirect resources to top performers',
          'If keeping, implement recovery strategy'
        ],
        icon: '🔄',
        color: 'yellow'
      });
    }

    // Diversification recommendation
    const pinterestHeavy = properties.filter(p => p.name.includes('Hello Hayley') || p.name.includes('Melrose'));
    if (pinterestHeavy.some(p => p.change?.sessions < -40)) {
      recommendations.push({
        type: 'recommendation',
        severity: 'warning',
        category: 'risk',
        site: 'Portfolio',
        title: `🎯 Diversify Traffic Sources`,
        message: `Pinterest algorithm changes are hurting Pinterest-heavy sites. Reduce platform dependency.`,
        impact: 'high',
        priority: 75,
        actions: [
          'Build email list for direct traffic',
          'Invest in SEO (Google organic)',
          'Explore Facebook, Instagram, TikTok',
          'Create YouTube content for video traffic'
        ],
        icon: '🌐',
        color: 'orange'
      });
    }

    return recommendations;
  }

  /**
   * Get insight summary for dashboard
   */
  getSummary(insights) {
    return {
      total: insights.length,
      critical: insights.filter(i => i.severity === 'critical').length,
      warnings: insights.filter(i => i.severity === 'warning').length,
      opportunities: insights.filter(i => i.severity === 'positive').length,
      topPriority: insights.slice(0, 5)
    };
  }
}

module.exports = new InsightsEngine();
