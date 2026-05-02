import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useData } from '../DataContext';

export default function KpiCard({
  label,
  value,
  unit,
  change,
  changeUp,
  iconBg,
  iconColor,
  icon,
}) {
  const { isDarkMode } = useData();
  return (
    <View style={[styles.card, isDarkMode && styles.darkCard]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }, isDarkMode && styles.darkIconBox]}>
          {icon}
        </View>
        <Text style={[styles.change, changeUp ? styles.up : styles.down, isDarkMode && (changeUp ? styles.darkUp : styles.darkDown)]}>
          {changeUp ? '↑' : '↓'} {change}
        </Text>
      </View>
      <Text style={[styles.label, isDarkMode && styles.darkSubText]}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, isDarkMode && styles.darkText]}>{value}</Text>
        <Text style={[styles.unit, isDarkMode && styles.darkSubText]}> {unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    minWidth: 140,
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkIconBox: {
    opacity: 0.9,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
  up:   { color: '#1e8449' },
  down: { color: '#c0392b' },
  darkUp: { color: '#2ecc71' },
  darkDown: { color: '#ff7675' },
  label: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  darkText: {
    color: '#ffffff',
  },
  unit: {
    fontSize: 12,
    color: '#aaaaaa',
    fontWeight: '400',
  },
  darkSubText: {
    color: '#aaaaaa',
  },
});
