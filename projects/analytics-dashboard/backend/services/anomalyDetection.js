const metricConfig = [
  {
    key: 'sessions',
    label: 'sessions',
    spike: 30,
    drop: -20,
    criticalDrop: -40
  },
  {
    key: 'users',
    label: 'users',
    spike: 25,
    drop: -15,
    criticalDrop: -35
  },
  {
    key: 'pageviews',
    label: 'pageviews',
    spike: 30,
    drop: -20,
    criticalDrop: -40
  }
];

const formatChange = (value) => `${value.toFixed(1)}%`;

function detectAnomalies(property) {
  const anomalies = [];

  if (!property || !property.change) return anomalies;

  metricConfig.forEach((metric) => {
    const changeValue = property.change[metric.key] ?? 0;
    const currentValue = property.current?.[metric.key] ?? 0;

    if (changeValue >= metric.spike) {
      anomalies.push({
        type: 'spike',
        metric: metric.key,
        severity: changeValue >= metric.spike + 20 ? 'high' : 'medium',
        change: changeValue,
        current: currentValue,
        message: `${property.name} ${metric.label} up ${formatChange(changeValue)} (${currentValue.toLocaleString()} current).`
      });
    }

    if (changeValue <= metric.drop) {
      anomalies.push({
        type: 'drop',
        metric: metric.key,
        severity: changeValue <= metric.criticalDrop ? 'critical' : 'high',
        change: changeValue,
        current: currentValue,
        message: `${property.name} ${metric.label} down ${formatChange(Math.abs(changeValue))} (${currentValue.toLocaleString()} current).`
      });
    }
  });

  return anomalies;
}

module.exports = { detectAnomalies };
