# useDebugValue Hook

## 介绍

`useDebugValue` 是 React 提供的一个钩子（Hook），主要用于在 React DevTools 中显示自定义 hook 的标签。它让开发者能够为自定义 hook 添加额外的调试信息，使得在开发和调试过程中更容易理解和跟踪自定义 hook 的状态和行为。

## 如何使用

`useDebugValue` 的使用非常简单。它接受一个值作为参数，这个值将会在 React DevTools 中显示。

基本语法：

```jsx
import { useDebugValue } from "react";

function useCustomHook(initialValue) {
  // hook 的实现...

  useDebugValue(valueToDisplay);

  return something;
}
```

还可以传递第二个参数，一个格式化函数，用于延迟计算复杂值（仅当 DevTools 实际需要显示值时才会调用）：

```jsx
useDebugValue(date, (date) => date.toDateString());
```

## 为什么要用

- **提高调试效率**：在复杂应用中，通过明确标记自定义 hook 的状态，使调试过程更高效。
- **增强可读性**：在 DevTools 中显示有意义的描述，让团队成员能更快理解 hook 的用途和当前状态。
- **区分多个 hook 实例**：当同一个 hook 被多次使用时，可以通过自定义标签区分它们。

## 应用场景

`useDebugValue` 主要在以下场景中特别有用：

1. **开发共享库或组件**：当你开发供他人使用的自定义 hook 时，添加调试值可以帮助使用者更好地理解和调试。
2. **复杂状态管理**：当 hook 管理复杂状态或逻辑时，显示关键信息可以快速掌握状态。
3. **团队协作**：在多人协作的项目中，清晰的调试信息可以帮助团队成员更好地理解彼此的代码。
4. **大型应用开发**：在大型应用中，有多个相似的 hook 实例时，区分它们的状态和用途。

需要注意的是，`useDebugValue` 只会在 React DevTools 中显示，不会影响应用的实际运行或渲染。

## 示例代码

下面是一个使用 `useDebugValue` 的完整示例，演示了如何在自定义 hook 中添加调试信息：

```jsx
import { useState, useEffect, useDebugValue } from "react";

// 自定义 hook 用于追踪用户是否在线
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 添加调试值，在 React DevTools 中显示用户状态
  useDebugValue(isOnline ? "在线" : "离线");

  return isOnline;
}

// 示例组件
function UserStatus() {
  const isOnline = useOnlineStatus();

  return <div>用户当前状态: {isOnline ? "在线" : "离线"}</div>;
}

// 使用格式化函数的更复杂示例
function useLastApiCall() {
  const [lastCall, setLastCall] = useState(new Date());

  // 使用格式化函数，仅当 DevTools 需要显示时才格式化日期
  useDebugValue(
    lastCall,
    (date) => `上次 API 调用: ${date.toLocaleTimeString()}`
  );

  return [lastCall, () => setLastCall(new Date())];
}

export { useOnlineStatus, useLastApiCall };
```

在上面的示例中，当你在 React DevTools 中检查使用了 `useOnlineStatus` 的组件时，你将看到该 hook 旁边标记有 "在线" 或 "离线"，这使得在调试过程中能更快地了解用户的当前状态。
