import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useData } from '../DataContext';
import { SUBJECTS as DEFAULT_SUBJECTS } from '../data';

export default function SubjectAnalysisScreen() {
  const { data } = useData();
  const SUBJECTS = data?.SUBJECTS || DEFAULT_SUBJECTS;
  const [sortBy, setSortBy] = useState('mean'); // 'mean' | 'median' | 'stdDev'

  const sorted = [...SUBJECTS].sort((a, b) => {
    if (sortBy === 'stdDev') return b[sortBy] - a[sortBy]; // higher std = more variable
    return b[sortBy] - a[sortBy];
  });

  const maxMean = Math.max(...SUBJECTS.map(s => s.mean), 1);

  const gradeColor = (score) => {
    if (score >= 85) return '#16a34a';
    if (score >= 70) return '#3b5bdb';
    if (score >= 55) return '#d97706';
    return '#dc2626';
  };

  const gradeLabel = (score) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Subject Analysis</Text>
      <Text style={styles.pageSub}>Detailed breakdown of performance across all academic subjects.</Text>

      {/* Summary Row */}
      {SUBJECTS.length > 0 && (
        <View style={styles.summaryRow}>
          <SummaryBox
            label="Best Subject"
            value={[...SUBJECTS].sort((a,b) => b.mean - a.mean)[0]?.name || '—'}
            icon="🏆"
            color="#16a34a"
          />
          <SummaryBox
            label="Weakest Subject"
            value={[...SUBJECTS].sort((a,b) => a.mean - b.mean)[0]?.name || '—'}
            icon="📉"
            color="#dc2626"
          />
          <SummaryBox
            label="Most Variable"
            value={[...SUBJECTS].sort((a,b) => b.stdDev - a.stdDev)[0]?.name || '—'}
            icon="📊"
            color="#d97706"
          />
        </View>
      )}

      {/* Sort controls */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {['mean', 'median', 'stdDev'].map(key => (
          <TouchableOpacity
            key={key}
            onPress={() => setSortBy(key)}
            style={[styles.sortBtn, sortBy === key && styles.sortBtnActive]}
          >
            <Text style={[styles.sortBtnText, sortBy === key && styles.sortBtnTextActive]}>
              {key === 'stdDev' ? 'Std Dev' : key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Subject Cards */}
      {sorted.map((s, idx) => (
        <View key={s.id} style={styles.subjectCard}>
          <View style={styles.subjectCardHeader}>
            <View style={styles.subjectRankBadge}>
              <Text style={styles.subjectRankText}>#{idx + 1}</Text>
            </View>
            <View style={styles.subjectNameBlock}>
              <Text style={styles.subjectName}>{s.name}</Text>
              <View style={[styles.gradeBadge, { backgroundColor: gradeColor(s.mean) + '18' }]}>
                <Text style={[styles.gradeText, { color: gradeColor(s.mean) }]}>{gradeLabel(s.mean)}</Text>
              </View>
            </View>
            <Text style={[styles.meanBig, { color: gradeColor(s.mean) }]}>{s.mean}</Text>
          </View>

          {/* Mean bar */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, {
              width: `${(s.mean / maxMean) * 100}%`,
              backgroundColor: gradeColor(s.mean),
            }]} />
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <Stat label="Mean"    value={s.mean}   />
            <StatDivider />
            <Stat label="Median"  value={s.median} />
            <StatDivider />
            <Stat label="Std Dev" value={s.stdDev} note="variability" />
          </View>

          {/* Std Dev indicator */}
          <View style={styles.variabilityRow}>
            <Text style={styles.variabilityLabel}>Score Spread</Text>
            <View style={styles.variabilityTrack}>
              <View style={[styles.variabilityFill, {
                width: `${Math.min(s.stdDev * 3, 100)}%`,
                backgroundColor: s.stdDev > 15 ? '#dc2626' : s.stdDev > 10 ? '#d97706' : '#16a34a',
              }]} />
            </View>
            <Text style={styles.variabilityNote}>
              {s.stdDev > 15 ? 'High' : s.stdDev > 10 ? 'Medium' : 'Low'}
            </Text>
          </View>
        </View>
      ))}

      {SUBJECTS.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No data available</Text>
          <Text style={styles.emptyText}>Import a CSV dataset to see subject analytics.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function SummaryBox({ label, value, icon, color }) {
  return (
    <View style={[styles.summaryBox, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Text style={styles.summaryIcon}>{icon}</Text>
      <Text style={[styles.summaryValue, { color }]} numberOfLines={1}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function Stat({ label, value, note }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatDivider() {
  return <View style={styles.statDivider} />;
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f7f5' },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#888888', marginBottom: 24 },

  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryBox: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 14, alignItems: 'center',
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)' },
  summaryIcon: { fontSize: 22, marginBottom: 6 },
  summaryValue: { fontSize: 13, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  summaryLabel: { fontSize: 11, color: '#888888' },

  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  sortLabel: { fontSize: 13, color: '#888888' },
  sortBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)', backgroundColor: '#ffffff' },
  sortBtnActive: { backgroundColor: '#3b5bdb', borderColor: '#3b5bdb' },
  sortBtnText: { fontSize: 13, color: '#555555', fontWeight: '500' },
  sortBtnTextActive: { color: '#ffffff' },

  subjectCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 20, marginBottom: 14,
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
  subjectCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  subjectRankBadge: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#f0f4ff',
    alignItems: 'center', justifyContent: 'center' },
  subjectRankText: { fontSize: 13, fontWeight: '700', color: '#3b5bdb' },
  subjectNameBlock: { flex: 1, gap: 4 },
  subjectName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },
  gradeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  gradeText: { fontSize: 11, fontWeight: '600' },
  meanBig: { fontSize: 28, fontWeight: '800' },

  barTrack: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden', marginBottom: 16 },
  barFill: { height: '100%', borderRadius: 4 },

  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#888888' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(0,0,0,0.08)' },

  variabilityRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  variabilityLabel: { fontSize: 12, color: '#888888', width: 80 },
  variabilityTrack: { flex: 1, height: 5, backgroundColor: '#f0f0f0', borderRadius: 3, overflow: 'hidden' },
  variabilityFill: { height: '100%', borderRadius: 3 },
  variabilityNote: { fontSize: 12, color: '#555555', width: 50, textAlign: 'right', fontWeight: '500' },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#888888' },
});
