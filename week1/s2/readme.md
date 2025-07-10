# Session 2: React Fundamentals — Components & JSX

## 1. Overview

This session introduces the core building blocks of React: **components** and **JSX**. You will learn how to create reusable UI pieces, pass data via props, and compose a simple static application UI.

---

## 2. Key Concepts

### What is React?
- **React** is a JavaScript **library** for building user interfaces.
- It is **declarative**: you describe what you want, React handles how to update the UI.
- **Component-based**: build complex UIs by composing small, reusable pieces.

### The Virtual DOM
- React uses a **Virtual DOM** (VDOM), a lightweight copy of the real DOM.
- When state/data changes, React "diffs" the new VDOM with the old one and updates only what's necessary in the real DOM.
- This makes React fast and efficient.

### JSX (JavaScript XML)
- **JSX** lets you write HTML-like markup in your JavaScript files.
- JSX is not HTML; it compiles to JavaScript function calls.
- Example:
    ```jsx
    // Without JSX
    React.createElement('h1', { className: 'greeting' }, 'Hello, world!');

    // With JSX
    <h1 className="greeting">Hello, world!</h1>
    ```

#### JSX vs HTML Differences

| Feature         | HTML                   | JSX                        | Reason                        |
|-----------------|------------------------|----------------------------|-------------------------------|
| CSS Class       | `class="..."`          | `className="..."`          | `class` is reserved in JS     |
| Event Handlers  | `onclick="..."`        | `onClick={myFunc}`         | camelCase in JSX              |
| Self-closing    | `<img>`                | `<img />`                  | All tags must be closed       |
| Comments        | `<!-- ... -->`         | `{/* ... */}`              | JS-style comments             |

---

## 3. Components & Props

### Functional Components

- A **component** is a function that returns JSX.
- Must start with a capital letter.
- Accepts a single argument: `props` (an object).

Example:
```jsx
function Header(props) {
  return <h1>{props.title}</h1>;
}
```

### Props (Properties)

- **Props** are how data is passed from parent to child.
- Props are **read-only**.
- Data flows **one way**: parent → child.

Example:
```jsx
// Parent
<Header title="My App" />

// Child
function Header(props) {
  return <h1>{props.title}</h1>;
}
```

### Typing Props with TypeScript

```tsx
interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
  <header>
    <h1>{title}</h1>
  </header>
);
```

---

## 4. Practice: Building a Static To-Do List UI

---

## Before You Start: Basic Command Line Navigation

You'll use the terminal (command line) to create and run your React project. Here are some basic commands and examples:

**macOS / Linux (zsh or bash):**
```bash
# Show current folder (prints the full path)
pwd

# List files and folders in the current directory
ls

# Change into a folder named "my-folder"
cd my-folder

# Change into a nested folder (for example: repos/my-folder)
cd repos/my-folder

# Go up one directory
cd ..

# Go up two directories
cd ../..
```

**Windows CMD:**
```cmd
:: Show current folder (prints the full path)
cd

:: List files and folders in the current directory
dir

:: Change into a folder named "my-folder"
cd my-folder

:: Change into a nested folder (for example: repos\my-folder)
cd repos\my-folder

:: Go up one directory
cd ..

:: Go up two directories
cd ..\..
```

**Tip:**  
- Use `ls` (macOS/Linux) or `dir` (Windows) to see available folders before using `cd`.
- Use `cd` to move into your project folder before running commands like `npm start`.

---


### Step 1: Project Setup

```bash
npx create-react-app todo-web --template typescript
```

**Explanation:**  
- This command creates a new React project called `todo-web` using TypeScript.
- It sets up all the files and folders you need to start building your app.
- After running this, you’ll have a `src/` folder for your code and an `App.tsx` file as the main component.

---

### Step 2: Create a Header Component

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
- This code creates a reusable Header component.
- The `HeaderProps` interface defines that the component expects a `title` prop (a string).
- The component displays the title inside an `<h1>` tag.
- `export default Header;` lets you use this component in other files.

---

### Step 3: Create a TodoListItem Component

**src/components/TodoListItem.tsx**
```tsx
import React from 'react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoListItemProps {
  item: TodoItem;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ item }) => (
  <li>
    <span>{item.text}</span>
  </li>
);

export default TodoListItem;
```

**Explanation:**  
- This code defines a TodoListItem component to show a single to-do item.
- The `TodoItem` interface describes the shape of a to-do (id, text, completed).
- The component receives an `item` prop and displays its `text` inside a list item (`<li>`).
- You can reuse this component for each to-do in your list.

---

### Step 4: Compose in App.tsx

**src/App.tsx**
```tsx
import React from 'react';
import Header from './components/Header';
import TodoListItem from './components/TodoListItem';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const mockTodos: TodoItem[] = [
  { id: 1, text: 'Learn React', completed: true },
  { id: 2, text: 'Build a Component', completed: false },
  { id: 3, text: 'Understand Props', completed: false },
];

function App() {
  return (
    <div className="App">
      <Header title="My Awesome To-Do List" />
      <main>
        <ul>
          {mockTodos.map(todo => (
            <TodoListItem key={todo.id} item={todo} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
```

**Explanation:**  
- This is your main app component.
- It imports and uses the `Header` and `TodoListItem` components you created.
- `mockTodos` is a sample list of to-dos.
- The app displays the header and a list of to-dos by mapping over `mockTodos` and rendering a `TodoListItem` for each one.

---

### Step 5: Add a Footer Component

1. Create `src/components/Footer.tsx`:
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
- This code creates a Footer component that shows the current year and your name.
- `new Date().getFullYear()` gets the current year automatically.
- The footer is displayed at the bottom of your app.

2. Import and use `<Footer />` at the bottom of your `App.tsx`:
    ```tsx
    import Footer from './components/Footer';

    // ...inside App component
    <Footer />
    ```

**Explanation:**  
- Import the Footer component into your main app file.
- Add `<Footer />` inside your main component’s JSX to display it on the page.

3. Run your app to see the Footer in action:

    ```bash
    cd todo-web

    npm start
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

**Explanation:**  
- `npm start` runs your React app locally.
- Open the provided URL in your browser to see your to-do list with the header, list items,