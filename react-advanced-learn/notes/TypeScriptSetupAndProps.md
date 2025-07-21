# TypeScript Setup and Props in React

## 什么是 TypeScript？

TypeScript 是 JavaScript 的超集，它添加了静态类型系统和其他特性，使代码更加健壮和可维护。TypeScript 由 Microsoft 开发和维护，它可以编译成标准的 JavaScript 代码，因此可以在任何支持 JavaScript 的环境中运行。

## 为什么要使用 TypeScript？

1. **类型安全** - 在编译时捕获错误，而不是在运行时
2. **更好的 IDE 支持** - 提供自动完成、智能感知和更好的代码导航
3. **更好的代码文档** - 类型本身就是一种文档形式
4. **增强的重构能力** - 在更改类型定义时，可以轻松发现受影响的代码
5. **更好的团队协作** - 对于大型团队和大型项目尤其有用

## 应用场景

1. **大型应用程序** - 随着项目规模扩大，TypeScript 的好处更为明显
2. **团队协作** - 多人协作开发时，类型定义可以明确 API 契约
3. **库开发** - 为使用者提供类型定义
4. **重构旧代码** - 逐步向大型 JavaScript 代码库引入类型安全
5. **React 应用开发** - 特别是在处理组件 props 和状态管理时

## TypeScript 在 React 中的设置

### 1. 创建新的 TypeScript React 项目

使用 Create React App:

```bash
npx create-react-app my-app --template typescript
```

使用 Vite:

```bash
npm create vite@latest my-app -- --template react-ts
```

### 2. 将现有 React 项目转换为 TypeScript

1. 安装必要的依赖:

```bash
npm install --save typescript @types/react @types/react-dom @types/node
```

2. 创建`tsconfig.json`文件:

```bash
npx tsc --init
```

3. 配置`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

4. 将`.js`和`.jsx`文件重命名为`.ts`和`.tsx`

## 在 React 中使用 TypeScript Props

在 React 中，Props 是组件间数据传递的主要方式。TypeScript 可以帮助我们定义 Props 的类型，确保数据的正确性和完整性。

### 定义 Props 类型的方法

#### 1. 使用接口 (Interface)

```tsx
interface UserCardProps {
  name: string;
  age: number;
  email?: string; // 可选属性
  role: "admin" | "user" | "guest"; // 字面量联合类型
}

const UserCard: React.FC<UserCardProps> = ({ name, age, email, role }) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
      <p>Role: {role}</p>
    </div>
  );
};
```

#### 2. 使用类型别名 (Type Alias)

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant: "primary" | "secondary" | "tertiary";
};

const Button = ({ label, onClick, disabled = false, variant }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn-${variant}`}>
      {label}
    </button>
  );
};
```

### 函数组件中的事件处理

```tsx
interface FormProps {
  onSubmit: (data: { username: string; password: string }) => void;
}

const LoginForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUsername(e.target.value)
        }
      />
      <input
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

### 泛型组件

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// 使用泛型组件
interface User {
  id: number;
  name: string;
}

const App = () => {
  const users: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];

  return <List items={users} renderItem={(user) => <div>{user.name}</div>} />;
};
```

### 完整示例：带 TypeScript 的 React 组件

```tsx
import React, { useState } from "react";

// 定义Props接口
interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Todo项组件
const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
}) => {
  return (
    <li style={{ textDecoration: completed ? "line-through" : "none" }}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <span>{text}</span>
      <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
};

// Todo应用的Props接口
interface TodoAppProps {
  initialTodos?: TodoItem[];
  title: string;
}

// Todo项的类型
interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

// Todo应用组件
const TodoApp: React.FC<TodoAppProps> = ({ initialTodos = [], title }) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newTodo, setNewTodo] = useState<string>("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    const newItem: TodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };

    setTodos([...todos, newItem]);
    setNewTodo("");
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <h1>{title}</h1>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
      <div>
        <p>Total: {todos.length}</p>
        <p>Completed: {todos.filter((todo) => todo.completed).length}</p>
        <p>Pending: {todos.filter((todo) => !todo.completed).length}</p>
      </div>
    </div>
  );
};

export default TodoApp;

// 使用示例
// <TodoApp title="My Todo List" />
```

## 总结

TypeScript 为 React 应用程序带来了类型安全和更好的开发体验。通过为 Props 定义类型，我们可以:

1. 确保组件接收正确类型的 Props
2. 提供更好的 IDE 支持和自动完成
3. 捕获潜在的错误
4. 为组件创建隐式文档

随着应用程序的增长，TypeScript 的价值会变得更加明显，尤其是在处理复杂的数据结构和组件层次结构时。
