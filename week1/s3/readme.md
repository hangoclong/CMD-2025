# Session 3: React State & Hooks

## Agenda

1. Recap: Components & Props
2. Why our To-Do app is static
3. State vs. Props
4. Introduction to React Hooks (`useState`)
5. Handling user events
6. Live Coding: Make the To-Do app interactive
7. Practice: Add a new feature
8. Next steps: From web to mobile

---

## 1. Recap: Components & Props

- Review from [Session 2](../s2/readme.md):
  - **Components** are reusable UI blocks (functions that return JSX).
  - **Props** are data passed from parent to child (read-only, one-way).
  - Example:
    ```tsx
    <TodoListItem text="Learn React" />
    ```
  - See [`src/components/Header.tsx`](../../todo-web/src/components/Header.tsx) and [`src/components/TodoListItem.tsx`](../../todo-web/src/components/TodoListItem.tsx) for real code.

---

## 2. Why is our App Static?

- Our current app ([`todo-web`](../../todo-web/)) only displays a fixed list.
- We **can't add** new todos, **can't type** in the input, **can't mark** as complete.
- **Reason:** The app has no memory. It can't "remember" changes.

---

## 3. State vs. Props

| Feature      | Props                | State                        |
|--------------|----------------------|------------------------------|
| Purpose      | Data from parent     | Internal data                |
| Mutability   | Immutable (read-only)| Mutable (can change)         |
| Source       | Parent               | Inside the component         |
| Analogy      | Birth date           | Mood (changes over time)     |

- If a component needs to "remember" something that changes, it needs **state**.

---

## 4. The `useState` Hook

- React provides **Hooks** to use state in function components.
- Most common: `useState`
    ```tsx
    import { useState } from 'react';

    const [value, setValue] = useState(initialValue);
    ```
    - `value`: current state
    - `setValue`: function to update state

**Explanation:**  
`useState` lets you add state to your function components. You give it an initial value, and it returns the current value and a function to update it.

---

## 5. Handling Events

- Use event handlers like `onClick`, `onChange`.
    ```tsx
    function handleClick() {
      // do something
    }

    <button onClick={handleClick}>Click Me</button>
    ```

**Explanation:**  
Event handlers let you respond to user actions, such as clicks or typing. You pass a function to the event prop (like `onClick`).

---

## 6. Live Coding: Make the To-Do App Interactive

Let's upgrade [`App.tsx`](../../todo-web/src/App.tsx) step by step.

### Step 1: Manage Input State

**App.tsx**
```tsx
import React, { useState } from 'react';
import Header from './components/Header';
import TodoListItem from './components/TodoListItem';
import Footer from './components/Footer';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [newTodoText, setNewTodoText] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build a To-Do App', completed: false },
  ]);

  // Step 3: Add Item Logic
  function handleAddTodo() {
    if (newTodoText.trim() === '') return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: newTodoText,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
  }

  // Step 7: Toggle Complete
  function handleToggleTodo(id: number) {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  return (
    <div className="App">
      <Header title="My Awesome To-Do List" />
      <main>
        <input
          type="text"
          value={newTodoText}
          onChange={e => setNewTodoText(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={handleAddTodo}>Add</button>
        <ul>
          {todos.map(todo => (
            <TodoListItem
              key={todo.id}
              item={todo}
              onToggle={handleToggleTodo}
            />
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}

export default App;
```
**Explanation:**  
- `newTodoText` holds the value of the input field.  
- The input is a controlled component: its value comes from state, and every keystroke updates state with `onChange`.  
- `todos` holds the list of todo items in state.

---

### Step 2: TodoListItem Component

**src/components/TodoListItem.tsx**
```tsx
import React from 'react';
import { TodoItem } from '../App';

interface TodoListItemProps {
  item: TodoItem;
  onToggle: (id: number) => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ item, onToggle }) => {
  return (
    <li
      style={{
        textDecoration: item.completed ? 'line-through' : 'none',
        cursor: 'pointer'
      }}
      onClick={() => onToggle(item.id)}
    >
      {item.text}
    </li>
  );
};

export default TodoListItem;
```
**Explanation:**  
- Displays a single todo item.
- When clicked, calls `onToggle` with the item's id to toggle its completed status.
- Applies a line-through style if the todo is completed.

---

### Step 3: Header Component

**src/components/Header.tsx**
```tsx
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
  <header className="app-header">
    <h1>{title}</h1>
  </header>
);

export default Header;
```
**Explanation:**  
- Simple header component that displays the app title passed as a prop.

---

### Step 4: Footer Component

**src/components/Footer.tsx**
```tsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {currentYear} Ha Ngoc Long</p>
    </footer>
  );
};

export default Footer;
```
**Explanation:**  
- Footer component that shows the current year and your name.

---

## 7. Practice: Toggle Complete

**Goal:** When a user clicks a todo, toggle its `completed` status.

- See the `handleToggleTodo` function and how it is passed to `TodoListItem` above.

**Explanation:**  
- The `handleToggleTodo` function uses `.map()` to create a new array, toggling the `completed` property for the clicked todo.
- Passing this function as a prop allows each todo item to be interactive.

---

## Hints

- Use `.map()` to create a new array when updating state.
- Use spread syntax (`{ ...todo, completed: !todo.completed }`) to copy and update objects.
- Analogy: Like making a photocopy of a list, but changing just one item on the new copy.

---

## 8. Next Steps

- You now know:
    - Components & JSX ([see Session 2](../s2/readme.md))
    - Props
    - State & Hooks
- Next week: Apply these concepts to React Native for mobile apps!

---

## References

- [Session 2: Components & JSX](../s2/readme.md)
- [`todo-web` project source code](../../todo-web/)
- [React Docs: Components and Props](https://reactjs.org/docs/components-and-props.html)
- [React Docs: State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
- [React Docs: Hooks](https://reactjs.org/docs/hooks-intro.html)