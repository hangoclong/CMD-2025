import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, 
  TouchableOpacity, FlatList, Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import IdeaCard from './components/IdeaCard';

// Define our data structure with TypeScript for type safety.
interface Idea {
  id: string;
  title: string;
  description: string;
  date: string;
}

const App = () => {
  // State management with the useState hook.
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Function to add a new idea to the list.
  const addIdea = () => {
    // Basic validation to ensure a title is present.
    if (newTitle.trim() === '') {
      Alert.alert('Error', 'Please enter an idea title');
      return;
    }
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      date: new Date().toLocaleDateString(),
    };
    setIdeas([newIdea, ...ideas]); // Add new idea to the top of the list.
    setNewTitle(''); // Clear input fields.
    setNewDescription('');
  };

  // Function to delete an idea.
  const deleteIdea = (id: string) => {
    Alert.alert(
      'Delete Idea',
      'Are you sure you want to delete this idea?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            setIdeas(ideas.filter(idea => idea.id !== id));
          }
        }
      ]
    );
  };

  // How to render each item in our list.
  const renderItem = ({ item }: { item: Idea }) => (
    <IdeaCard
      title={item.title}
      description={item.description}
      date={item.date}
      onDelete={() => deleteIdea(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IdeaStorm</Text>
        <Text style={styles.headerSubtitle}>Capture your creative ideas</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter idea title"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter idea description"
          value={newDescription}
          onChangeText={setNewDescription}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={addIdea}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Idea</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList is a performant way to render lists. */}
      <FlatList
        data={ideas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No ideas yet. Start adding some!</Text>}
      />
    </SafeAreaView>
  );
};

// StyleSheet.create helps optimize styles.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#2196F3', alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.8 },
  inputContainer: { padding: 20, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
  input: { backgroundColor: '#f8f9fa', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e9ecef' },
  descriptionInput: { height: 80, textAlignVertical: 'top' },
  addButton: { backgroundColor: '#2196F3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', marginLeft: 8, fontSize: 16, fontWeight: '600' },
  list: { padding: 20 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
});

export default App;
