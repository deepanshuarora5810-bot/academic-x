import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useData } from '../DataContext';
import RiskBadge from '../components/RiskBadge';

export default function RiskReportsScreen() {
  const { data } = useData();
  const atRisk = data?.AT_RISK_STUDENTS || [];
  const allStudents = data?.ALL_STUDENTS || [];
  const [expandedId, setExpandedId] = useState(null);

  const highRisk   = atRisk.filter(s => s.risk === 'High');
  const medRisk    = atRisk.filter(s => s.risk === 'Medium');
  const lowRisk    = allStudents.filter(s => s.risk === 'Low');

  const toggle = (id) => setExpandedId(prev => (prev === id ? null : id));

  const riskColor = (level) => {
    if (level === 'High')   return '#dc2626';
    if (level === 'Medium') return '#d97706';
    return '#16a34a';
  };

  const riskBg = (level) => {
    if (level === 'High')   return '#fef2f2';
    if (level === 'Medium') return '#fffbeb';
    return '#f0fdf4';
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Risk Reports</Text>
      <Text style={styles.pageSub}>Monitor and intervene for students at academic risk.</Text>

      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <StatBox label="High Risk" value={highRisk.length}   bg="#fef2f2" color="#dc2626" icon="⚠" />
        <StatBox label="Medium Risk" value={medRisk.length}  bg="#fffbeb" color="#d97706" icon="⚡" />
        <StatBox label="Low Risk"   value={lowRisk.length}   bg="#f0fdf4" color="#16a34a" icon="✓" />
        <StatBox label="Total"      value={allStudents.length} bg="#eff6ff" color="#3b5bdb" icon="👥" />
      </View>

      {/* Risk Breakdown Bar */}
      {allStudents.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Risk Distribution</Text>
          <View style={styles.barTrack}>
            {highRisk.length > 0 && (
              <View style={[styles.barSegment, { flex: highRisk.length, backgroundColor: '#dc2626' }]} />
            )}
            {medRisk.length > 0 && (
              <View style={[styles.barSegment, { flex: medRisk.length, backgroundColor: '#d97706' }]} />
            )}
            {lowRisk.length > 0 && (
              <View style={[styles.barSegment, { flex: lowRisk.length, backgroundColor: '#16a34a' }]} />
            )}
          </View>
          <View style={styles.barLegend}>
            <LegendDot color="#dc2626" label={`High (${highRisk.length})`} />
            <LegendDot color="#d97706" label={`Medium (${medRisk.length})`} />
            <LegendDot color="#16a34a" label={`Low (${lowRisk.length})`} />
          </View>
        </View>
      )}

      {/* At-Risk Student Cards */}
      {atRisk.length > 0 ? (
        <View>
          <Text style={styles.sectionLabel}>⚠ Students Requiring Attention</Text>
          {atRisk.map(student => {
            const isExpanded = expandedId === student.id;
            const scores = Object.entries(student.scores || {});
            const minScore = scores.length > 0 ? Math.min(...scores.map(([,v]) => v)) : 0;
            const weakSubject = scores.length > 0 ? scores.reduce((a, b) => a[1] < b[1] ? a : b)[0] : '-';

            return (
              <TouchableOpacity
                key={student.id}
                onPress={() => toggle(student.id)}
                activeOpacity={0.85}
                style={[styles.studentCard, { borderLeftColor: riskColor(student.risk), backgroundColor: riskBg(student.risk) }]}
              >
                <View style={styles.studentCardHeader}>
                  <View style={styles.studentCardLeft}>
                    <View style={[styles.avatarCircle, { backgroundColor: riskColor(student.risk) + '22' }]}>
                      <Text style={[styles.avatarText, { color: riskColor(student.risk) }]}>
                        {student.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.studentMeta}>GPA {student.gpa.toFixed(2)} • Weakest: {weakSubject}</Text>
                    </View>
                  </View>
                  <View style={styles.studentCardRight}>
                    <RiskBadge level={student.risk} />
                    <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.expandedSection}>
                    <Text style={styles.expandedTitle}>Subject Scores</Text>
                    {scores.map(([subj, score]) => (
                      <View key={subj} style={styles.scoreBarRow}>
                        <Text style={styles.scoreLabel}>{subj}</Text>
                        <View style={styles.scoreBarTrack}>
                          <View style={[styles.scoreBarFill, {
                            width: `${score}%`,
                            backgroundColor: score < 50 ? '#dc2626' : score < 70 ? '#d97706' : '#16a34a'
                          }]} />
                        </View>
                        <Text style={[styles.scoreValue, { color: score < 50 ? '#dc2626' : '#1a1a2e' }]}>{score}</Text>
                      </View>
                    ))}
                    {student.lastAlert && (
                      <Text style={styles.alertText}>🔔 Last alert: {student.lastAlert}</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={styles.emptyTitle}>No students at risk</Text>
          <Text style={styles.emptyText}>Import a dataset to see risk analysis.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function StatBox({ label, value, bg, color, icon }) {
  return (
    <View style={[styles.statBox, { backgroundColor: bg }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f7f5' },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#888888', marginBottom: 24 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  statBox: { flex: 1, minWidth: 100, borderRadius: 12, padding: 16, alignItems: 'center' },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11, color: '#666666', fontWeight: '500' },

  card: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, marginBottom: 20, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a2e', marginBottom: 14 },

  barTrack: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 12 },
  barSegment: { height: '100%' },
  barLegend: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#555555' },

  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 12 },

  studentCard: { borderRadius: 12, borderLeftWidth: 4, padding: 16, marginBottom: 12 },
  studentCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  studentCardRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  studentName: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  studentMeta: { fontSize: 12, color: '#666666', marginTop: 2 },
  chevron: { fontSize: 11, color: '#888888' },

  expandedSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)' },
  expandedTitle: { fontSize: 13, fontWeight: '600', color: '#555555', marginBottom: 12 },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  scoreLabel: { fontSize: 12, color: '#444', width: 130 },
  scoreBarTrack: { flex: 1, height: 6, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreValue: { fontSize: 12, fontWeight: '600', width: 28, textAlign: 'right' },
  alertText: { fontSize: 12, color: '#888888', marginTop: 10 },

  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12, color: '#16a34a' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#888888' },
});
