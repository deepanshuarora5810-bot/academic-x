import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import { useData } from '../DataContext';

const SEMESTERS = ['Semester 1', 'Semester 2'];

/**
 * TopBar
 * Global header with search, semester picker, and import button.
 */
export default function TopBar() {
  const [search, setSearch] = useState('');
  const [semIdx, setSemIdx] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const fileInputRef = useRef(null);

  const { data, setData, user, isDarkMode } = useData();

  const cycleSemester = () =>
    setSemIdx(i => (i + 1) % SEMESTERS.length);

  const handleImportPress = () => {
    if (Platform.OS === 'web' && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Make sure backend is running.");
    }
    
    // Reset file input
    event.target.value = '';
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.topRow}>
        <TextInput
          style={[styles.search, isDarkMode && styles.darkSearch]}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => {
            if (search.trim() && data && data.ALL_STUDENTS) {
              const term = search.trim().toLowerCase();
              const found = data.ALL_STUDENTS.find(s => s.name.toLowerCase().includes(term));
              if (found) {
                setSelectedStudent(found);
              } else {
                alert(`No student found matching "${search}"`);
              }
            } else if (!data) {
              alert("Please import a dataset first.");
            }
          }}
          placeholder="Search students or subjects..."
          placeholderTextColor={isDarkMode ? "#666666" : "#aaaaaa"}
        />
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={[styles.semPicker, isDarkMode && styles.darkSemPicker]} onPress={cycleSemester}>
          <Text style={[styles.semText, isDarkMode && styles.darkSemText]}>{SEMESTERS[semIdx]}</Text>
          <Text style={styles.chevron}>⌄</Text>
        </TouchableOpacity>

        {Platform.OS === 'web' && (
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        )}

        <TouchableOpacity style={styles.importBtn} activeOpacity={0.8} onPress={handleImportPress}>
          <Text style={styles.importIcon}>↑</Text>
          <Text style={styles.importText}>Import Dataset</Text>
        </TouchableOpacity>

        {user && (
          <View style={[styles.userInfo, isDarkMode && styles.darkUserInfo]}>
            <Text style={[styles.userText, isDarkMode && styles.darkUserText]}>{user}</Text>
          </View>
        )}
      </View>

      {/* Student Details Modal */}
      <Modal
        visible={!!selectedStudent}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedStudent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            {selectedStudent && (
              <>
                <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>{selectedStudent.name}</Text>
                <Text style={[styles.modalSub, isDarkMode && styles.darkSubText]}>GPA: {selectedStudent.gpa} • Risk: {selectedStudent.risk}</Text>
                
                <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Subject Scores</Text>
                <View style={[styles.scoresContainer, isDarkMode && styles.darkScoresContainer]}>
                  {Object.entries(selectedStudent.scores || {}).map(([subject, score]) => (
                    <View key={subject} style={[styles.scoreRow, isDarkMode && styles.darkScoreRow]}>
                      <Text style={[styles.scoreSubject, isDarkMode && styles.darkText]}>{subject}</Text>
                      <Text style={[styles.scoreValue, isDarkMode && styles.darkText]}>{score}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedStudent(null)}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 12,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    marginLeft: 'auto',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  darkUserInfo: {
    backgroundColor: 'rgba(59, 91, 219, 0.1)',
  },
  userText: {
    fontSize: 13,
    color: '#3b5bdb',
    fontWeight: '600',
  },
  darkUserText: {
    color: '#748ffc',
  },
  search: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#1a1a2e',
  },
  darkSearch: {
    backgroundColor: '#2a2a2a',
    borderColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
  },
  semPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  darkSemPicker: {
    backgroundColor: '#2a2a2a',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  semText: {
    fontSize: 13,
    color: '#1a1a2e',
  },
  darkSemText: {
    color: '#ffffff',
  },
  chevron: {
    fontSize: 12,
    color: '#888888',
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#3b5bdb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  importIcon: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
  },
  importText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 400, backgroundColor: '#ffffff', borderRadius: 12, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  darkModalContent: { backgroundColor: '#2a2a2a' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a2e', marginBottom: 4 },
  modalSub: { fontSize: 14, color: '#666666', marginBottom: 20, fontWeight: '500' },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 12 },
  scoresContainer: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginBottom: 20 },
  darkScoresContainer: { backgroundColor: '#333333' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 0.5, borderBottomColor: 'rgba(0,0,0,0.05)' },
  darkScoreRow: { borderBottomColor: 'rgba(255,255,255,0.05)' },
  scoreSubject: { fontSize: 14, color: '#333333' },
  scoreValue: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  closeBtn: { backgroundColor: '#3b5bdb', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  closeBtnText: { color: '#ffffff', fontWeight: '600', fontSize: 14 },
  darkText: { color: '#ffffff' },
  darkSubText: { color: '#aaaaaa' },
});
