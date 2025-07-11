# useCallback as Ref

## 什么是 useCallback as ref？

useCallback as ref 是一种 React 模式，它利用 useCallback Hook 创建一个稳定的回调函数来处理子组件的引用（ref）。这种模式特别有用于需要在函数组件中动态收集多个子组件引用的场景。

与传统的 useRef 方法不同，useCallback as ref 允许您在每次子组件挂载时执行逻辑，而不仅仅是存储引用。

## 怎么用？

使用步骤如下：

1. 使用 `useCallback` 创建一个稳定的回调函数，该函数接收子组件的 DOM 元素或实例作为参数
2. 将这个回调函数作为 `ref` 属性传递给子组件
3. 在回调函数内部，您可以存储引用，执行副作用或者其他操作

基本语法：

```jsx
const someRef = useCallback(
  (node) => {
    if (node !== null) {
      // 当组件挂载时执行
      // node 是对 DOM 元素或组件实例的引用
    }
    // 当组件卸载时，node 将为 null
  },
  [
    /* 依赖项 */
  ]
);

// 然后在 JSX 中使用
<div ref={someRef}>...</div>;
```

## 为什么要用？

使用 useCallback as ref 有几个主要优势：

1. **动态处理引用**：当组件挂载/更新/卸载时，您可以执行特定的逻辑
2. **收集多个引用**：可以轻松收集动态数量的子组件引用
3. **条件性引用**：可以根据条件决定是否存储引用
4. **引用与状态结合**：可以将引用与组件的状态联系起来
5. **引用处理逻辑复用**：可以在不同组件间复用引用处理逻辑

## 应用场景

- 测量 DOM 元素尺寸或位置
- 管理焦点、滚动或选择
- 集成第三方 DOM 库
- 创建可滚动列表并管理每个项的引用
- 管理表单中的多个输入字段
- 触发子组件的命令式方法

## 示例代码

下面是一个示例，展示如何使用 useCallback as ref 来创建一个能够测量子元素高度的组件：

```jsx
import { useState, useCallback, useEffect } from "react";

function MeasureExample() {
  const [height, setHeight] = useState(0);
  const [elements, setElements] = useState([]);

  // 使用 useCallback 创建稳定的 ref 回调
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  // 用于收集多个元素引用的回调
  const collectRef = useCallback((node) => {
    if (node !== null) {
      setElements((prev) => [...prev.filter((el) => el !== node), node]);
    } else {
      // 当元素卸载时
      setElements((prev) => prev.filter((el) => el.isConnected));
    }
  }, []);

  useEffect(() => {
    console.log("收集的元素数量:", elements.length);
  }, [elements]);

  return (
    <div>
      <h2 ref={measuredRef}>你好，世界！</h2>
      <p>上面标题的高度是: {Math.round(height)}px</p>

      <div>
        {["A", "B", "C"].map((item) => (
          <div key={item} ref={collectRef}>
            项目 {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeasureExample;
```

这个例子展示了两种使用方式：

1. `measuredRef` 用于测量单个元素的高度
2. `collectRef` 用于收集多个子元素的引用

使用 useCallback as ref 模式可以让我们执行更复杂的引用处理逻辑，同时保持代码的清晰和组织良好。

## 执行过程详解

### 1. measuredRef (测量单个元素高度)

```jsx
const measuredRef = useCallback((node) => {
  if (node !== null) {
    setHeight(node.getBoundingClientRect().height);
  }
}, []);
```

执行过程：

1. 组件首次渲染时，React 创建一个稳定的回调函数 `measuredRef`
2. 当 `<h2>` 元素挂载到 DOM 时，React 自动调用 `measuredRef(h2Element)`
3. 回调函数检查 `node !== null`（此时 node 是 h2 DOM 元素）
4. 回调函数调用 `getBoundingClientRect().height` 获取元素实际高度
5. 通过 `setHeight` 更新组件状态，将高度值存储起来
6. 当状态更新后，组件重新渲染，显示测量到的高度
7. 如果组件卸载，React 会调用 `measuredRef(null)`，但在这个例子中没有针对 null 的处理逻辑

### 2. collectRef (收集多个元素引用)

```jsx
const collectRef = useCallback((node) => {
  if (node !== null) {
    setElements((prev) => [...prev.filter((el) => el !== node), node]);
  } else {
    // 当元素卸载时
    setElements((prev) => prev.filter((el) => el.isConnected));
  }
}, []);
```

执行过程：

1. 组件首次渲染时，创建一个空的 `elements` 数组和稳定的 `collectRef` 回调
2. 对于数组 `["A", "B", "C"]` 中的每一项，React 创建一个 div 元素
3. 当每个 div 挂载到 DOM 时，React 调用 `collectRef(divElement)`
4. 对于每个调用：
   - 检查 `node !== null`（此时是真的，因为元素已挂载）
   - 通过函数式更新，先从之前的数组中过滤掉相同节点（防止重复），再添加当前节点
   - 这个操作确保每个 DOM 元素只在数组中出现一次，即使组件重新渲染
5. 当 `elements` 数组更新后，useEffect 触发，输出当前收集的元素数量
6. 如果任何元素被移除（例如条件渲染或组件卸载）：
   - React 自动调用 `collectRef(null)`
   - 回调函数执行 else 分支，过滤掉已断开连接的 DOM 元素
   - `isConnected` 属性检查元素是否仍在文档中

这两种模式的关键区别：

- `measuredRef` 只关心获取单个元素的属性，执行一次性测量
- `collectRef` 管理一个元素集合，能动态添加和移除元素，保持集合的最新状态

这种方法特别适用于需要跟踪多个动态生成元素的场景，比如列表项、表单字段或需要测量/观察的 DOM 元素集合。
