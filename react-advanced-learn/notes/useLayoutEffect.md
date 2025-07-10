# useLayoutEffect Hook

## 什么是 useLayoutEffect？

`useLayoutEffect` 是 React 提供的一个 Hook，它的函数签名与 `useEffect` 完全相同：

```jsx
useLayoutEffect(setup, dependencies?)
```

主要区别在于它的**执行时机**：`useLayoutEffect` 在浏览器执行绘制之前同步调用，而 `useEffect` 则是在绘制之后异步调用。

简单来说，`useLayoutEffect` 会在 DOM 变更之后、浏览器绘制之前同步执行，这意味着用户不会看到中间状态，因为 React 会等待 `useLayoutEffect` 执行完毕后再进行绘制。

## 怎么用？

使用 `useLayoutEffect` 的基本语法如下：

```jsx
import { useLayoutEffect } from "react";

function MyComponent() {
  useLayoutEffect(
    () => {
      // 这里的代码会在 DOM 更新后、浏览器绘制前同步执行

      // 可选：返回清理函数
      return () => {
        // 清理代码
      };
    },
    [
      /* 依赖数组 */
    ]
  );

  return <div>...</div>;
}
```

关键点：

- 第一个参数是一个函数，包含需要执行的副作用代码
- 第二个参数是依赖数组（可选），决定何时重新执行副作用
- 可以返回一个清理函数，在组件卸载或者依赖变化时执行
- 它会阻塞浏览器绘制，直到代码执行完毕

## 为什么要用 useLayoutEffect？

在大多数情况下，推荐使用标准的 `useEffect`。但在以下场景中，`useLayoutEffect` 特别有用：

1. **防止闪烁或视觉不一致**：当你需要在用户看到页面之前进行 DOM 测量和修改时
2. **同步 DOM 更新**：当一个操作必须在浏览器绘制前完成时
3. **需要精确测量和操作 DOM 元素**：比如需要获取元素尺寸并立即使用这些测量结果进行后续渲染

简而言之，`useLayoutEffect` 适用于那些需要同步执行、会直接影响用户视觉体验的操作。

## 与 useEffect 的区别

| 特性     | useEffect                | useLayoutEffect               |
| -------- | ------------------------ | ----------------------------- |
| 执行时机 | 浏览器绘制完成后异步执行 | 浏览器绘制前同步执行          |
| 阻塞绘制 | 否                       | 是                            |
| 推荐用于 | 大多数副作用操作         | 需要同步测量或修改 DOM 的操作 |
| 性能影响 | 通常更小                 | 可能导致绘制延迟              |

## 应用场景

以下是 `useLayoutEffect` 的常见应用场景：

1. **测量和调整 DOM 元素**：

   - 需要在渲染前获取元素尺寸并应用
   - 需要根据实际 DOM 情况调整布局

2. **动画处理**：

   - 需要在初始绘制前设置动画初始状态
   - 需要平滑过渡而不出现闪烁

3. **工具提示和弹出框定位**：

   - 需要根据其他元素位置来定位浮动元素

4. **滚动位置恢复/设置**：

   - 在组件渲染后但用户看到之前调整滚动位置

5. **防止闪烁**：
   - 当某个计算可能导致布局抖动时

## 示例代码

下面是一个使用 `useLayoutEffect` 的实际例子，演示了如何测量一个元素并根据其尺寸调整另一个元素：

```jsx
import { useState, useLayoutEffect, useRef } from "react";

function ResizeExample() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const targetRef = useRef(null);
  const measureRef = useRef(null);

  // 使用 useLayoutEffect 测量元素尺寸并应用
  useLayoutEffect(() => {
    if (measureRef.current) {
      // 获取测量元素的尺寸
      const { width, height } = measureRef.current.getBoundingClientRect();

      // 立即应用这些测量结果（在浏览器绘制前）
      setWidth(width);
      setHeight(height);
    }
  }, [measureRef.current]); // 当测量元素变化时重新执行

  return (
    <div>
      {/* 这个元素是我们要测量的 */}
      <div
        ref={measureRef}
        style={{
          border: "1px solid blue",
          padding: "20px",
          display: "inline-block",
        }}
      >
        这是要测量的内容
      </div>

      {/* 这个元素会基于上面元素的尺寸调整大小 */}
      <div
        ref={targetRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "lightgreen",
          marginTop: "10px",
        }}
      >
        我的尺寸与上面元素相同
      </div>

      <p>
        测量结果: {width}px × {height}px
      </p>
    </div>
  );
}
```

