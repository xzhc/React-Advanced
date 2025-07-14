# CSS Modules

CSS Modules 是一种在前端应用中处理 CSS 的方式，它将 CSS 文件中的类名和选择器局部化，避免了全局命名冲突。

## 什么是 CSS Modules？

CSS Modules 是一个通过构建工具（如 webpack、Vite）处理 CSS 的系统，它会将 CSS 类名自动转换为唯一标识符，从而实现 CSS 的局部作用域。当你导入 CSS Module 时，它返回的是一个包含所有已映射类名的对象。

CSS Modules 的主要特点：

- **局部作用域**：默认情况下，所有类名都是局部的，不会污染全局命名空间
- **显式全局定义**：可以通过特定语法定义全局类名
- **组合功能**：可以组合多个类或从其他 CSS Modules 中组合
- **依赖管理**：可以依赖其他 CSS Modules

## 为什么要使用 CSS Modules？

### 主要优点

1. **避免样式冲突**：每个组件的样式都是隔离的，不会影响其他组件
2. **提高可维护性**：样式与组件紧密耦合，更易于追踪和维护
3. **提高可重用性**：可以安全地重用类名，不必担心命名冲突
4. **显式依赖**：组件明确依赖于其样式文件
5. **无需复杂的命名约定**：不需要使用 BEM 或其他命名规范来避免冲突

### 应用场景

- **中大型 React/Vue 项目**：当项目规模增长时，样式隔离变得更加重要
- **组件库开发**：确保组件样式不会与用户已有的样式冲突
- **多人协作项目**：不同开发者可以独立开发组件，而不必担心样式冲突
- **模块化设计系统**：更好地将设计系统分解为独立的可重用部分

## 如何使用 CSS Modules

### 在 React 项目中使用（Vite/Create React App）

1. 创建一个以 `.module.css` 结尾的 CSS 文件，例如 `Button.module.css`
2. 在该文件中定义你的样式
3. 在组件中导入这个 CSS 文件并使用导入的类名

### 示例代码

**Button.module.css**:

```css
.button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.primary {
  background-color: #3498db;
}

.secondary {
  background-color: #2ecc71;
}

.danger {
  background-color: #e74c3c;
}
```

**Button.jsx**:

```jsx
import React from "react";
import styles from "./Button.module.css";

function Button({ children, variant = "primary", ...props }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
```

**App.jsx**:

```jsx
import React from "react";
import Button from "./Button";

function App() {
  return (
    <div>
      <Button>默认按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="danger">危险按钮</Button>
    </div>
  );
}

export default App;
```

## 高级用法

### 组合类名

可以使用 `composes` 关键字组合多个类：

```css
.baseButton {
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

.primary {
  composes: baseButton;
  background-color: blue;
  color: white;
}
```

### 全局类名

可以使用 `:global` 语法定义全局类名：

```css
:global(.globalButton) {
  background-color: purple;
}
```

### 与 CSS-in-JS 库的比较

相比于 Styled Components 或 Emotion 等 CSS-in-JS 方案：

- CSS Modules 没有运行时开销
- 可以使用所有标准 CSS 功能
- 有更好的开发工具支持（如 CSS 验证）
- 样式与逻辑更加分离

## 结语

CSS Modules 提供了一种简单而有效的方式来解决 CSS 的全局命名空间问题，特别适合于 React 等组件化框架。它不需要学习新的语法，只是在构建过程中添加了一层转换，使 CSS 更适合于组件化开发。
