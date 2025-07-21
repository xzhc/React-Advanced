# TypeScript useRef

## 什么是 TypeScript useRef？

TypeScript useRef 是 React Hooks 中的 useRef hook 与 TypeScript 结合使用的方式。它允许在函数组件中创建一个可变的引用，这个引用在整个组件生命周期内保持不变。useRef 与 TypeScript 结合使用时，可以为引用的值提供类型安全，增强代码的可靠性和可维护性。

useRef Hook 是 React 16.8 引入的特性，主要用于：

1. 保存、访问 DOM 元素
2. 在不触发重新渲染的情况下存储可变值
3. 保存任何可变值，类似于类组件中的实例属性

与 useState 不同，更新 useRef 的`.current`属性不会导致组件重新渲染。

## 如何使用 TypeScript useRef？

在 TypeScript 中使用 useRef 有以下几种方式：

### 1. 引用 DOM 元素

```tsx
import React, { useRef, useEffect } from "react";

function TextInputWithFocus() {
  // 指定DOM元素类型为HTMLInputElement
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 组件挂载后自动聚焦到输入框
    // 使用可选链操作符，因为初始值为null
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}
```

### 2. 存储可变值

```tsx
import React, { useRef, useEffect } from "react";

function IntervalCounter() {
  // 指定number类型
  const countRef = useRef<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // 更新countRef.current不会触发重新渲染
      countRef.current += 1;
      console.log(`计数: ${countRef.current}`);
    }, 1000);

    // 清理函数
    return () => clearInterval(intervalId);
  }, []);

  return <div>打开控制台查看计数</div>;
}
```

### 3. 指定可能为 null 的复杂类型

```tsx
import React, { useRef, useEffect } from "react";

// 定义接口
interface User {
  id: number;
  name: string;
}

function UserTracker() {
  // 指定User类型或null
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    // 模拟获取用户数据
    const fetchUser = () => {
      // 设置userRef.current
      userRef.current = {
        id: 1,
        name: "李四",
      };
    };

    fetchUser();

    // 在组件卸载时记录最后的用户
    return () => {
      if (userRef.current) {
        console.log(`最后的用户是: ${userRef.current.name}`);
      }
    };
  }, []);

  return <div>用户数据存储在ref中</div>;
}
```

## 为什么要使用 TypeScript useRef？

使用 TypeScript 版本的 useRef 有以下优势：

1. **类型安全** - 在编译时捕获类型错误，避免运行时错误
2. **IDE 支持** - 提供更好的代码自动完成和提示功能
3. **文档化** - 通过类型定义明确 ref 值的结构和用途
4. **安全访问** - TypeScript 强制进行 null 检查，避免访问未初始化 ref 的错误
5. **更易维护** - 当项目扩大或团队更改时，类型信息帮助新开发人员理解代码

## 应用场景

TypeScript useRef 适用于以下场景：

### 1. 访问 DOM 元素

```tsx
import React, { useRef } from "react";

function VideoPlayer() {
  // 指定video元素类型
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    // 使用可选链操作符安全访问
    videoRef.current?.play();
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  return (
    <div>
      <video ref={videoRef} src="https://example.com/video.mp4" />
      <button onClick={handlePlay}>播放</button>
      <button onClick={handlePause}>暂停</button>
    </div>
  );
}
```

### 2. 保存前一个值

```tsx
import React, { useState, useRef, useEffect } from "react";

function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  // 使用类型参数指定number类型
  const prevCountRef = useRef<number>(0);

  useEffect(() => {
    // 在每次渲染后更新prevCountRef
    prevCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>
        当前值: {count}, 前一个值: {prevCountRef.current}
      </p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### 3. 避免不必要的重新渲染

```tsx
import React, { useState, useRef, useCallback } from "react";

interface CacheData {
  [key: string]: any;
}

function DataCache() {
  const [, forceRender] = useState({});
  // 使用类型参数指定缓存对象类型
  const cacheRef = useRef<CacheData>({});

  const updateCache = useCallback((key: string, value: any) => {
    // 更新缓存不会触发重新渲染
    cacheRef.current[key] = value;
  }, []);

  const readCache = useCallback((key: string) => {
    return cacheRef.current[key];
  }, []);

  return (
    <div>
      <button onClick={() => updateCache("testKey", new Date().toISOString())}>
        更新缓存
      </button>
      <button onClick={() => alert(readCache("testKey"))}>读取缓存</button>
      <button onClick={() => forceRender({})}>强制重新渲染</button>
    </div>
  );
}
```

### 4. 保存定时器 ID 以便清理

```tsx
import React, { useState, useRef, useEffect } from "react";

function Countdown() {
  const [count, setCount] = useState(10);
  // 明确指定NodeJS.Timeout类型，也可以用number类型
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current !== null) return;

    timerRef.current = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          // 当计数到1时清除定时器
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setCount(10);
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>倒计时: {count}</p>
      <button onClick={startTimer}>开始</button>
      <button onClick={stopTimer}>暂停</button>
      <button onClick={resetTimer}>重置</button>
    </div>
  );
}
```

## 完整示例

以下是一个更完整的示例，展示如何使用 TypeScript 与 useRef 创建一个可拖拽元素：

```tsx
import React, { useRef, useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const DraggableElement: React.FC = () => {
  // 元素的当前位置状态
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  // 拖拽状态
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // 拖拽开始时的鼠标位置
  const dragStartRef = useRef<Position | null>(null);
  // 元素引用
  const elementRef = useRef<HTMLDivElement>(null);

  // 处理鼠标按下事件
  const handleMouseDown = (e: React.MouseEvent) => {
    if (elementRef.current) {
      setIsDragging(true);

      // 记录鼠标开始拖拽的位置
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragStartRef.current) {
      // 计算新位置
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;

      // 更新位置状态
      setPosition({ x: newX, y: newY });
    }
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  // 添加和清理全局事件监听器
  useEffect(() => {
    if (isDragging) {
      // 添加全局鼠标事件监听器
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    // 清理函数
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={elementRef}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "100px",
        height: "100px",
        backgroundColor: isDragging ? "lightblue" : "lightgray",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "4px",
      }}
      onMouseDown={handleMouseDown}
    >
      拖拽我
    </div>
  );
};

export default DraggableElement;
```

在这个例子中：

1. 我们使用`useRef<HTMLDivElement>(null)`引用 DOM 元素
2. 使用`useRef<Position | null>(null)`存储拖拽开始时的鼠标位置
3. 使用 TypeScript 类型增强了代码的安全性和可读性
4. 实现了跨渲染周期保存数据的能力

这个示例展示了 TypeScript 和 useRef 如何协同工作，提供类型安全的同时实现复杂的交互功能。当与其他 React hooks（如 useState 和 useEffect）结合使用时，useRef 可以帮助创建高性能、可维护的 React 组件。
