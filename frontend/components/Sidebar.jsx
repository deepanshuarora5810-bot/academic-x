import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NAV_ITEMS } from '../data';
import { useData } from '../DataContext';

export default function Sidebar({ activePage, onNavigate }) {
  const { isDarkMode } = useData();
  return (
    <View style={[styles.sidebar, isDarkMode && styles.darkSidebar]}>
      {/* Logo */}
      <View style={[styles.logoRow, isDarkMode && styles.darkLogoRow]}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoIconText}>▦</Text>
        </View>
        <Text style={[styles.logoText, isDarkMode && styles.darkLogoText]}>AcademiX</Text>
      </View>

      {/* Nav items */}
      <View style={styles.nav}>
        {NAV_ITEMS.map(item => {
          const isActive = activePage === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onNavigate(item.id)}
              style={[
                styles.navItem, 
                isActive && (isDarkMode ? styles.darkNavItemActive : styles.navItemActive)
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.navIcon, 
                isActive && styles.navIconActive,
                isDarkMode && !isActive && styles.darkNavIcon
              ]}>
                {getIcon(item.icon)}
              </Text>
              <Text
                style={[
                  styles.navLabel, 
                  isActive && (isDarkMode ? styles.darkNavLabelActive : styles.navLabelActive),
                  isDarkMode && !isActive && styles.darkNavLabel
                ]}
                numberOfLines={1}
              >
                {item.id}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function getIcon(name) {
  const map = {
    grid:          '⊞',
    person:        '👤',
    book:          '📖',
    'alert-circle':'⊙',
    'trending-up': '↗',
    settings:      '⚙',
  };
  return map[name] ?? '•';
}

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  darkSidebar: {
    backgroundColor: '#1a1a1a',
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 18,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  darkLogoRow: {
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: '#3b5bdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  logoText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  darkLogoText: {
    color: '#ffffff',
  },
  nav: {
    padding: 10,
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#eef2ff',
  },
  darkNavItemActive: {
    backgroundColor: 'rgba(59, 91, 219, 0.2)',
  },
  navIcon: {
    fontSize: 14,
    opacity: 0.6,
  },
  darkNavIcon: {
    opacity: 0.8,
    color: '#aaaaaa',
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 13,
    color: '#666666',
    flex: 1,
  },
  darkNavLabel: {
    color: '#aaaaaa',
  },
  navLabelActive: {
    color: '#3b5bdb',
    fontWeight: '600',
  },
  darkNavLabelActive: {
    color: '#748ffc',
    fontWeight: '600',
  },
});