在这个示例中，如果我们使用普通的 `useEffect`，用户可能会先看到一个默认大小的绿色框，然后它突然"跳动"到正确的尺寸。使用 `useLayoutEffect` 可以确保调整大小的操作在用户看到任何内容之前完成，从而创造无缝的视觉体验。

## 注意事项

1. **性能考量**：由于 `useLayoutEffect` 是同步执行的，它可能会阻塞浏览器绘制，导致感知性能下降。只在必要时使用。

2. **服务器端渲染**：在服务器端渲染环境中，`useLayoutEffect` 和 `useEffect` 都不会运行，可能需要使用 `useEffect` 加条件检查，或考虑使用 `useMemo` 等其他解决方案。

3. **开发者工具**：React 的严格模式下，效果函数可能会执行两次，这是正常的，用于帮助发现副作用中的问题。

## 总结

`useLayoutEffect` 是一个强大的工具，专为需要在视觉更新前同步执行的场景设计。虽然在大多数情况下应优先使用 `useEffect`，但当你需要防止闪烁、需要精确测量和调整 DOM 元素时，`useLayoutEffect` 提供了重要的解决方案。

记住：默认使用 `useEffect`，只有当确实需要在绘制前同步执行时才使用 `useLayoutEffect`。

## 常见问题 (FAQ)

### Q: 代码中测量的值是如何从 measureRef 传递到 targetRef 的？

**A:** 在 ResizeExample 组件中，测量值是通过以下流程从 measureRef 传递到 targetRef 的:

1. **测量阶段**:

   - 组件使用 `useLayoutEffect` 钩子在浏览器绘制前执行测量
   - 通过 `measureRef.current.getBoundingClientRect()` 获取第一个元素的尺寸信息
   - 这个方法返回一个包含宽度、高度等属性的对象

2. **状态存储**:

   - 测量获取的宽度和高度值被保存到组件的状态变量中:
     ```jsx
     setWidth(width);
     setHeight(height);
     ```
   - 这些状态变量成为组件状态的一部分

3. **应用到目标元素**:
   - targetRef 元素在样式中使用这些状态值:
     ```jsx
     style={{
       width: `${width}px`,
       height: `${height}px`,
       backgroundColor: "lightgreen",
       marginTop: "10px",
     }}
     ```

本质上，数据流向是:

```
measureRef引用元素 → getBoundingClientRect()获取尺寸 → width/height状态变量 → targetRef元素的样式属性
```

这是 React 中常见的模式 - 使用状态作为中介，而不是直接从一个 ref 传值到另一个 ref。状态变化会触发重新渲染，确保目标元素能够获得更新后的尺寸值。

### Q: 这里使用两个 ref 的作用是什么？

**A:** 在这个组件中使用两个 ref 的作用：

1. **measureRef 的作用**：

   - 用于**获取**源元素的实际尺寸
   - 连接到第一个 div（蓝色边框元素）
   - 通过 `getBoundingClientRect()` 提供测量数据
   - 是整个功能的数据来源

2. **targetRef 的作用**：
   - 引用要应用尺寸的目标元素（绿色背景元素）
   - 在当前代码中实际上**没有被直接使用**
   - 它是为以下场景预留的:
     - 如果将来需要直接操作目标 DOM 元素
     - 如果需要对目标元素进行额外的测量或修改
     - 如果需要添加事件监听器到目标元素

值得注意的是，虽然 targetRef 被声明了，但在当前的实现中是冗余的：

- 尺寸传递完全通过 React 状态变量 (width/height) 和样式属性实现
- 没有代码直接使用 `targetRef.current` 来访问 DOM

这种模式在 React 中很常见，开发者通常为可能需要直接 DOM 操作的元素提前设置 ref，即使当前逻辑还没有用到。
