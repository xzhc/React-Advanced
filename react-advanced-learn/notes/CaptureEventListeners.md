# Capture Event Listeners in React

## 什么是捕获事件监听器？

在 React（以及一般的 DOM 事件处理）中，事件传播分为三个阶段：

1. **捕获阶段**（Capture Phase）：事件从 DOM 树的顶部向下传播到目标元素
2. **目标阶段**（Target Phase）：事件到达目标元素
3. **冒泡阶段**（Bubbling Phase）：事件从目标元素向上冒泡到 DOM 树的顶部

默认情况下，React 事件处理程序在冒泡阶段执行。而捕获事件监听器则是在捕获阶段执行的事件监听器。

## 怎么使用捕获事件监听器？

在 React 中，添加捕获事件监听器只需在事件名称后添加 `Capture`：

```jsx
// 普通冒泡阶段事件监听器
<div onClick={handleClick}>...</div>

// 捕获阶段事件监听器
<div onClickCapture={handleClick}>...</div>
```

常见的捕获事件包括：

- `onClickCapture`
- `onMouseDownCapture`
- `onTouchStartCapture`
- `onFocusCapture`
- 等等...

## 为什么要使用捕获事件监听器？

捕获事件监听器提供了几个关键优势：

1. **提前拦截事件**：在事件到达目标元素之前就能处理它
2. **事件处理优先级**：确保某些事件处理逻辑优先执行
3. **实现特定的事件处理模式**：例如事件委托的特殊情况
4. **阻止事件继续传播**：在捕获阶段就可以调用 `e.stopPropagation()`，防止事件传递到目标元素

## 应用场景

1. **权限控制**：拦截用户操作，先检查权限再决定是否允许事件继续传播
2. **日志记录**：在高层组件中记录用户所有交互，而不干扰实际的事件处理
3. **模态框或弹窗控制**：确保在某些 UI 状态下，阻止特定事件到达页面其他部分
4. **事件劫持**：需要在事件到达目标之前修改或增强事件行为
5. **测量和性能监控**：捕获用户所有交互的开始时间

## 示例代码

下面是一个实际的例子，展示了捕获事件的工作原理和用法：

```jsx
import { useState } from "react";

function CaptureEventDemo() {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  // 捕获阶段处理程序
  const handleOuterCapture = (e) => {
    addLog("1. 外层元素 - 捕获阶段");
    // 如果取消注释下面这行，将阻止事件继续传播
    // e.stopPropagation();
  };

  const handleInnerCapture = (e) => {
    addLog("2. 内层元素 - 捕获阶段");
  };

  // 冒泡阶段处理程序
  const handleInnerBubble = (e) => {
    addLog("3. 内层元素 - 冒泡阶段");
  };

  const handleOuterBubble = (e) => {
    addLog("4. 外层元素 - 冒泡阶段");
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="capture-event-demo">
      <h2>点击测试区域查看事件传播顺序</h2>

      <div
        className="outer"
        onClickCapture={handleOuterCapture}
        onClick={handleOuterBubble}
      >
        外层元素
        <div
          className="inner"
          onClickCapture={handleInnerCapture}
          onClick={handleInnerBubble}
        >
          内层元素
        </div>
      </div>

      <div className="event-log">
        <h3>事件日志:</h3>
        <button onClick={clearLogs}>清除日志</button>
        <ol>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ol>
      </div>

      <div className="explanation">
        <p>事件传播顺序：</p>
        <ol>
          <li>捕获阶段：从外到内</li>
          <li>目标阶段：到达目标元素</li>
          <li>冒泡阶段：从内到外</li>
        </ol>
        <p>
          注意：如果在任何阶段调用 e.stopPropagation()，事件传播将在该点停止。
        </p>
      </div>
    </div>
  );
}

export default CaptureEventDemo;
```

这个示例创建了两个嵌套的元素，都有捕获和冒泡阶段的事件处理程序。当用户点击内层元素时，可以清楚地看到事件传播的顺序：

1. 外层元素（捕获阶段）
2. 内层元素（捕获阶段）
3. 内层元素（冒泡阶段）
4. 外层元素（冒泡阶段）

通过取消注释 `e.stopPropagation()` 行，可以观察到如何在捕获阶段就阻止事件继续传播。

## 示例代码实现解析

让我们深入解析这个示例代码的具体实现方式：

