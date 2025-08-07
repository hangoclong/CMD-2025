import React, { useState, useEffect } from 'react'; // MODIFICATION: Added useEffect
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// MODIFICATION: Update the Note type to match the database, including created_at
type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function NotesScreen() {
  const { session } = useAuth(); // NEW: Get user session
  const [notes, setNotes] = useState<Note[]>([]); // MODIFICATION: Initialize with empty array
  const [modalVisible, setModalVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [loading, setLoading] = useState(false); // NEW: Add a loading state

  // NEW: Function to fetch notes from the database
  const fetchNotes = async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('id, title, content, created_at') // Select all needed columns
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (data) setNotes(data);
    if (error) console.error('Error fetching notes:', error);
    setLoading(false);
  };

  // NEW: Use useEffect to fetch notes when the component loads or session changes
  useEffect(() => {
    fetchNotes();
  }, [session]);

  // MODIFICATION: Make addNote async and insert into Supabase
  const addNote = async () => {
    if (newNoteTitle.trim() === '' || !session?.user) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    const { error } = await supabase
      .from('notes')
      .insert({ title: newNoteTitle, content: newNoteContent, user_id: session.user.id });

    if (error) {
      Alert.alert('Error saving note', error.message);
    } else {
      setNewNoteTitle('');
      setNewNoteContent('');
      setModalVisible(false);
      fetchNotes(); // Re-fetch to show the new note
    }
  };

  // MODIFICATION: The delete logic is now async and separate from the confirmation alert
  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      Alert.alert('Error deleting note', error.message);
    } else {
      // Optimistic update: remove from UI immediately. fetchNotes() provides consistency.
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => deleteNote(id), style: 'destructive' },
    ]);
  };

  // NEW: Show a loading indicator while fetching data
  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteItem}>
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>{item.title}</Text>
              <Text>{item.content}</Text>
            </View>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteNote(item.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Note Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* New Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Note</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
            />
            
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Content"
              multiline
              value={newNoteContent}
              onChangeText={setNewNoteContent}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewNoteTitle('');
                  setNewNoteContent('');
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={addNote}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  noteItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noteDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});
