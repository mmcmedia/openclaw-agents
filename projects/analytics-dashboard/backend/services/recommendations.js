function generateRecommendations(properties, anomalies = [], patterns = []) {
  const recommendations = [];
  if (!properties || !properties.length) return recommendations;

  const sortedByGrowth = [...properties].sort((a, b) => b.change.sessions - a.change.sessions);
  const biggestGainer = sortedByGrowth[0];
  if (biggestGainer && biggestGainer.change.sessions >= 10) {
    recommendations.push({
      type: 'scale',
      priority: 'high',
      property: biggestGainer.name,
      action: `Scale content for ${biggestGainer.name}`,
      reason: `${biggestGainer.name} is up ${biggestGainer.change.sessions.toFixed(1)}% with ${biggestGainer.current.sessions.toLocaleString()} sessions. Publish 2-3 related posts this week.`,
      icon: '🚀'
    });
  }

  const biggestDecliner = [...properties].sort((a, b) => a.change.sessions - b.change.sessions)[0];
  if (biggestDecliner && biggestDecliner.change.sessions <= -15) {
    recommendations.push({
      type: 'investigate',
      priority: 'critical',
      property: biggestDecliner.name,
      action: `Investigate traffic drop on ${biggestDecliner.name}`,
      reason: `${biggestDecliner.name} is down ${Math.abs(biggestDecliner.change.sessions).toFixed(1)}% (${biggestDecliner.current.sessions.toLocaleString()} sessions). Audit top pages and traffic sources.`,
      icon: '🔍'
    });
  }

  const strongEngagement = properties
    .filter((prop) => prop.current?.sessions >= 10000 && prop.current?.engagementRate >= 0.5)
    .sort((a, b) => b.current.engagementRate - a.current.engagementRate)[0];

  if (strongEngagement) {
    recommendations.push({
      type: 'optimize',
      priority: 'medium',
      property: strongEngagement.name,
      action: `Monetize ${strongEngagement.name} more aggressively`,
      reason: `High traffic (${strongEngagement.current.sessions.toLocaleString()} sessions) and ${(strongEngagement.current.engagementRate * 100).toFixed(1)}% engagement. Test higher RPM placements.`,
      icon: '💰'
    });
  }

  const anomalyDrops = anomalies
    .flatMap((item) => item.anomalies.map((anomaly) => ({ property: item.property, anomaly })))
    .filter((entry) => entry.anomaly.type === 'drop')
    .sort((a, b) => a.anomaly.change - b.anomaly.change)[0];

  if (anomalyDrops) {
    recommendations.push({
      type: 'recover',
      priority: 'high',
      property: anomalyDrops.property,
      action: `Recover ${anomalyDrops.property} traffic` ,
      reason: `${anomalyDrops.property} ${anomalyDrops.anomaly.metric} dropped ${Math.abs(anomalyDrops.anomaly.change).toFixed(1)}%. Refresh top 5 pages and check tracking.`,
      icon: '🛠️'
    });
  }

  const pattern = patterns.find((item) => item.type === 'declining');
  if (pattern && pattern.properties?.length) {
    recommendations.push({
      type: 'rebalance',
      priority: 'medium',
      property: pattern.properties.join(', '),
      action: 'Rebalance focus across declining properties',
      reason: `Declines detected for ${pattern.properties.join(', ')}. Shift 1-2 content slots toward recovery topics.`,
      icon: '📌'
    });
  }

  return recommendations.slice(0, 5);
}

module.exports = { generateRecommendations };
