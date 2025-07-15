import React, { useState } from 'react';
import Header from './components/Header';
import TodoListItem from './components/TodoListItem';
import Footer from './components/Footer';
import './App.css'; // Make sure this is added

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

  function handleToggleTodo(id: number) {
    setTodos(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  return (
    <div className="app">
      <Header title="My Awesome To-Do List" />
      <main className="main-content">
        <div className="todo-input">
          <input
            type="text"
            value={newTodoText}
            onChange={e => setNewTodoText(e.target.value)}
            placeholder="Add a new todo"
            className="input-field"
          />
          <button onClick={handleAddTodo} className="add-button">
            Add
          </button>
        </div>
        <ul className="todo-list">
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
