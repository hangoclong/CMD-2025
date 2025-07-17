# Week 2, Session 6: State, Logic, and Dynamic Lists

**Objective:** To transform our static "IdeaStorm" UI into a fully interactive application by managing state, handling user input, and rendering a dynamic list of items performantly.

---

## Session Outline

1.  **Recap & Goal:** Briefly review our refactored UI from Session 5 and set the goal for today: bringing the app to life.
2.  **Core Concepts:**
    *   **Component Memory:** What is "state" and why do we need it?
    *   **The `useState` Hook:** The tool for managing state in functional components.
    *   **Dynamic Lists:** The performance pitfall of using `.map()` on mobile and the correct solution: `<FlatList>`.
3.  **Live Coding - Making it Work:**
    *   **Step 1: Adding State:** Introduce `useState` to manage our form inputs and the list of ideas.
    *   **Step 2: Implementing `FlatList`:** Replace our hard-coded list with a dynamic, performant `FlatList`.
    *   **Step 3: Adding Ideas:** Write the logic to add a new idea from the input fields to our list.
    *   **Step 4: Deleting Ideas:** Implement the logic to remove an idea when the user presses the delete button.
4.  **Final Code & Wrap-up:** Review the final, fully interactive code and summarize the key takeaways.

---

## Live Coding - Bringing "IdeaStorm" to Life

Our app looks great after the UI refactoring in Session 5. We have a clean component structure and modern components like `<Pressable>`. However, it's still just a pretty picture. It doesn't remember what we type, and the button doesn't do anything. Today, we'll add the "brain" to our app using React's state management.

### Step 1: Adding State with `useState`

First, we need to give our `App` component some memory. We need to remember:

**What is State? An Analogy**

Think of a component's `state` as its short-term memory. It's any data that can change over time and should cause the UI to re-render. React gives us a special tool called the `useState` hook to manage this memory.

Imagine `useState` gives you a box:
1.  The value currently inside the box (e.g., `newTitle`).
2.  A special function to replace what's in the box (e.g., `setNewTitle`).

When you use the special function to change the value, React knows it needs to update the screen to show the new value. This is the core of interactivity in React.
1.  The text the user is currently typing in the "title" input.
2.  The text for the "description" input.
3.  The list of all the ideas that have been added.

Let's add the `useState` hook to `App.tsx` to manage this data.

**In `App.tsx`:**

```tsx
import React, { useState } from 'react'; // 1. Import useState
import {
  StyleSheet,
  View,
  FlatList, // We will use this soon
  SafeAreaView,
  TextInput,
  Pressable,
  Text,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from './components/Header';
import IdeaCard from './components/IdeaCard';

// Define the structure of a single idea
export interface Idea {
  id: string;
  title: string;
  description: string;
}

export default function App() {
  // --- STATE --- //
  // State for the title input field
  const [newTitle, setNewTitle] = useState('');
  // State for the description input field
  const [newDescription, setNewDescription] = useState('');
  // State for the list of all ideas, typed to our Idea interface
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // ... rest of the component
```

We've also created an `Idea` interface. This is a TypeScript best practice that ensures every idea object in our state array has a consistent shape (`id`, `title`, `description`).

### Step 2: Implementing `<FlatList>`

Hard-coding list items is inflexible. We need a list that automatically updates when our `ideas` state changes. On mobile, we can't just use `.map()` like on the web because it renders every single item at once, which is terrible for performance with long lists.

The solution is **virtualization**, and React Native gives us the perfect tool for it: `<FlatList>`.

Let's replace our temporary `<IdeaCard>` with a `<FlatList>` that is connected to our `ideas` state.

**In `App.tsx`, update the JSX:**

```tsx
// ... inside the return statement of App.tsx
<SafeAreaView style={styles.container}>
  <Header />
  {/* ... inputContainer View ... */}

  <View style={styles.listContainer}>
    <FlatList
      data={ideas} // 1. The data source
      renderItem={({ item }) => ( // 2. How to render each item
        <IdeaCard
          id={item.id}
          title={item.title}
          description={item.description}
          onDelete={() => {}} // We'll wire this up next
        />
      )}
      keyExtractor={(item) => item.id} // 3. A unique key for each item
      ListEmptyComponent={<View style={styles.emptyComponent}><Text style={styles.emptyText}>No ideas yet. Add one!</Text></View>}
    />
  </View>
</SafeAreaView>
// ...
```

**Key `<FlatList>` Props:**
*   `data`: The array of data to render. We pass it our `ideas` state.
*   `renderItem`: A function that receives an object containing the `item` and returns the component to render for it. We render our `IdeaCard` here.
*   `keyExtractor`: A function that returns a unique string key for each item. React uses this for performance optimizations. The `id` is perfect for this.
*   `ListEmptyComponent`: (Optional but nice!) JSX to show when the `data` array is empty.

