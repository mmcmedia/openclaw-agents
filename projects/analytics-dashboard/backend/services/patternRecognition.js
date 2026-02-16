const average = (values) => {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

function recognizePatterns(properties) {
  const patterns = [];
  if (!properties || !properties.length) return patterns;

  const topPerformers = properties
    .filter((prop) => prop.change?.sessions >= 15)
    .sort((a, b) => b.change.sessions - a.change.sessions)
    .slice(0, 3);

  if (topPerformers.length > 0) {
    patterns.push({
      type: 'top_performers',
      properties: topPerformers.map((prop) => prop.name),
      message: `${topPerformers.length} properties growing >15%: ${topPerformers
        .map((prop) => `${prop.name} (+${prop.change.sessions.toFixed(1)}%)`)
        .join(', ')}`
    });
  }

  const declining = properties
    .filter((prop) => prop.change?.sessions <= -15)
    .sort((a, b) => a.change.sessions - b.change.sessions)
    .slice(0, 3);

  if (declining.length > 0) {
    patterns.push({
      type: 'declining',
      properties: declining.map((prop) => prop.name),
      message: `${declining.length} properties declining >15%: ${declining
        .map((prop) => `${prop.name} (${prop.change.sessions.toFixed(1)}%)`)
        .join(', ')}`
    });
  }

  const avgChange = average(properties.map((prop) => prop.change?.sessions || 0));
  if (Math.abs(avgChange) >= 5) {
    patterns.push({
      type: 'portfolio_trend',
      direction: avgChange > 0 ? 'up' : 'down',
      change: avgChange,
      message: `Portfolio ${avgChange > 0 ? 'growing' : 'declining'} ${Math.abs(avgChange).toFixed(1)}% overall.`
    });
  }

  const highEngagement = properties
    .filter((prop) => prop.current?.engagementRate >= 0.45 && prop.current?.sessions >= 2000)
    .sort((a, b) => b.current.engagementRate - a.current.engagementRate)
    .slice(0, 2);

  if (highEngagement.length > 0) {
    patterns.push({
      type: 'engagement_wins',
      properties: highEngagement.map((prop) => prop.name),
      message: `High engagement leaders: ${highEngagement
        .map((prop) => `${prop.name} (${(prop.current.engagementRate * 100).toFixed(1)}%)`)
        .join(', ')}`
    });
  }

  return patterns;
}

module.exports = { recognizePatterns };
