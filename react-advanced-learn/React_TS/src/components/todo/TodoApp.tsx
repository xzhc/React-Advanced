import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { TodoItem } from "./TodoItem";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoAppProps {
  initialTodos?: TodoItem[];
  title: string;
}

export const TodoApp: FC<TodoAppProps> = ({ initialTodos = [], title }) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  const [newTodo, setNewTodo] = useState<string>("");

  const handleAddTodo = (e: FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") {
      return;
    }
    const newItem: TodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, newItem]);
    setNewTodo("");
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h1>{title}</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewTodo(e.target.value)
          }
          placeholder="Add a new todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            completed={todo.completed}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>

      <div>
        <p>Total todos: {todos.length}</p>
        <p>Completed todos: {todos.filter((todo) => todo.completed).length}</p>
        <p>
          Incomplete todos: {todos.filter((todo) => !todo.completed).length}
        </p>
      </div>
    </div>
  );
};
