import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  Pressable,
  Alert,
  FlatList, 
  TouchableOpacity,
  Platform
} from 'react-native';
import IdeaCard from './components/IdeaCard';
import { FontAwesome } from '@expo/vector-icons';
import Header from './components/Header'; 
import { KeyboardAvoidingView } from 'react-native';


// Define the Idea data structure
interface Idea {
  id: string;
  title: string;
  description: string;
  date: string;
}

const App = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const addIdea = () => {
    if (newTitle.trim() === '') return; // Basic validation
    const newIdea: Idea = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      date: new Date().toLocaleDateString(),
    };
    setIdeas([newIdea, ...ideas]);
    setNewTitle('');
    setNewDescription('');
  };

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
      <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={{ flex: 1 }}
        >
        <Header />
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>IdeaStorm</Text>
          <Text style={styles.headerSubtitle}>Capture your creative ideas</Text>
        </View> */}

        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder="Enter idea title"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <Pressable style={styles.addButton} onPress={addIdea}>
            <FontAwesome name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter idea description"
          value={newDescription}
          onChangeText={setNewDescription}
          multiline
        />

        <View style={{ height: 10 }} />


        <Text style={{ padding: 20, fontSize: 18, fontWeight: 'bold' }}>Your Ideas</Text>
        <View style={{ height: 1, backgroundColor: '#ccc' }} />
        <View style={{ height: 10 }} />

        <FlatList
          data={ideas}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No ideas yet. Start adding some!</Text>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e1a6a6ff' },
  //header: { padding: 20, backgroundColor: '#2196F3', alignItems: 'center' },
  //headerTitle: { fontSize: 38, fontWeight: 'bold', color: '#fff' },
  //headerSubtitle: { fontSize: 20, color: '#fff', opacity: 0.8 },
  row: { flexDirection: 'row', alignItems: 'center',  marginBottom:10 },
  input: { flex: 1, backgroundColor: '#f8f9fa', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e9ecef' },
  descriptionInput: { height: 80, textAlignVertical: 'top' },
  addButton: { backgroundColor: '#2196F3', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginLeft: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  list: { flex: 1 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' }
});

export default App;