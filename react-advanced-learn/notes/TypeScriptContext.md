# TypeScript 与 React Context

## 什么是 React Context？

React Context 是 React 提供的一种在组件之间共享数据的方式，而无需在每个层级手动传递 props。它解决了 "prop drilling"（属性逐层传递）的问题，使得在深层嵌套的组件中访问全局数据变得更加容易。

在 TypeScript 中使用 Context API 可以增强类型安全性，确保我们消费的数据和提供的类型一致。

## 如何使用 Context？

使用 Context 主要涉及三个步骤：

1. **创建 Context**：使用 `React.createContext()` 创建一个 Context 对象。
2. **提供 Context**：使用 `<Context.Provider>` 组件将值提供给其所有子组件。
3. **消费 Context**：在子组件中使用 `useContext()` Hook 来读取 Context 的值。

## 为什么要用 Context？

- **避免 Prop Drilling**：当一个 props 需要穿过很多层组件才能到达目标组件时，代码会变得冗长且难以维护。Context 可以让目标组件直接访问这个 props，而不需要中间组件的参与。
- **全局状态管理**：对于一些全局性的数据，如主题、用户认证信息、语言偏好等，使用 Context 可以很方便地在整个应用中共享。
- **解耦组件**：让组件不直接依赖于其父组件的 props 结构，提高了组件的复用性。

## 应用场景

- **主题切换**：在整个应用中共享和切换主题（如暗黑模式/明亮模式）。
- **用户认证**：传递当前登录用户的信息和认证状态。
- **多语言支持**：管理和提供当前的语言设置。
- **应用配置**：共享不经常变化的配置信息。
- **与 `useReducer` 结合**：作为一种轻量级的全局状态管理方案，替代 Redux。

## 在 TypeScript 中使用 Context

在 TypeScript 中使用 Context API 时，我们需要为 Context 的值定义一个类型，以确保类型安全。

### 示例：主题切换

下面是一个使用 TypeScript 和 Context 实现主题切换的完整示例：

**1. 定义 Context 类型并创建 Context**

首先，我们创建一个文件来定义我们的主题 Context。

`src/contexts/ThemeContext.tsx`

```typescript
import React, { createContext, useContext, useState, ReactNode } from "react";

// 1. 定义 Context 值的类型
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

// 2. 创建 Context，并提供一个默认值
// 注意：默认值只在没有 Provider 的情况下使用，通常可以设为 undefined 或 null，
// 但在使用时需要进行检查。一个更好的做法是提供一个有意义的默认值。
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. 创建一个自定义 Provider 组件
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. 创建一个自定义 Hook，以便更方便地使用 Context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
```

**2. 在应用顶层使用 Provider**

在你的应用入口文件（如 `App.tsx` 或 `main.tsx`）中，用 `ThemeProvider` 包裹你的组件树。

`src/App.tsx`

```typescript
import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import Toolbar from "./components/Toolbar";
import "./App.css";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Content />
    </ThemeProvider>
  );
};

const Content: React.FC = () => {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Toolbar />
      <p>This is an example of using React Context with TypeScript.</p>
    </div>
  );
};

export default App;
```

**3. 在子组件中消费 Context**

现在，任何在 `ThemeProvider` 内部的组件都可以通过 `useTheme` Hook 来访问主题状态和切换函数。

`src/components/Toolbar.tsx`

```typescript
import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const Toolbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const style = {
    background: theme === "light" ? "#FFF" : "#333",
    color: theme === "light" ? "#000" : "#FFF",
    padding: "1rem",
    borderRadius: "8px",
    border: "1px solid #CCC",
  };

  return (
    <div style={style}>
      <p>Current Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

export default Toolbar;
```

## 最佳实践

1. **创建自定义 Hook**：为你的 Context 创建一个自定义 Hook（如 `useTheme`），这可以隐藏 `useContext` 的实现细节，并且可以在找不到 Provider 时抛出错误，提高代码的健壮性。
2. **提供有意义的默认值**：尽量为 `createContext` 提供一个有意义的默认值。如果不能，就在自定义 Hook 中检查 `undefined`。
3. **组件组合优于 Context**：如果只是为了避免一层 prop drilling，优先考虑使用组件组合。Context 更适合用于传递“全局”数据。
4. **性能考量**：当 Context 的值发生变化时，所有消费该 Context 的组件都会重新渲染。如果性能成为问题，可以考虑将 Context 拆分，或者使用 `React.memo` 来优化子组件。

## 总结

React Context 是一个用于跨组件共享状态的强大工具，特别是在处理全局数据时。与 TypeScript 结合使用，可以构建出类型安全、可维护性高的 React 应用。通过遵循最佳实践，你可以有效地利用 Context 来简化你的状态管理逻辑。
