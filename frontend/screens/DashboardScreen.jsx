import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import KpiCard           from '../components/KpiCard';
import SubjectCard       from '../components/SubjectCard';
import ScoreDistribution from '../components/ScoreDistribution';
import AtRiskTable       from '../components/AtRiskTable';
import PerformanceCluster from '../components/PerformanceCluster';

import { KPI_CARDS as DEFAULT_KPI, SUBJECTS as DEFAULT_SUBJECTS } from '../data';
import { useData } from '../DataContext';

/**
 * DashboardScreen
 * Composes all dashboard sections:
 *   1. KPI cards row
 *   2. Subject performance grid
 *   3. Score distribution chart
 *   4. At-risk students table
 *   5. Performance clustering scatter
 */
export default function DashboardScreen() {
  const { data, isDarkMode } = useData();
  const KPI_CARDS = data?.KPI_CARDS || DEFAULT_KPI;
  const SUBJECTS = data?.SUBJECTS || DEFAULT_SUBJECTS;

  return (
    <ScrollView
      style={[styles.scroll, isDarkMode && styles.darkScroll]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Page header */}
      <Text style={[styles.pageTitle, isDarkMode && styles.darkText]}>Academic Analytics Dashboard</Text>
      <Text style={[styles.pageSub, isDarkMode && styles.darkSubText]}>
        Real-time insights into student performance, risk assessment, and subject analytics
      </Text>

      {/* ── 1. KPI row ────────────────────────────────────────────── */}
      <View style={styles.kpiRow}>
        {KPI_CARDS.map(card => (
          <KpiCard
            key={card.id}
            label={card.label}
            value={card.value}
            unit={card.unit}
            change={card.change}
            changeUp={card.changeUp}
            iconBg={card.iconBg}
            iconColor={card.iconColor}
            icon={<KpiIcon id={card.id} color={card.iconColor} />}
          />
        ))}
      </View>

      {/* ── 2. Subject performance ────────────────────────────────── */}
      <SectionHead
        title="Subject performance overview"
        sub="Mean scores, distribution, and performance trends"
        isDarkMode={isDarkMode}
      />
      <View style={styles.subjectGrid}>
        {SUBJECTS.map((s, i) => (
          <View
            key={s.id}
            style={[
              styles.subjectCell,
              i % 2 === 0 ? styles.cellLeft : styles.cellRight,
            ]}
          >
            <SubjectCard
              name={s.name}
              mean={s.mean}
              median={s.median}
              stdDev={s.stdDev}
            />
          </View>
        ))}
      </View>

      {/* ── 3. Score distribution ─────────────────────────────────── */}
      <SectionHead
        title="Score distribution"
        sub="Number of students per grade bracket"
        noMargin
        isDarkMode={isDarkMode}
      />
      <ScoreDistribution />

      {/* ── 4. At-risk students ───────────────────────────────────── */}
      <AtRiskTable />

      {/* ── 5. Performance clustering ─────────────────────────────── */}
      <PerformanceCluster />

      {/* Footer */}
      <Text style={[styles.footer, isDarkMode && styles.darkFooter]}>© 2024 AcademiX Analytics</Text>
    </ScrollView>
  );
}

/** Minimal inline icon renderer keyed by KPI id */
function KpiIcon({ id, color }) {
  const icons = {
    gpa:        '▦',
    atrisk:     '⊙',
    topsubject: '★',
    passrate:   '✓',
  };
  return (
    <Text style={{ fontSize: 16, color }}>{icons[id] ?? '•'}</Text>
  );
}

/** Reusable section heading */
function SectionHead({ title, sub, noMargin, isDarkMode }) {
  return (
    <View style={[styles.sectionHead, noMargin && { marginTop: 0 }]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>{title}</Text>
      <Text style={[styles.sectionSub, isDarkMode && styles.darkSubText]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f7f7f5',
  },
  darkScroll: {
    backgroundColor: '#121212',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  pageSub: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 24,
    lineHeight: 18,
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubText: {
    color: '#aaaaaa',
  },

  // KPI
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },

  // Subject grid – 2-column
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  subjectCell: {
    width: '50%',
    paddingHorizontal: 6,
    paddingBottom: 12,
  },
  cellLeft:  {},
  cellRight: {},

  // Section header
  sectionHead: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 3,
  },
  sectionSub: {
    fontSize: 12,
    color: '#999999',
  },

  footer: {
    fontSize: 11,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 8,
  },
  darkFooter: {
    color: '#555555',
  },
});