### 1. 状态管理与日志系统

```jsx
const [logs, setLogs] = useState([]);

const addLog = (message) => {
  setLogs((prevLogs) => [...prevLogs, message]);
};

const clearLogs = () => {
  setLogs([]);
};
```

这部分代码创建了一个日志系统：

- 使用 React 的 `useState` 钩子创建 `logs` 数组来存储事件触发记录
- `addLog` 函数用于将新的事件日志添加到数组
- `clearLogs` 函数用于清空所有日志

### 2. 事件处理函数

```jsx
// 捕获阶段处理程序
const handleOuterCapture = (e) => {
  addLog("1. 外层元素 - 捕获阶段");
  // 如果取消注释下面这行，将阻止事件继续传播
  // e.stopPropagation();
};

const handleInnerCapture = (e) => {
  addLog("2. 内层元素 - 捕获阶段");
};

// 冒泡阶段处理程序
const handleInnerBubble = (e) => {
  addLog("3. 内层元素 - 冒泡阶段");
};

const handleOuterBubble = (e) => {
  addLog("4. 外层元素 - 冒泡阶段");
};
```

这里定义了四个处理函数：

- 两个捕获阶段处理函数（外层和内层元素）
- 两个冒泡阶段处理函数（外层和内层元素）

每个函数都调用 `addLog` 记录事件发生时的顺序和阶段。编号（1-4）表明了事件正常传播时的预期顺序。

### 3. 组件结构和事件绑定

```jsx
<div
  className="outer"
  onClickCapture={handleOuterCapture}
  onClick={handleOuterBubble}
>
  外层元素
  <div
    className="inner"
    onClickCapture={handleInnerCapture}
    onClick={handleInnerBubble}
  >
    内层元素
  </div>
</div>
```

这里创建了两个嵌套的 `div` 元素：

- 外层元素绑定了 `onClickCapture` 和 `onClick` 两个事件处理函数
- 内层元素也同样绑定了捕获和冒泡阶段的事件处理函数
- 关键点是同一个元素可以同时有捕获和冒泡阶段的处理函数

### 4. 事件流程可视化

```jsx
<div className="event-log">
  <h3>事件日志:</h3>
  <button onClick={clearLogs}>清除日志</button>
  <ol>
    {logs.map((log, index) => (
      <li key={index}>{log}</li>
    ))}
  </ol>
</div>
```

这部分代码实时展示了事件的触发顺序：

- 使用有序列表 `<ol>` 显示每个记录的事件
- 每次事件触发时，会向日志添加新的条目
- 清除按钮允许用户重置日志以进行新的测试

### 5. 事件传播控制

在 `handleOuterCapture` 函数中，有一行被注释的代码：

```jsx
// e.stopPropagation();
```

这行代码是示例的核心部分，展示了捕获阶段的强大功能：

- 如果取消注释，调用 `e.stopPropagation()` 会在外层元素的捕获阶段就停止事件传播
- 结果是内层元素的捕获和冒泡处理函数都不会执行，因为事件被截断了
- 外层元素的冒泡阶段处理函数也不会执行
- 日志会只显示 "1. 外层元素 - 捕获阶段"，而不是所有 4 个阶段

### 6. 测试不同场景

这个示例可以通过以下方式测试不同的事件传播行为：

1. **点击内层元素**（默认情况）:

   - 日志显示: 1 → 2 → 3 → 4（完整的捕获 → 冒泡流程）

2. **取消注释 `e.stopPropagation()`**:

   - 日志只显示: 1（其他阶段被阻止）

3. **点击外层元素（但不点内层）**:
   - 日志显示: 1 → 4（只有外层元素的事件处理函数执行）

通过这些测试，用户可以直观地理解事件捕获和冒泡机制，以及如何使用 `stopPropagation()` 来控制事件流。

### 应用实例

在实际应用中，捕获事件监听器可用于实现如下功能：

1. **全局点击分析**：在应用根元素上添加捕获监听器，记录所有用户点击，而不干扰正常的点击处理。

2. **模态窗口控制**：当模态窗口打开时，可以在高层组件上使用捕获阶段事件拦截并阻止点击事件传播到模态窗口以外的元素。

3. **权限检查**：在操作前先截获用户操作，检查权限，然后决定是否允许事件继续传播到目标组件。
