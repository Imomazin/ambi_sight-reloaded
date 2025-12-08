'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Types for real-time data
export interface RealTimeKPI {
  id: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  lastUpdated: Date;
}

export interface RealTimeDataPoint {
  timestamp: Date;
  value: number;
}

export interface RealTimeAlert {
  id: string;
  type: 'warning' | 'critical' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  metric?: string;
  threshold?: number;
  currentValue?: number;
}

// Simulate realistic market-like fluctuations
function generateFluctuation(baseValue: number, volatility: number = 0.02): number {
  const random = Math.random();
  const direction = random > 0.5 ? 1 : -1;
  const magnitude = Math.random() * volatility;
  const newValue = baseValue * (1 + direction * magnitude);
  return Math.round(newValue * 100) / 100;
}

// Generate trending data with momentum
function generateTrendingValue(
  currentValue: number,
  targetValue: number,
  momentum: number = 0.1,
  noise: number = 0.02
): number {
  const trend = (targetValue - currentValue) * momentum;
  const noiseComponent = currentValue * (Math.random() - 0.5) * noise;
  return currentValue + trend + noiseComponent;
}

// Real-time data hook for KPIs
export function useRealTimeKPIs(
  initialKPIs: { id: string; value: number }[],
  updateInterval: number = 3000
) {
  const [kpis, setKpis] = useState<Map<string, RealTimeKPI>>(() => {
    const map = new Map();
    initialKPIs.forEach(kpi => {
      map.set(kpi.id, {
        id: kpi.id,
        value: kpi.value,
        previousValue: kpi.value,
        trend: 'stable' as const,
        changePercent: 0,
        lastUpdated: new Date(),
      });
    });
    return map;
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setKpis(prev => {
        const next = new Map(prev);
        next.forEach((kpi, id) => {
          const previousValue = kpi.value;
          const newValue = generateFluctuation(previousValue, 0.015);
          const changePercent = ((newValue - previousValue) / previousValue) * 100;
          const trend = changePercent > 0.1 ? 'up' : changePercent < -0.1 ? 'down' : 'stable';

          next.set(id, {
            ...kpi,
            value: newValue,
            previousValue,
            trend,
            changePercent: Math.round(changePercent * 100) / 100,
            lastUpdated: new Date(),
          });
        });
        return next;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isLive, updateInterval]);

  const toggleLive = useCallback(() => setIsLive(prev => !prev), []);

  return { kpis, isLive, toggleLive };
}

// Real-time streaming data for charts
export function useRealTimeChart(
  initialData: number[],
  maxPoints: number = 20,
  updateInterval: number = 2000
) {
  const [data, setData] = useState<RealTimeDataPoint[]>(() =>
    initialData.map((value, i) => ({
      timestamp: new Date(Date.now() - (initialData.length - i) * updateInterval),
      value,
    }))
  );
  const [isStreaming, setIsStreaming] = useState(true);
  const lastValueRef = useRef(initialData[initialData.length - 1] || 50);

  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newValue = generateFluctuation(lastValueRef.current, 0.03);
      lastValueRef.current = newValue;

      setData(prev => {
        const next = [...prev, { timestamp: new Date(), value: newValue }];
        if (next.length > maxPoints) {
          return next.slice(-maxPoints);
        }
        return next;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isStreaming, maxPoints, updateInterval]);

  const toggleStreaming = useCallback(() => setIsStreaming(prev => !prev), []);

  return { data, isStreaming, toggleStreaming };
}

// Alert system hook
export function useAlertSystem() {
  const [alerts, setAlerts] = useState<RealTimeAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addAlert = useCallback((alert: Omit<RealTimeAlert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: RealTimeAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      acknowledged: false,
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
    setUnreadCount(prev => prev + 1);
    return newAlert;
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const acknowledgeAll = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, acknowledged: true })));
    setUnreadCount(0);
  }, []);

  const clearAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
    setUnreadCount(0);
  }, []);

  return {
    alerts,
    unreadCount,
    addAlert,
    acknowledgeAlert,
    acknowledgeAll,
    clearAlert,
    clearAll,
  };
}

