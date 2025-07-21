# TypeScript useReducer

## 什么是 useReducer？

`useReducer` 是 React 的一个内置 Hook，它是 `useState` 的替代方案，用于管理复杂的状态逻辑。当组件的状态逻辑变得复杂，包含多个子值或者下一个状态依赖于之前的状态时，`useReducer` 通常会比 `useState` 更适用。

在 TypeScript 中使用 `useReducer` 可以提供额外的类型安全，确保 action 和 state 的类型一致性。

## 基本语法

```typescript
const [state, dispatch] = useReducer(reducer, initialState, init);
```

参数说明：

- `reducer`: 一个函数，接收当前状态和 action，返回新状态
- `initialState`: 初始状态
- `init`: 可选的初始化函数，用于惰性初始化状态

## 为什么要用 useReducer？

1. **管理复杂状态逻辑**：当状态包含多个子值或者更新逻辑比较复杂时
2. **状态依赖于之前的状态**：当下一个状态依赖于之前的状态时
3. **提高可测试性**：reducer 函数是纯函数，更容易进行单元测试
4. **状态更新更加可预测**：所有状态更新都通过 dispatch action 触发，使状态变化更清晰
5. **更好的性能优化**：可以避免创建回调函数的问题

## 应用场景

- **表单管理**：处理包含多个字段的表单
- **复杂状态转换**：状态有明确的状态转换规则
- **全局状态管理**：作为简化版的 Redux 在小型应用中使用
- **复杂数据结构**：管理嵌套对象或数组等复杂数据结构
- **多个相关状态值**：处理多个相互关联的状态变量

## 在 TypeScript 中使用 useReducer

在 TypeScript 中使用 `useReducer` 时，我们需要定义：

1. State 的类型
2. Action 的类型
3. Reducer 函数的类型

### 基本示例

下面是一个使用 TypeScript 的 `useReducer` 基本示例：

```typescript
import React, { useReducer } from "react";

// 定义 State 类型
interface State {
  count: number;
}

// 定义 Action 类型
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset"; payload: number };

// 定义 reducer 函数
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: action.payload };
    default:
      return state;
  }
}

const Counter: React.FC = () => {
  // 初始化 state 和 dispatch
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset", payload: 0 })}>
        Reset
      </button>
    </div>
  );
};

export default Counter;
```

### 更复杂的示例：TodoList

下面是一个更复杂的 TodoList 示例：

```typescript
import React, { useReducer, useState } from "react";

// 定义 Todo 项类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 定义 State 类型
interface State {
  todos: Todo[];
  nextId: number;
}

// 定义 Action 类型
type Action =
  | { type: "add"; payload: string }
  | { type: "toggle"; payload: number }
  | { type: "delete"; payload: number }
  | { type: "clear_completed" };

// 定义 reducer 函数
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: state.nextId, text: action.payload, completed: false },
        ],
        nextId: state.nextId + 1,
      };
    case "toggle":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "delete":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case "clear_completed":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
    default:
      return state;
  }
}

const TodoApp: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, { todos: [], nextId: 1 });
  const [input, setInput] = useState("");

  const handleAddTodo = () => {
    if (input.trim()) {
      dispatch({ type: "add", payload: input.trim() });
      setInput("");
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={handleAddTodo}>Add</button>
        <button onClick={() => dispatch({ type: "clear_completed" })}>
          Clear Completed
        </button>
      </div>
      <ul>
        {state.todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
              onClick={() => dispatch({ type: "toggle", payload: todo.id })}
            >
              {todo.text}
            </span>
            <button
              onClick={() => dispatch({ type: "delete", payload: todo.id })}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
```

## 使用 useReducer 的最佳实践

1. **为复杂状态使用 useReducer**：当状态逻辑复杂或状态值相互关联时
2. **定义明确的 Action 类型**：使用 TypeScript 联合类型定义清晰的 Action
3. **确保 Reducer 函数是纯函数**：避免在 reducer 中产生副作用
4. **提取 Reducer 函数**：将 reducer 函数从组件中提取出来，便于测试和复用
5. **使用上下文（Context）与 useReducer 结合**：在多层组件中共享状态

## 与 useState 的比较

| 特性       | useState             | useReducer               |
| ---------- | -------------------- | ------------------------ |
| 复杂度     | 适合简单状态         | 适合复杂状态逻辑         |
| 代码量     | 代码较少             | 需要更多样板代码         |
| 可测试性   | 较难单独测试         | 更容易测试（纯函数）     |
| 状态预测性 | 状态更新分散         | 集中管理状态更新         |
| 性能优化   | 可能需要 useCallback | 不需要为每个事件创建回调 |
| 调试       | 较难追踪状态变化     | 更容易追踪状态变化       |

## 总结

`useReducer` 是 React 中处理复杂状态逻辑的强大工具。在 TypeScript 中使用 `useReducer` 可以提供额外的类型安全，确保 action 和 state 的类型一致性。当你的组件状态逻辑变得复杂，或者当你需要更可预测的状态管理方式时，`useReducer` 是一个很好的选择。通过将状态逻辑从组件中分离出来，它还可以提高代码的可测试性和可维护性。
