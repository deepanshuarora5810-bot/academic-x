import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useData } from '../DataContext';
import RiskBadge from '../components/RiskBadge';

export default function StudentDirectoryScreen() {
  const { data } = useData();
  const students = data?.ALL_STUDENTS || [];
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => setExpandedId(prev => (prev === id ? null : id));

  const gpaColor = (gpa) => {
    if (gpa >= 3.5) return '#16a34a';
    if (gpa >= 2.5) return '#3b5bdb';
    if (gpa >= 2.0) return '#d97706';
    return '#dc2626';
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Student Directory</Text>
      <Text style={styles.pageSub}>Complete list of all enrolled students and their academic status.</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <MiniStat label="Total" value={students.length} color="#3b5bdb" />
        <MiniStat label="Excellent GPA" value={students.filter(s => s.gpa >= 3.5).length} color="#16a34a" />
        <MiniStat label="At Risk" value={students.filter(s => s.risk !== 'Low').length} color="#dc2626" />
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search student name..."
          placeholderTextColor="#aaaaaa"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Text style={styles.resultCount}>{filtered.length} found</Text>
        )}
      </View>

      {/* Table Header */}
      {students.length > 0 && (
        <View style={styles.tableHeader}>
          <Text style={[styles.th, { flex: 2 }]}>Student</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>GPA</Text>
          <Text style={[styles.th, { flex: 1, textAlign: 'center' }]}>Risk</Text>
          <Text style={[styles.th, { width: 30 }]}></Text>
        </View>
      )}

      {/* Rows */}
      <View style={styles.card}>
        {filtered.length > 0 ? filtered.map((s, idx) => {
          const isExpanded = expandedId === s.id;
          const scores = Object.entries(s.scores || {});

          return (
            <View key={s.id}>
              <View
                style={[
                  styles.row,
                  idx === filtered.length - 1 && !isExpanded && styles.lastRow,
                ]}
              >
                {/* Avatar + Name */}
                <View style={[styles.nameCell, { flex: 2 }]}>
                  <View style={[styles.avatar, { backgroundColor: gpaColor(s.gpa) + '22' }]}>
                    <Text style={[styles.avatarText, { color: gpaColor(s.gpa) }]}>
                      {s.name.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.studentName}>{s.name}</Text>
                    <Text style={styles.studentId}>#{s.id}</Text>
                  </View>
                </View>

                {/* GPA */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={[styles.gpaValue, { color: gpaColor(s.gpa) }]}>{s.gpa.toFixed(2)}</Text>
                  <Text style={styles.gpaMax}>/ 4.0</Text>
                </View>

                {/* Risk */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <RiskBadge level={s.risk} />
                </View>

                {/* Expand toggle */}
                <Text
                  onPress={() => toggle(s.id)}
                  style={styles.expandBtn}
                >
                  {isExpanded ? '▲' : '▼'}
                </Text>
              </View>

              {/* Expanded scores */}
              {isExpanded && (
                <View style={styles.expandedSection}>
                  <Text style={styles.expandedTitle}>Subject Scores</Text>
                  <View style={styles.scoresGrid}>
                    {scores.map(([subj, score]) => (
                      <View key={subj} style={styles.scoreChip}>
                        <Text style={styles.scoreChipSubj}>{subj}</Text>
                        <Text style={[styles.scoreChipValue, {
                          color: score < 50 ? '#dc2626' : score < 70 ? '#d97706' : '#16a34a'
                        }]}>{score}</Text>
                        <View style={styles.miniBarTrack}>
                          <View style={[styles.miniBarFill, {
                            width: `${score}%`,
                            backgroundColor: score < 50 ? '#dc2626' : score < 70 ? '#d97706' : '#16a34a'
                          }]} />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          );
        }) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {students.length === 0
                ? 'No student data. Please import a dataset.'
                : `No students match "${search}"`}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <View style={[styles.miniStat, { borderTopColor: color }]}>
      <Text style={[styles.miniStatValue, { color }]}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f7f5' },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#888888', marginBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  miniStat: { flex: 1, backgroundColor: '#ffffff', borderRadius: 10, padding: 14, alignItems: 'center',
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)', borderTopWidth: 3 },
  miniStatValue: { fontSize: 24, fontWeight: '800', marginBottom: 2 },
  miniStatLabel: { fontSize: 11, color: '#888888' },

  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff',
    borderRadius: 10, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 12,
    paddingVertical: 8, marginBottom: 16, gap: 8 },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, color: '#1a1a2e', height: 30 },
  resultCount: { fontSize: 12, color: '#3b5bdb', fontWeight: '600' },

  tableHeader: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, marginBottom: 2 },
  th: { fontSize: 11, fontWeight: '600', color: '#888888', textTransform: 'uppercase' },

  card: { backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 16,
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.06)' },
  lastRow: { borderBottomWidth: 0 },

  nameCell: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700' },
  studentName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  studentId: { fontSize: 11, color: '#888888', marginTop: 1 },

  gpaValue: { fontSize: 15, fontWeight: '700' },
  gpaMax: { fontSize: 10, color: '#888888' },

  expandBtn: { fontSize: 11, color: '#888888', paddingHorizontal: 8, paddingVertical: 4 },

  expandedSection: { backgroundColor: '#fafafa', padding: 16, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.06)' },
  expandedTitle: { fontSize: 12, fontWeight: '600', color: '#555555', marginBottom: 12 },
  scoresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  scoreChip: { backgroundColor: '#ffffff', borderRadius: 10, padding: 12, width: '48%',
    borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.08)' },
  scoreChipSubj: { fontSize: 12, color: '#555555', marginBottom: 6 },
  scoreChipValue: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  miniBarTrack: { height: 4, backgroundColor: '#f0f0f0', borderRadius: 2, overflow: 'hidden' },
  miniBarFill: { height: '100%', borderRadius: 2 },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#888888', fontSize: 14 },
});
