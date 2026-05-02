import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useData } from '../DataContext';

export default function SettingsScreen() {
  const { user: loggedInUser, setUser: setLoggedInUser, isDarkMode, setIsDarkMode } = useData();
  const [notifications, setNotifications] = useState(true);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');

  const handleLogin = () => {
    if (name && rollNo) {
      setLoggedInUser(`${name} (${rollNo})`);
      setLoginModalVisible(false);
      setName('');
      setRollNo('');
      alert('Logged in successfully!');
    } else {
      alert('Please enter both name and roll number.');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <View style={styles.scroll}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSub}>Configure your dashboard preferences and account details.</Text>
        
        {/* Account Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={[styles.row, styles.lastRow]}>
            <View>
              <Text style={styles.label}>{loggedInUser ? `Logged in as ${loggedInUser}` : 'Not logged in'}</Text>
              <Text style={styles.subLabel}>{loggedInUser ? 'You have full access' : 'Login to sync your data'}</Text>
            </View>
            {loggedInUser ? (
              <TouchableOpacity style={styles.loginBtn} onPress={handleLogout}>
                <Text style={styles.loginBtnText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.loginBtn} onPress={() => setLoginModalVisible(true)}>
                <Text style={styles.loginBtnText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Enable Notifications</Text>
              <Text style={styles.subLabel}>Receive alerts for high-risk students</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} />
          </View>
          
          <View style={[styles.row, styles.lastRow]}>
            <View>
              <Text style={styles.label}>Dark Mode</Text>
              <Text style={styles.subLabel}>Toggle dark theme for the dashboard</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={() => alert('Settings saved successfully!')}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Login Modal */}
      <Modal
        visible={isLoginModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Account Login</Text>
            <Text style={styles.modalSub}>Please enter your credentials below.</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#aaaaaa"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Roll No"
              placeholderTextColor="#aaaaaa"
              value={rollNo}
              onChangeText={setRollNo}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setLoginModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleLogin}>
                <Text style={styles.submitBtnText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f7f5' },
  content: { padding: 24, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  pageSub: { fontSize: 13, color: '#888888', marginBottom: 24 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)', padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a2e', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.06)' },
  lastRow: { borderBottomWidth: 0 },
  label: { fontSize: 14, fontWeight: '500', color: '#1a1a2e' },
  subLabel: { fontSize: 12, color: '#888888', marginTop: 2 },
  saveBtn: { backgroundColor: '#3b5bdb', paddingVertical: 12, borderRadius: 8, alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 24 },
  saveBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  
  // Login Button styles
  loginBtn: { backgroundColor: '#f0f4ff', borderWidth: 1, borderColor: '#3b5bdb', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  loginBtnText: { color: '#3b5bdb', fontWeight: '600', fontSize: 13 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, backgroundColor: '#ffffff', borderRadius: 12, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  modalSub: { fontSize: 13, color: '#888888', marginBottom: 20 },
  input: { height: 44, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 8, paddingHorizontal: 14, marginBottom: 16, fontSize: 14, color: '#1a1a2e', backgroundColor: '#fdfdfd' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#f2f2f2' },
  cancelBtnText: { color: '#666666', fontWeight: '600', fontSize: 14 },
  submitBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#3b5bdb' },
  submitBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 14 }
});
