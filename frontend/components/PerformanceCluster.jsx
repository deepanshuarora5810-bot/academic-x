import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { CLUSTER_DATA as DEFAULT_CLUSTER_DATA, CLUSTER_COLORS } from '../data';
import { useData } from '../DataContext';

const W = 320, H = 240;
const PAD = { top: 16, right: 16, bottom: 36, left: 36 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function toX(val) { return PAD.left + (val / 100) * PLOT_W; }
function toY(val) { return PAD.top + (1 - val / 100) * PLOT_H; }

const TICKS = [0, 25, 50, 75, 100];

const LEGEND = [
  { tier: 'Excellent', label: 'Excellent (3.7+)' },
  { tier: 'Good',      label: 'Good (3.0–3.7)' },
  { tier: 'Fair',      label: 'Fair (2.5–3.0)' },
  { tier: 'AtRisk',    label: 'At risk (<2.5)' },
];

/**
 * PerformanceCluster
 * Scatter plot — student effort (x) vs academic result (y),
 * colour-coded by performance tier.
 */
export default function PerformanceCluster() {
  const { data } = useData();
  const CLUSTER_DATA = data?.CLUSTER_DATA || DEFAULT_CLUSTER_DATA;
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Performance clustering</Text>
      <Text style={styles.subtitle}>
        Student effort vs academic result correlation
      </Text>

      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Grid lines + tick labels */}
        {TICKS.map(t => (
          <React.Fragment key={`tick-${t}`}>
            {/* Horizontal grid */}
            <Line
              x1={PAD.left} y1={toY(t)}
              x2={PAD.left + PLOT_W} y2={toY(t)}
              stroke="rgba(0,0,0,0.07)" strokeWidth={0.8} strokeDasharray="4,4"
            />
            {/* Y-axis labels */}
            <SvgText
              x={PAD.left - 6} y={toY(t) + 4}
              textAnchor="end" fontSize="9" fill="#bbbbbb"
            >{t}</SvgText>
            {/* Vertical grid */}
            <Line
              x1={toX(t)} y1={PAD.top}
              x2={toX(t)} y2={PAD.top + PLOT_H}
              stroke="rgba(0,0,0,0.07)" strokeWidth={0.8} strokeDasharray="4,4"
            />
            {/* X-axis labels */}
            <SvgText
              x={toX(t)} y={H - 6}
              textAnchor="middle" fontSize="9" fill="#bbbbbb"
            >{t}</SvgText>
          </React.Fragment>
        ))}

        {/* Axes */}
        <Line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + PLOT_H}
          stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
        <Line x1={PAD.left} y1={PAD.top + PLOT_H} x2={PAD.left + PLOT_W} y2={PAD.top + PLOT_H}
          stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />

        {/* Data points */}
        {CLUSTER_DATA.map((d, i) => (
          <Circle
            key={i}
            cx={toX(d.x)} cy={toY(d.y)}
            r={6}
            fill={CLUSTER_COLORS[d.tier]}
            opacity={0.85}
          />
        ))}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        {LEGEND.map(l => (
          <View key={l.tier} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: CLUSTER_COLORS[l.tier] }]} />
            <Text style={styles.legendLabel}>{l.label}</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 3,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 11,
    color: '#777777',
  },
});
