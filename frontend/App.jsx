import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import Sidebar         from './components/Sidebar';
import TopBar          from './components/TopBar';
import DashboardScreen from './screens/DashboardScreen';
import StudentDirectoryScreen from './screens/StudentDirectoryScreen';
import SubjectAnalysisScreen from './screens/SubjectAnalysisScreen';
import RiskReportsScreen from './screens/RiskReportsScreen';
import TrendLogsScreen from './screens/TrendLogsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { DataProvider, useData } from './DataContext';

/**
 * App
 * Root entry point.
 * Renders the two-column shell:
 *   [Sidebar] | [TopBar + active screen]
 *
 * On narrow screens (phones) the sidebar collapses and can be
 * toggled via a future hamburger button in TopBar.
 */
function ThemedApp() {
  const { isDarkMode } = useData();
  const [activePage, setActivePage] = useState('Dashboard');

  const renderScreen = () => {
    switch (activePage) {
      case 'Dashboard': return <DashboardScreen />;
      case 'Student Directory': return <StudentDirectoryScreen />;
      case 'Subject Analysis': return <SubjectAnalysisScreen />;
      case 'Risk Reports': return <RiskReportsScreen />;
      case 'Trend Logs': return <TrendLogsScreen />;
      case 'Settings': return <SettingsScreen />;
      default:
        return (
          <View style={[styles.placeholder, isDarkMode && styles.darkPlaceholder]}>
            <Text style={[styles.placeholderText, isDarkMode && styles.darkText]}>
              {activePage} Screen
            </Text>
            <Text style={[styles.placeholderSub, isDarkMode && styles.darkSubText]}>
              This section is under construction.
            </Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.root, isDarkMode && styles.darkRoot]}>
      <View style={styles.shell}>
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <View style={styles.main}>
          <TopBar />
          {renderScreen()}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <DataProvider>
      <ThemedApp />
    </DataProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f7f5',
  },
  darkRoot: {
    backgroundColor: '#121212',
  },
  shell: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  darkPlaceholder: {
    backgroundColor: '#1e1e1e',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  darkText: {
    color: '#ffffff',
  },
  placeholderSub: {
    fontSize: 14,
    color: '#888888',
  },
  darkSubText: {
    color: '#aaaaaa',
  },
});
