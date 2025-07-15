# Week 2, Session 5: Live Coding - Refactoring Our UI

## Objectives

*   Understand the benefits of the modern `<Pressable>` component.
*   Use advanced Flexbox layouts to create more complex UI structures.
*   Refactor UI into reusable components for better code organization.

---

## Starting Point: Our Completed App

Welcome back! We'll start this session with the fully functional `IdeaStorm` app from Session 4. Our goal today is to refactor and improve our UI code, applying a deeper understanding of styling and component structure.

### Step 1: Upgrade to `<Pressable>`

The `<TouchableOpacity>` component has served us well, but React Native now recommends using the more flexible `<Pressable>` component for all new touch interactions. Let's upgrade our button.

First, add `Pressable` to your import list from `react-native`:

```tsx
// App.tsx - imports
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, 
  Pressable, FlatList, Alert // <-- Replace TouchableOpacity with Pressable
} from 'react-native';
```

Next, find the `<TouchableOpacity>` in your JSX and change it to a `<Pressable>`:

```tsx
// App.tsx - JSX
<Pressable style={styles.addButton} onPress={addIdea}>
  <FontAwesome name="plus" size={20} color="#fff" />
  <Text style={styles.buttonText}>Add Idea</Text>
</Pressable>
```

Functionally, the app will behave identically, but we are now using the modern, recommended component.

### Step 2: A More Compact Input Form

Our current input form is very tall. Let's use Flexbox to make it more compact. We'll place the title input and the button on the same line, and keep the description input below them.

First, let's wrap the title input and the button in a new `<View>`.

```tsx
// App.tsx - inside the inputContainer View
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
// The old button is now inside the new View above
```

Notice we removed the text from the button to make it smaller.

Now, let's add the new styles to our `StyleSheet` and adjust the existing ones. This is where the Flexbox magic happens!

```tsx
// App.tsx - StyleSheet
const styles = StyleSheet.create({
  // ... (keep existing styles like container, header, etc.)
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputContainer: { padding: 20, backgroundColor: '#fff' }, // Simplified
  input: {
    flex: 1, // <-- Add this to make the input take up available space
    backgroundColor: '#f8f9fa', 
    borderRadius: 8, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#e9ecef'
  },
  descriptionInput: { 
    height: 80, 
    textAlignVertical: 'top', 
    marginTop: 10, // Add some space above
  },
  addButton: { 
    backgroundColor: '#2196F3', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    borderRadius: 8,
    marginLeft: 10, // Add space to the left of the button
  },
  // ... (keep other styles)
});
```

### Step 3: Extracting a `Header` Component

Our `App.tsx` is getting crowded. A great way to clean it up is to extract parts of the UI into their own components. Let's create a dedicated `Header` component.

**1. Create the new file:** `components/Header.tsx`

```tsx
// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>IdeaStorm</Text>
      <Text style={styles.headerSubtitle}>Capture your creative ideas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    padding: 20, 
    backgroundColor: '#2196F3', 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  headerSubtitle: { 
    fontSize: 16, 
    color: '#fff', 
    opacity: 0.8 
  },
});

export default Header;
```

**2. Use the new component in `App.tsx`**

Now, we can simplify `App.tsx`. Import the new `Header` component and replace the old header `View` with it. You can also remove the now-unused header styles from `App.tsx`'s stylesheet.

```tsx
// App.tsx
// ... other imports
import Header from './components/Header'; // <-- Import the new component

// ...

  return (
    <SafeAreaView style={styles.container}>
      <Header /> // <-- Use the new component
      {/* ... rest of the JSX ... */}
    </SafeAreaView>
  );
// ...

// In the StyleSheet, you can now delete header, headerTitle, and headerSubtitle.
```

---

## Final Code for Session 5

After our refactoring, your `App.tsx` should look much cleaner. This is a much more scalable and maintainable way to build apps.

<details>
<summary>Click to see the final App.tsx code</summary>

```tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, 
  Pressable, FlatList, Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import IdeaCard from './components/IdeaCard';
import Header from './components/Header';

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
    setIdeas([newIdea, ...ideas]);
    setNewTitle('');
    setNewDescription('');
  };

  const deleteIdea = (id: string) => {
    Alert.alert('Delete Idea', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setIdeas(ideas.filter(idea => idea.id !== id)) }
    ]);
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
      <Header />
      <View style={styles.inputContainer}>
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
      </View>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  inputContainer: { padding: 20, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, backgroundColor: '#f8f9fa', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#e9ecef' },
  descriptionInput: { height: 80, textAlignVertical: 'top', marginTop: 10 },
  addButton: { backgroundColor: '#2196F3', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginLeft: 10 },
  list: { paddingHorizontal: 20 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
});

export default App;
```

</details>