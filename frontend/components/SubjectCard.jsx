import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useData } from '../DataContext';

export default function SubjectCard({ name, mean, median, stdDev }) {
  const { isDarkMode } = useData();
  // Generate sparkline points from mean
  const W = 90, H = 28;
  const raw = [mean - 7, mean - 2, mean + 3, mean, mean + 5, mean + 2, mean];
  const points = raw
    .map((v, i) => {
      const x = (i / (raw.length - 1)) * W;
      const y = H - ((v - 55) / 40) * H;
      return `${x.toFixed(1)},${Math.max(2, Math.min(H - 2, y)).toFixed(1)}`;
    })
    .join(' ');

  return (
    <View style={[styles.card, isDarkMode && styles.darkCard]}>
      <Text style={[styles.name, isDarkMode && styles.darkText]}>{name}</Text>
      <View style={styles.statsRow}>
        <StatBlock label="Mean"    value={mean} isDarkMode={isDarkMode} />
        <StatBlock label="Median"  value={median} isDarkMode={isDarkMode} />
        <StatBlock label="Std Dev" value={stdDev} isDarkMode={isDarkMode} />
      </View>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Polyline
          points={points}
          fill="none"
          stroke={isDarkMode ? "#748ffc" : "#3b5bdb"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

function StatBlock({ label, value, isDarkMode }) {
  return (
    <View style={styles.statBlock}>
      <Text style={[styles.statLabel, isDarkMode && styles.darkSubText]}>{label}</Text>
      <Text style={[styles.statValue, isDarkMode && styles.darkText]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    flex: 1,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  darkText: {
    color: '#ffffff',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#aaaaaa',
    marginBottom: 2,
  },
  darkSubText: {
    color: '#888888',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a2e',
  },
});
