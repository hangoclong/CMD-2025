# Week 2, Session 5: Live Coding - Refactoring Our UI

## Objectives

*   Understand the benefits of the modern `<Pressable>` component.
*   Use advanced Flexbox layouts to create more complex UI structures.
*   Refactor UI into reusable components for better code organization.

---

## Starting Point: Our Completed App

Welcome back! We'll start this session with your fully functional `IdeaStorm` app. It already handles adding and deleting ideas, which is fantastic. Our goal today is to refactor and improve the UI code, applying a deeper understanding of styling and component structure to make it more robust and maintainable.

### Step 1: Upgrade to `<Pressable>`

The `<TouchableOpacity>` component has served us well, but React Native now recommends using the more flexible `<Pressable>` component. Let's upgrade our button.

**Why `<Pressable>`?**

While both components make views respond to touches, `<Pressable>` is the modern standard. It gives you more feedback options. For example, you can easily change the style of a component when it's being pressed, hovered, or focused. This makes creating visually responsive buttons much easier.

First, add `Pressable` to your import list from `react-native`:

```tsx
// App.tsx - imports
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  Pressable, // <-- Add Pressable
  Alert,
  FlatList, 
  TouchableOpacity // <-- This will be removed
} from 'react-native';
```

Next, find the `<TouchableOpacity>` in your JSX and change it to a `<Pressable>`. We will also need to adjust the styles slightly, as `<Pressable>` doesn't need a separate text style for the button label.

```tsx
// App.tsx - JSX
<Pressable style={styles.addButton} onPress={addIdea}>
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

Notice we removed the text from the button and replaced it with a `FontAwesome` icon to make it smaller and more modern. You'll need to import `FontAwesome`:

```tsx
// App.tsx - imports
import { FontAwesome } from '@expo/vector-icons';
```

Now, let's add the new styles to our `StyleSheet` and adjust the existing ones. This is where the Flexbox magic happens!

Let's break down the key styles for our new `row`:
*   `flexDirection: 'row'`: This arranges children horizontally instead of the default vertical stacking.
*   `alignItems: 'center'`: This vertically aligns the items in the middle of the row. (Imagine a horizontal line cutting through the center of the input and the button).
*   `justifyContent: 'space-between'`: This distributes the items along the row. In our case, with two items, it pushes the first item to the far left and the second item to the far right.

And for the `input`:
*   `flex: 1`: This is a powerful property! It tells the `TextInput` to grow and take up all the available free space in the row. Since the button has a fixed size, the input will expand to fill the rest of the line.

```tsx
// App.tsx - StyleSheet
const styles = StyleSheet.create({
  // ... (keep existing styles like container, etc.)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputContainer: { 
    padding: 20, 
    backgroundColor: '#fff', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2 
  },
  input: {
    flex: 1, // <-- This makes the input take up available space
    backgroundColor: '#f8f9fa', 
    borderRadius: 8, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#e9ecef'
  },
  descriptionInput: { 
    height: 80, 
    textAlignVertical: 'top',
    // The `row`'s `marginBottom` will create space, so we can remove the `marginTop` here if we had one.
  },
  addButton: { 
    backgroundColor: '#2196F3', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    borderRadius: 8,
    marginLeft: 10, // Add space to the left of the button
  },
  buttonText: { // We can now remove the old buttonText style if we want, but we'll keep it for now.
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
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

// Pro-Tip: Add KeyboardAvoidingView
// A common problem on mobile is the keyboard covering the input fields. We can fix this easily with KeyboardAvoidingView.
// Let's wrap our main view in it to complete our refactoring.

// 1. Import Platform and KeyboardAvoidingView from 'react-native'

// 2. Wrap your content inside the <SafeAreaView>

<KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
  style={{ flex: 1 }}
>
  <Header />
  {/* ... rest of your components ... */}
</KeyboardAvoidingView>
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
  Pressable, FlatList, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from './components/Header'; // Assuming it's created
import IdeaCard from './components/IdeaCard';

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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  inputContainer: { 
    padding: 20, 
    backgroundColor: '#fff', 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 2 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 8, 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#e9ecef' 
  },
  descriptionInput: { 
    height: 80, 
    textAlignVertical: 'top' 
  },
  addButton: { 
    backgroundColor: '#2196F3', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    borderRadius: 8,
    marginLeft: 10
  },
  list: { flex: 1, paddingHorizontal: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#666' }
});

export default App;
```

```tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, 
  Pressable, FlatList, Alert, Platform, KeyboardAvoidingView
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
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
      </KeyboardAvoidingView>
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