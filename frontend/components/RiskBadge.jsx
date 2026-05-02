import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RISK_COLORS } from '../data';

/**
 * RiskBadge
 * Props:
 *   level {string} – 'High' | 'Medium' | 'Low'
 */
export default function RiskBadge({ level }) {
  const scheme = RISK_COLORS[level] ?? RISK_COLORS.Low;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: scheme.bg,
          borderColor: scheme.border,
        },
      ]}
    >
      <Text style={[styles.text, { color: scheme.text }]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
