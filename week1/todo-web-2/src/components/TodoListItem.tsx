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