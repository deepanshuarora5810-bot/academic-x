import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SCORE_DISTRIBUTION as DEFAULT_SCORE_DIST } from '../data';
import { useData } from '../DataContext';

/**
 * ScoreDistribution
 * Renders a bar chart of student counts per grade bracket
 * and a summary legend below.
 */
export default function ScoreDistribution() {
  const { data } = useData();
  const SCORE_DISTRIBUTION = data?.SCORE_DISTRIBUTION || DEFAULT_SCORE_DIST;

  const maxCount = Math.max(...SCORE_DISTRIBUTION.map(d => d.count), 1);
  const BAR_MAX_H = 140;

  const getCount = (rangeStart, rangeEnd) => {
    return SCORE_DISTRIBUTION.filter(d => {
      const [start] = d.range.split('–').map(Number);
      return start >= rangeStart && start < rangeEnd;
    }).reduce((acc, curr) => acc + curr.count, 0);
  };

  const summary = [
    { label: 'Failing (0–40)',   value: getCount(0, 41),  color: '#a32d2d' },
    { label: 'At Risk (41–60)',  value: getCount(41, 61), color: '#633806' },
    { label: 'Passing (61–80)', value: getCount(61, 81), color: '#3b5bdb' },
    { label: 'Excellent (81+)', value: getCount(81, 101), color: '#27500a' },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Score distribution</Text>
      <Text style={styles.subtitle}>Number of students per grade bracket</Text>

      {/* Bar chart */}
      <View style={styles.barContainer}>
        {SCORE_DISTRIBUTION.map(item => {
          const barH = Math.round((item.count / maxCount) * BAR_MAX_H);
          return (
            <View key={item.range} style={styles.barGroup}>
              <Text style={styles.barCount}>{item.count}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: barH, backgroundColor: item.color },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.range}</Text>
            </View>
          );
        })}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Summary legend */}
      <View style={styles.legend}>
        {summary.map(s => (
          <View key={s.label} style={styles.legendItem}>
            <Text style={styles.legendLabel}>{s.label}</Text>
            <Text style={[styles.legendValue, { color: s.color }]}>
              {s.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 20,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 160,
    marginBottom: 16,
  },
  barGroup: {
    alignItems: 'center',
    gap: 4,
  },
  barCount: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 4,
  },
  barTrack: {
    width: 44,
    height: 140,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#666666',
    marginTop: 6,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 8,
  },
  legendItem: {
    alignItems: 'center',
    minWidth: 80,
  },
  legendLabel: {
    fontSize: 11,
    color: '#aaaaaa',
    marginBottom: 3,
    textAlign: 'center',
  },
  legendValue: {
    fontSize: 20,
    fontWeight: '600',
  },
});
