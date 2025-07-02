# React Portal 详解

## Portal 是什么？

Portal（传送门）是 React 提供的一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀方案。Portal 的最常见用例是当父组件有 `overflow: hidden` 或 `z-index` 样式时，但你需要子组件能够在视觉上"跳出"其容器。例如，对话框、悬浮卡以及提示框等。

```jsx
ReactDOM.createPortal(child, container);
```

- `child`：任何可渲染的 React 子元素，比如一个元素、字符串或 fragment。
- `container`：一个 DOM 元素。

## 如何使用 Portal？

### 基本用法

1. 在 HTML 中创建一个目标容器：

```html
<div id="modal-root"></div>
```

2. 创建一个使用 Portal 的组件：

```jsx
import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};
```

3. 在应用中使用该组件：

```jsx
const App = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <h1>React Portals 示例</h1>
      <button onClick={openModal}>打开模态框</button>
      {isOpen && (
        <Modal onClose={closeModal}>这是一个使用Portal渲染的模态框！</Modal>
      )}
    </div>
  );
};
```

### 样式设置

为了使模态框正确显示，通常需要添加以下 CSS：

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
```

## 什么场景使用 Portal？

Portal 适用于以下场景：

1. **模态对话框（Modal Dialogs）**：模态框需要覆盖在整个应用之上，不受父组件的 DOM 结构和样式限制。

2. **工具提示（Tooltips）**：需要显示在特定元素附近，但不受该元素的容器限制。

3. **浮动菜单（Floating Menus）**：类似下拉菜单，需要显示在其触发元素之上，不受布局限制。

4. **通知（Notifications）**：通常显示在页面的角落，不受应用主体结构的限制。

5. **全屏覆盖层（Overlays）**：如加载指示器、引导提示等需要覆盖整个应用界面的元素。

## 为什么使用 Portal 而不是其他方案？

### Portal vs 普通组件渲染

在以下情况下，Portal 比普通组件渲染更有优势：

1. **CSS 限制问题**：

   - 普通渲染：如果父组件有 `overflow: hidden`、`position: relative` 或复杂的 `z-index` 堆叠上下文，子组件可能会被截断或被其他元素覆盖。
   - Portal：可以将内容渲染到 DOM 树中的任何位置，避免这些 CSS 限制。

2. **DOM 结构问题**：

   - 普通渲染：组件必须在 DOM 树中的特定位置渲染，这可能导致不理想的 HTML 结构。
   - Portal：允许将组件渲染到 DOM 树中的任何位置，同时保持 React 组件树中的逻辑位置。

3. **事件冒泡**：
   - 尽管 Portal 可以将内容渲染到 DOM 树中的任何位置，但其事件仍然遵循 React 组件树的结构进行冒泡，这保持了 React 的一致性。

### Portal vs 全局状态管理

在某些情况下，开发者可能会考虑使用全局状态管理（如 Redux）来控制模态框等组件：

1. **复杂度**：

   - 全局状态：需要设置额外的状态管理逻辑，增加了应用的复杂性。
   - Portal：提供了更直接、更简单的解决方案，无需额外的状态管理库。

2. **组件封装**：
   - 全局状态：模态框的控制逻辑与显示逻辑可能分散在不同位置。
   - Portal：允许将控制逻辑和显示逻辑封装在一起，提高代码的可维护性。

## 注意事项

1. **事件冒泡**：Portal 中的事件会冒泡到 React 树中的父组件，而不是 DOM 树中的父元素。

2. **服务器端渲染**：使用 Portal 时需要注意服务器端渲染的兼容性，因为服务器上可能没有对应的 DOM 节点。

3. **焦点管理**：在模态框等场景中，需要正确管理键盘焦点，确保可访问性。

4. **清理工作**：在组件卸载时，确保清理所有通过 Portal 创建的 DOM 节点，避免内存泄漏。

## 总结

React Portal 提供了一种优雅的解决方案，使组件能够"跳出"其在 DOM 中的父容器限制，同时保持在 React 组件树中的逻辑位置。这对于创建模态框、工具提示、浮动菜单等需要特定定位和样式的组件非常有用。通过 Portal，我们可以构建更灵活、更符合用户体验的界面组件。
