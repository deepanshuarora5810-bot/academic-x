import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useData } from '../DataContext';
import ScoreDistribution from '../components/ScoreDistribution';
import PerformanceCluster from '../components/PerformanceCluster';
import { SUBJECTS as DEFAULT_SUBJECTS } from '../data';

export default function TrendLogsScreen() {
  const { data } = useData();
  const SUBJECTS = data?.SUBJECTS || DEFAULT_SUBJECTS;
  const allStudents = data?.ALL_STUDENTS || [];

  const avgGpa = allStudents.length
    ? (allStudents.reduce((sum, s) => sum + s.gpa, 0) / allStudents.length).toFixed(2)
    : '—';

  const passCount = allStudents.filter(s => s.gpa >= 2.0).length;

  // Generate activity log from student data
  const activityLog = generateActivityLog(allStudents);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Trend Logs</Text>
      <Text style={styles.pageSub}>Analyze cohort performance patterns and score distribution trends.</Text>

      {/* Insight Cards */}
      <View style={styles.insightRow}>
        <InsightCard
          icon="📈"
          title="Cohort GPA"
          value={avgGpa}
          sub="Average across all students"
          color="#3b5bdb"
        />
        <InsightCard
          icon="✅"
          title="Pass Rate"
          value={allStudents.length > 0 ? `${Math.round((passCount / allStudents.length) * 100)}%` : '—'}
          sub="Students with GPA ≥ 2.0"
          color="#16a34a"
        />
        <InsightCard
          icon="📚"
          title="Subjects"
          value={SUBJECTS.length}
          sub="Tracked in this dataset"
          color="#d97706"
        />
      </View>

      {/* Subject Performance Rankings */}
      {SUBJECTS.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Subject Rankings by Mean Score</Text>
          {[...SUBJECTS]
            .sort((a, b) => b.mean - a.mean)
            .map((s, idx) => {
              const maxMean = Math.max(...SUBJECTS.map(x => x.mean));
              const pct = ((s.mean / maxMean) * 100).toFixed(0);
              const color = idx === 0 ? '#16a34a' : idx === SUBJECTS.length - 1 ? '#dc2626' : '#3b5bdb';

              return (
                <View key={s.id} style={styles.rankRow}>
                  <Text style={[styles.rankNum, { color }]}>#{idx + 1}</Text>
                  <Text style={styles.rankName}>{s.name}</Text>
                  <View style={styles.rankBarTrack}>
                    <View style={[styles.rankBarFill, { width: `${pct}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={[styles.rankValue, { color }]}>{s.mean}</Text>
                </View>
              );
            })}
        </View>
      )}

      {/* Charts */}
      <View style={styles.chartRow}>
        <View style={styles.chartCol}>
          <ScoreDistribution />
        </View>
        <View style={styles.chartCol}>
          <PerformanceCluster />
        </View>
      </View>

      {/* Activity Log */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🕐 Activity Log</Text>
        {activityLog.map((entry, i) => (
          <View key={i} style={[styles.logRow, i === activityLog.length - 1 && styles.logLastRow]}>
            <View style={[styles.logDot, { backgroundColor: entry.color }]} />
            <View style={styles.logContent}>
              <Text style={styles.logText}>{entry.message}</Text>
              <Text style={styles.logTime}>{entry.time}</Text>
            </View>
          </View>
        ))}
        {activityLog.length === 0 && (
          <Text style={styles.emptyLog}>Import a dataset to generate activity logs.</Text>
        )}
      </View>
    </ScrollView>
  );
}

function InsightCard({ icon, title, value, sub, color }) {
  return (
    <View style={[styles.insightCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Text style={styles.insightIcon}>{icon}</Text>
      <Text style={[styles.insightValue, { color }]}>{value}</Text>
      <Text style={styles.insightTitle}>{title}</Text>
      <Text style={styles.insightSub}>{sub}</Text>
    </View>
  );
}

function generateActivityLog(students) {
  if (!students || students.length === 0) return [];
  const log = [];
  const times = ['Just now', '2 min ago', '5 min ago', '12 min ago', '1 hour ago', '3 hours ago', 'Today'];
  let t = 0;

  const highRisk = students.filter(s => s.risk === 'High');
  const medRisk  = students.filter(s => s.risk === 'Medium');

  log.push({ message: `Dataset loaded with ${students.length} students`, color: '#3b5bdb', time: times[t++] });

  highRisk.slice(0, 2).forEach(s => {
    log.push({ message: `⚠ ${s.name} flagged as High Risk (GPA ${s.gpa.toFixed(2)})`, color: '#dc2626', time: times[t++] || 'Today' });
  });
  medRisk.slice(0, 2).forEach(s => {
    log.push({ message: `⚡ ${s.name} flagged as Medium Risk (GPA ${s.gpa.toFixed(2)})`, color: '#d97706', time: times[t++] || 'Today' });
  });

  const top = [...students].sort((a, b) => b.gpa - a.gpa)[0];
  if (top) log.push({ message: `🏆 ${top.name} is top performer (GPA ${top.gpa.toFixed(2)})`, color: '#16a34a', time: times[t++] || 'Today' });

  log.push({ message: 'Risk assessment report updated', color: '#888888', time: times[t++] || 'Today' });
  return log;
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f7f5' },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#888888', marginBottom: 24 },

  insightRow: { flexDirection: 'row', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  insightCard: { flex: 1, minWidth: 120, backgroundColor: '#ffffff', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)' },
  insightIcon: { fontSize: 22, marginBottom: 8 },
  insightValue: { fontSize: 26, fontWeight: '800', marginBottom: 2 },
  insightTitle: { fontSize: 13, fontWeight: '600', color: '#1a1a2e', marginBottom: 2 },
  insightSub: { fontSize: 11, color: '#888888', textAlign: 'center' },

  card: { backgroundColor: '#ffffff', borderRadius: 14, padding: 20, marginBottom: 20,
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a2e', marginBottom: 16 },

  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  rankNum: { fontSize: 13, fontWeight: '700', width: 24 },
  rankName: { fontSize: 13, color: '#333333', width: 130 },
  rankBarTrack: { flex: 1, height: 7, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  rankBarFill: { height: '100%', borderRadius: 4 },
  rankValue: { fontSize: 13, fontWeight: '700', width: 36, textAlign: 'right' },

  chartRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
  chartCol: { flex: 1, minWidth: 300 },

  logRow: { flexDirection: 'row', gap: 12, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.06)' },
  logLastRow: { borderBottomWidth: 0 },
  logDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  logContent: { flex: 1 },
  logText: { fontSize: 13, color: '#333333', lineHeight: 18 },
  logTime: { fontSize: 11, color: '#aaaaaa', marginTop: 2 },
  emptyLog: { fontSize: 14, color: '#aaaaaa', textAlign: 'center', paddingVertical: 20 },
});
