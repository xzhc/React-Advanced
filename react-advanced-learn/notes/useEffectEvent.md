# useEffectEvent

## 介绍

`useEffectEvent` 是 React 18 中引入的一个新 Hook，用于解决 React 副作用（Effects）中的一个常见问题：如何在 useEffect 依赖项中排除特定值，而不破坏响应式。它允许你在 Effect 中读取最新的 props 和 state，而不需要将它们添加到依赖数组中，从而避免不必要的 Effect 重新执行。

简单来说，`useEffectEvent` 是一种特殊的 "非响应式" 函数，可以在响应式上下文中使用非响应式的数据。

> **注意**：截至 React 18.3，`useEffectEvent` 已从实验阶段毕业，正式名称为 `useEvent`，但其功能保持不变。

## 如何使用

`useEffectEvent` 的基本语法如下：

```javascript
const eventHandler = useEffectEvent(callback);
```

然后在 `useEffect` 内部调用该 handler：

```javascript
useEffect(
  () => {
    // 可以安全地调用 eventHandler，而不需要将其依赖添加到依赖数组
    eventHandler();

    // 其他副作用代码...
  },
  [
    /* 仅包含真正需要触发重新执行的依赖 */
  ]
);
```

## 为什么使用 useEffectEvent

React 的 `useEffect` Hook 要求你在依赖数组中包含所有在 Effect 内部使用的响应式值（props、state 等）。这确保了当这些值变化时，Effect 会重新执行。

然而，这导致了一个常见问题：有时你只想在某些依赖变化时重新执行 Effect，而其他值变化时不需要重新执行，尽管你在 Effect 中使用了这些值。

传统的解决方案包括：

1. 使用 `useRef` 来存储值（不优雅且容易出错）
2. 使用闭包来捕获值（可能导致过时的值）
3. 重构代码以避免问题（有时候很复杂）

`useEffectEvent` 解决了这个问题，它让你可以定义一个非响应式的事件处理函数，该函数可以访问最新的 props 和 state，而不需要将它们添加到依赖数组中。

## 应用场景

`useEffectEvent` 适合在以下情况使用：

1. **分析和日志记录**：你希望记录用户行为，但不希望记录函数本身触发重新渲染
2. **处理事件中的最新值**：当你需要在 Effect 中处理事件，并且访问最新的 props/state 值，但不希望这些值的变化触发 Effect 重新执行

3. **避免不必要的副作用**：当某些值的变化不应导致副作用重新执行时

4. **分离响应性关注点**：将 Effect 的响应性部分与非响应性部分分开

## 示例代码

下面是一个示例，展示了如何使用 `useEffectEvent` 来解决常见的依赖问题：

```jsx
import { useState, useEffect, useEffectEvent } from "react";

function ChatRoom({ roomId, theme, onMessage }) {
  const [messages, setMessages] = useState([]);

  // 使用 useEffectEvent 创建一个非响应式的事件处理函数
  // 即使 onMessage 或 theme 变化，也不会导致 Effect 重新执行
  const onReceiveMessage = useEffectEvent((receivedMessage) => {
    // 可以安全地使用最新的 props，如 onMessage 和 theme
    console.log(`Received in ${theme} theme: ${receivedMessage}`);
    onMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();

    connection.on("message", (receivedMessage) => {
      // 调用我们的 Effect Event
      onReceiveMessage(receivedMessage);

      // 更新本地状态
      setMessages((prev) => [...prev, receivedMessage]);
    });

    return () => connection.disconnect();
    // 依赖数组中只包含真正需要触发重新连接的 roomId
    // onMessage 和 theme 不在依赖项中，因为它们通过 useEffectEvent 使用
  }, [roomId]);

  return (
    <div className={theme}>
      <h1>Welcome to {roomId}</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

// 模拟 API
function createConnection(roomId) {
  return {
    connect() {
      console.log(`Connected to ${roomId}`);
    },
    disconnect() {
      console.log(`Disconnected from ${roomId}`);
    },
    on(event, callback) {
      console.log(`Listening for ${event} events`);
      // 模拟消息
      setTimeout(() => {
        callback(`Hello from ${roomId}!`);
      }, 1000);
    },
  };
}
```

在这个例子中：

1. 我们有一个聊天室组件，它连接到由 `roomId` 指定的聊天室
2. 我们使用 `useEffectEvent` 创建了 `onReceiveMessage` 事件处理函数，它可以访问最新的 `onMessage` 和 `theme` props
3. 在 `useEffect` 中，我们只依赖于 `roomId`，因此只有当 `roomId` 改变时，才会重新建立连接
4. 即使 `onMessage` 或 `theme` 频繁变化，聊天连接也不会重新建立

## 使用规则和注意事项

1. **只能在组件顶层调用** - 像其他 React Hooks 一样
2. **只能在 Effects 内部调用** - 不能在事件处理程序或其他普通函数中使用
3. **不能传递给其他组件或 Hooks** - Effect Event 不是可组合的
4. **总是使用最新的值** - 它不会"捕获"渲染时的值，而是始终使用最新的值

## 结论

`useEffectEvent` 提供了一种优雅的方式来处理 React Effects 中的依赖问题。通过将非响应式逻辑与响应式逻辑分离，它使我们能够更精确地控制 Effects 的重新执行时机，同时保持代码的清晰和可维护性。

它是一个强大的工具，特别适合处理那些需要访问最新 props 和 state，但不应该导致 Effect 重新执行的场景。