// Threshold monitoring hook
export function useThresholdMonitor(
  kpis: Map<string, RealTimeKPI>,
  thresholds: { id: string; warningThreshold: number; criticalThreshold: number; direction: 'above' | 'below' }[],
  onAlert: (alert: Omit<RealTimeAlert, 'id' | 'timestamp' | 'acknowledged'>) => void
) {
  const lastAlertTime = useRef<Map<string, number>>(new Map());
  const ALERT_COOLDOWN = 30000; // 30 seconds between alerts for same metric

  useEffect(() => {
    thresholds.forEach(threshold => {
      const kpi = kpis.get(threshold.id);
      if (!kpi) return;

      const lastAlert = lastAlertTime.current.get(threshold.id) || 0;
      const now = Date.now();
      if (now - lastAlert < ALERT_COOLDOWN) return;

      const isAbove = threshold.direction === 'above';
      const criticalBreached = isAbove
        ? kpi.value >= threshold.criticalThreshold
        : kpi.value <= threshold.criticalThreshold;
      const warningBreached = isAbove
        ? kpi.value >= threshold.warningThreshold
        : kpi.value <= threshold.warningThreshold;

      if (criticalBreached) {
        lastAlertTime.current.set(threshold.id, now);
        onAlert({
          type: 'critical',
          title: `Critical: ${threshold.id}`,
          message: `${threshold.id} has ${isAbove ? 'exceeded' : 'fallen below'} critical threshold (${threshold.criticalThreshold})`,
          metric: threshold.id,
          threshold: threshold.criticalThreshold,
          currentValue: kpi.value,
        });
      } else if (warningBreached) {
        lastAlertTime.current.set(threshold.id, now);
        onAlert({
          type: 'warning',
          title: `Warning: ${threshold.id}`,
          message: `${threshold.id} is approaching ${isAbove ? 'upper' : 'lower'} limit (${threshold.warningThreshold})`,
          metric: threshold.id,
          threshold: threshold.warningThreshold,
          currentValue: kpi.value,
        });
      }
    });
  }, [kpis, thresholds, onAlert]);
}

// Predictive analytics hook
export interface Prediction {
  timestamp: Date;
  predicted: number;
  lowerBound: number;
  upperBound: number;
  confidence: number;
}

export function usePredictiveAnalytics(
  historicalData: RealTimeDataPoint[],
  horizonPoints: number = 5
) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    if (historicalData.length < 5) {
      setPredictions([]);
      return;
    }

    // Simple linear regression for trend
    const n = historicalData.length;
    const xMean = (n - 1) / 2;
    const yMean = historicalData.reduce((sum, d) => sum + d.value, 0) / n;

    let numerator = 0;
    let denominator = 0;
    historicalData.forEach((d, i) => {
      numerator += (i - xMean) * (d.value - yMean);
      denominator += (i - xMean) ** 2;
    });

    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;

    // Calculate standard error
    const residuals = historicalData.map((d, i) => d.value - (slope * i + intercept));
    const standardError = Math.sqrt(
      residuals.reduce((sum, r) => sum + r ** 2, 0) / (n - 2)
    );

    // Generate predictions
    const lastTimestamp = historicalData[n - 1].timestamp.getTime();
    const interval = n > 1
      ? (lastTimestamp - historicalData[0].timestamp.getTime()) / (n - 1)
      : 60000;

    const newPredictions: Prediction[] = [];
    for (let i = 1; i <= horizonPoints; i++) {
      const predictedValue = slope * (n - 1 + i) + intercept;
      const confidenceMultiplier = 1.96 * Math.sqrt(1 + 1/n + ((n - 1 + i - xMean) ** 2) / denominator);
      const margin = standardError * confidenceMultiplier * (1 + i * 0.1); // Increasing uncertainty

      newPredictions.push({
        timestamp: new Date(lastTimestamp + i * interval),
        predicted: Math.round(predictedValue * 100) / 100,
        lowerBound: Math.round((predictedValue - margin) * 100) / 100,
        upperBound: Math.round((predictedValue + margin) * 100) / 100,
        confidence: Math.max(0.5, 0.95 - i * 0.08), // Decreasing confidence
      });
    }

    setPredictions(newPredictions);
  }, [historicalData, horizonPoints]);

  return predictions;
}