### Step 3: Adding New Ideas

Now, let's write the function that takes the text from our inputs, creates a new idea object, and adds it to our `ideas` array. We'll also clear the inputs after the idea is added.

**In `App.tsx`, add the `addIdea` handler:**

```tsx
// ... inside the App component, after the state declarations

const addIdea = () => {
  // Don't add an idea if the title is empty
  if (!newTitle.trim()) return;

  const newIdea: Idea = {
    id: Date.now().toString(), // NOTE: Not a truly unique ID, but fine for our example.
    title: newTitle,
    description: newDescription,
  };

  // Use the function form of setState for safe updates
  setIdeas((currentIdeas) => [...currentIdeas, newIdea]);

  // Clear the input fields
  setNewTitle('');
  setNewDescription('');
};

// ...
```

**The Golden Rule of State: Treat it as Immutable!**

This line is critical: `setIdeas((currentIdeas) => [...currentIdeas, newIdea]);`.

We are creating a **brand new** array. We use the spread syntax (`...currentIdeas`) to copy all the old items, and then we add the `newIdea` at the end. 

**Why?** React's performance is built on a simple check: has the state *variable itself* changed? If you just `push` to the existing array, the array variable in memory is still the same, so React won't see a change and won't re-render the UI. By creating a *new* array, we force React to see the change and update the screen.

Now, let's wire up our inputs and button.

**In `App.tsx`, update the input and button JSX:**

```tsx
// ... inside the inputContainer View
<View style={styles.row}>
  <TextInput
    style={styles.input}
    placeholder="Enter idea title"
    value={newTitle} // Bind value to state
    onChangeText={setNewTitle} // Update state on change
  />
  <Pressable style={styles.addButton} onPress={addIdea}> // Call addIdea on press
    <FontAwesome name="plus" size={20} color="#fff" />
  </Pressable>
</View>
<TextInput
  style={[styles.input, styles.descriptionInput]}
  placeholder="Enter idea description"
  value={newDescription} // Bind value to state
  onChangeText={setNewDescription} // Update state on change
  multiline
/>
```

### Step 4: Deleting Ideas

To delete an idea, the `IdeaCard` (the child) needs to tell the `App` component (the parent) to remove an item from its state. We do this by passing a function down as a prop.

This pattern is very common in React and is sometimes called **"prop drilling"**—where a parent component "drills" a function or data down through its children.

**In `App.tsx`, create the `deleteIdea` handler:**

```tsx
// ... inside the App component, after addIdea

const deleteIdea = (id: string) => {
  setIdeas((currentIdeas) => {
    // The .filter() method creates a new array containing only
    // the items that do NOT match the ID we want to delete.
    return currentIdeas.filter((idea) => idea.id !== id);
  });
};
```

Now, pass this function to the `IdeaCard` inside the `FlatList`'s `renderItem` prop.

**In `App.tsx`, update the `FlatList`:**

```tsx
// ...
<FlatList
  data={ideas}
  renderItem={({ item }) => (
    <IdeaCard
      id={item.id}
      title={item.title}
      description={item.description}
      onDelete={deleteIdea} // Pass the delete function as a prop
    />
  )}
  // ...
/>
// ...
```

Finally, we need to modify `IdeaCard.tsx` to receive this prop and call it when the delete button is pressed.

**In `components/IdeaCard.tsx`:**

```tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  onDelete: (id: string) => void; // 1. Expect an onDelete prop
}

export default function IdeaCard({ id, title, description, onDelete }: IdeaCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <Pressable onPress={() => onDelete(id)} style={styles.deleteButton}> // 2. Call onDelete with the card's own id
        <FontAwesome name="trash" size={24} color="#c91e1e" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deleteButton: {
    marginLeft: 16,
    padding: 8,
  },
});
```

And that's it! You now have a fully functional, interactive app.

---

## Final Code

Here is the complete, fully functional code for `App.tsx` that combines the refactored UI from Session 5 with the state logic from this session.

<details>
<summary>Click to see the final App.tsx code</summary>

```tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, 
  Pressable, FlatList, Alert, Platform, KeyboardAvoidingView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Header from './components/Header';
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
```

---

## Session Recap

Congratulations! You have successfully transformed a static UI into a dynamic, interactive application. You learned some of the most fundamental concepts in React:

*   **State Management:** How to use the `useState` hook to give your components memory.
*   **Immutable Updates:** The critical importance of creating *new* arrays/objects when updating state, rather than modifying them directly.
*   **Performant Lists:** Why `<FlatList>` is the correct choice for rendering lists on mobile and how to use its core props (`data`, `renderItem`, `keyExtractor`).
*   **Child-to-Parent Communication:** How to pass functions down as props to allow child components to trigger state changes in their parents.

In the next session, we will explore how to navigate between multiple screens, a core feature of any real-world application.