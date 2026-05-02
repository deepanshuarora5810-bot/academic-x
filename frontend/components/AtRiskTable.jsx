import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { AT_RISK_STUDENTS as DEFAULT_AT_RISK_STUDENTS } from '../data';
import RiskBadge from './RiskBadge';
import { useData } from '../DataContext';

const FILTERS = ['All Students', 'High', 'Medium', 'Low'];

/**
 * AtRiskTable
 * Filterable table of at-risk students with intervention action.
 */
export default function AtRiskTable() {
  const [filter, setFilter] = useState('All Students');
  const { data } = useData();
  const AT_RISK_STUDENTS = data?.AT_RISK_STUDENTS || DEFAULT_AT_RISK_STUDENTS;

  const displayed =
    filter === 'All Students'
      ? AT_RISK_STUDENTS
      : AT_RISK_STUDENTS.filter(s => s.risk === filter);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.titleRow}>
            <View style={styles.alertDot} />
            <Text style={styles.title}>At-risk students detection</Text>
          </View>
          <Text style={styles.subtitle}>
            Students flagged by risk assessment logic
          </Text>
        </View>
        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterPill,
                filter === f && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Column headers */}
      <View style={styles.colHeaders}>
        {['Student', 'ID', 'GPA', 'Risk', 'Last Alert', 'Action'].map(h => (
          <Text key={h} style={[styles.colHeader, colFlex(h)]}>
            {h}
          </Text>
        ))}
      </View>

      {/* Rows */}
      {displayed.map((s, idx) => (
        <View
          key={s.id}
          style={[styles.row, idx === displayed.length - 1 && styles.lastRow]}
        >
          <Text style={[styles.cellName, colFlex('Student')]} numberOfLines={1}>
            {s.name}
          </Text>
          <Text style={[styles.cellMuted, colFlex('ID')]}>#{s.id}</Text>
          <Text style={[styles.cellBold, colFlex('GPA')]}>
            {s.gpa.toFixed(2)}
          </Text>
          <View style={colFlex('Risk')}>
            <RiskBadge level={s.risk} />
          </View>
          <Text style={[styles.cellMuted, colFlex('Last Alert')]} numberOfLines={1}>
            {s.lastAlert}
          </Text>
          <TouchableOpacity
            style={[styles.intBtn, colFlex('Action')]}
            onPress={() => alert(`Initiating intervention workflow for ${s.name}...`)}
          >
            <Text style={styles.intBtnText}>↘ Intervene</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function colFlex(col) {
  const map = {
    Student:    { flex: 2 },
    ID:         { flex: 1 },
    GPA:        { flex: 1 },
    Risk:       { flex: 1.2 },
    'Last Alert': { flex: 1.4 },
    Action:     { flex: 1.4 },
  };
  return map[col] ?? { flex: 1 };
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
  header: {
    marginBottom: 16,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a32d2d',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  subtitle: {
    fontSize: 12,
    color: '#999999',
    paddingLeft: 18,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 2,
  },
  filterPill: {
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  filterPillActive: {
    backgroundColor: '#eef2ff',
    borderColor: '#3b5bdb',
  },
  filterText: {
    fontSize: 12,
    color: '#666666',
  },
  filterTextActive: {
    color: '#3b5bdb',
    fontWeight: '600',
  },
  colHeaders: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 2,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888888',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  cellName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a2e',
  },
  cellMuted: {
    fontSize: 12,
    color: '#888888',
  },
  cellBold: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  intBtn: {
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  intBtnText: {
    fontSize: 11,
    color: '#555555',
  },
});
