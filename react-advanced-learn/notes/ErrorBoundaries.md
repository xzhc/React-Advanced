# Error Boundaries

## 什么是 Error Boundaries？

Error Boundaries 是 React 16 引入的一个错误处理机制，它允许你捕获并处理组件树中任何位置的 JavaScript 错误，防止整个应用崩溃。Error Boundaries 是特殊的 React 组件，可以捕获子组件树中的 JavaScript 错误，记录这些错误，并展示一个备用 UI。

Error Boundaries 可以捕获以下错误：

- 渲染期间的错误
- 生命周期方法中的错误
- 构造函数中的错误

注意，Error Boundaries 不能捕获以下错误：

- 事件处理器中的错误
- 异步代码中的错误（例如 setTimeout 或 requestAnimationFrame 回调）
- 服务端渲染
- Error Boundary 自身抛出的错误

## 怎么用 Error Boundaries？

要创建一个 Error Boundary 组件，你需要定义一个类组件，并实现以下一个或两个生命周期方法：

1. `static getDerivedStateFromError()` - 用于渲染备用 UI
2. `componentDidCatch()` - 用于记录错误信息

React 18 之前，Error Boundaries 只能通过类组件实现，React 18 之后可以通过 `react-error-boundary` 这样的第三方库在函数组件中使用。

基本实现如下：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级 UI 并渲染
      return <h1>出错了！</h1>;
    }

    return this.props.children;
  }
}
```

使用 Error Boundary 组件时，只需将可能出错的组件包裹起来：

```jsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## 为什么要用 Error Boundaries？

1. **增强用户体验**：在生产环境中，当组件发生错误时，若不使用 Error Boundaries，整个 React 应用可能会崩溃，用户会看到一个空白页面。使用 Error Boundaries 可以确保应用的其他部分继续正常工作。

2. **错误隔离**：你可以仅在需要的组件周围添加 Error Boundaries，保持应用的其他部分不受影响。

3. **错误追踪**：通过 `componentDidCatch()` 方法，你可以记录错误并发送到监控服务，帮助你及时发现和解决问题。

4. **提供更友好的用户反馈**：当发生错误时，你可以显示自定义的错误信息，指导用户如何继续操作。

## 应用场景

Error Boundaries 适用于以下场景：

1. **复杂组件树**：在复杂的组件树中，某个组件出错不应该影响整个应用。

2. **第三方组件**：当使用不受你控制的第三方组件时，可以用 Error Boundary 包裹它们。

3. **数据展示组件**：在展示用户生成内容或外部 API 数据的组件中，可能会遇到格式不一致的问题。

4. **路由级别保护**：在路由组件周围添加 Error Boundaries，防止路由切换时的错误影响整个应用。

5. **重要的用户交互区域**：比如表单提交、支付流程等关键功能区域。

## 完整示例

下面是一个完整的示例，展示如何创建和使用 Error Boundary：

```jsx
import React from "react";

// Error Boundary 组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 捕获错误并更新状态
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // 可以将错误信息上报到服务器
    // logErrorToService(error, errorInfo);
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 可以根据错误类型渲染不同的 UI
      return (
        <div className="error-container">
          <h2>出错了！</h2>
          <p>很抱歉，组件渲染时发生错误。</p>
          {this.props.fallback ? (
            this.props.fallback
          ) : (
            <button onClick={() => this.setState({ hasError: false })}>
              尝试恢复
            </button>
          )}
          {/* 在开发环境中可以显示更详细的错误信息 */}
          {process.env.NODE_ENV === "development" && (
            <details style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// 一个会抛出错误的组件
class BuggyCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(({ counter }) => ({
      counter: counter + 1,
    }));
  }

  render() {
    if (this.state.counter === 3) {
      // 当计数器达到 3 时，抛出错误
      throw new Error("计数器达到 3 了！");
    }
    return (
      <div>
        <p>计数: {this.state.counter}</p>
        <button onClick={this.handleClick}>增加</button>
      </div>
    );
  }
}

// 使用 Error Boundary 的示例应用
function App() {
  return (
    <div className="app">
      <h1>Error Boundary 示例</h1>

      <p>这个计数器被 ErrorBoundary 包裹，当计数达到 3 时会抛出错误：</p>
      <ErrorBoundary>
        <BuggyCounter />
      </ErrorBoundary>

      <hr />

      <p>这个计数器也会抛出错误，但有自定义的 fallback UI：</p>
      <ErrorBoundary
        fallback={
          <div>
            <p>哎呀！计数器组件崩溃了。</p>
            <button onClick={() => window.location.reload()}>刷新页面</button>
          </div>
        }
      >
        <BuggyCounter />
      </ErrorBoundary>

      <hr />

      <p>这部分不会受到上面组件错误的影响：</p>
      <p>应用的其他部分仍然可以正常工作！</p>
    </div>
  );
}

export default App;
```

## 在函数组件中使用 Error Boundaries

如果你想在函数组件中使用 Error Boundaries，可以使用流行的 `react-error-boundary` 库：

```jsx
import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

// 错误回退组件，显示在发生错误时
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-container" role="alert">
      <h2>出错了！</h2>
      <p>很抱歉，组件渲染时发生错误。</p>
      <pre
        style={{
          color: "red",
          padding: "0.5rem",
          backgroundColor: "#f8f8f8",
          borderRadius: "4px",
        }}
      >
        {error.message}
      </pre>
      <button onClick={resetErrorBoundary}>尝试恢复</button>
    </div>
  );
}

// 会抛出错误的函数组件
function BuggyCounterFunc() {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };

  if (counter === 3) {
    // 当计数器达到 3 时，抛出错误
    throw new Error("函数组件计数器达到 3 了！");
  }

  return (
    <div>
      <p>计数: {counter}</p>
      <button onClick={handleClick}>增加</button>
    </div>
  );
}

// 自定义错误边界组件（包装react-error-boundary）
function MyErrorBoundary({ children, fallbackRender, onReset }) {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender || ErrorFallback}
      onReset={onReset}
      onError={(error, info) => {
        // 记录错误信息
        console.error("Error caught by ErrorBoundary:", error, info);

        // 可以在这里将错误发送到日志服务
        // logErrorToService(error, info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// 使用自定义错误处理的组件
function ComponentWithTryCatch() {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = () => {
    try {
      // 模拟可能抛出错误的操作
      const randomNum = Math.random();
      if (randomNum < 0.5) {
        throw new Error("操作失败！随机数小于0.5");
      }

      alert("操作成功！随机数大于等于0.5");
      // 重置错误状态
      setHasError(false);
      setError(null);
    } catch (err) {
      // 捕获并处理错误
      setHasError(true);
      setError(err);
    }
  };

  if (hasError) {
    return (
      <div className="error-container">
        <h3>操作执行失败</h3>
        <p>{error.message}</p>
        <button onClick={() => setHasError(false)}>重试</button>
      </div>
    );
  }

  return (
    <div>
      <p>这个组件使用 try/catch 处理事件错误</p>
      <button onClick={handleClick}>执行可能失败的操作</button>
    </div>
  );
}

// 示例应用
function ErrorBoundaryDemo() {
  // 恢复错误边界的函数
  const handleReset = () => {
    // 可以在这里执行任何重置应用状态的操作
    console.log("错误边界已重置");
  };

  // 自定义错误UI
  const CustomFallback = ({ error, resetErrorBoundary }) => (
    <div className="custom-error">
      <h3>哎呀！出现了自定义错误UI</h3>
      <p>{error.message}</p>
      <div>
        <button onClick={resetErrorBoundary}>重置</button>
        <button onClick={() => window.location.reload()}>刷新页面</button>
      </div>
    </div>
  );

  return (
    <div className="app">
      <h1>函数组件中的 Error Boundary 示例</h1>

      <section>
        <h2>基础示例</h2>
        <p>这个计数器被 ErrorBoundary 包裹，当计数达到 3 时会抛出错误：</p>
        <MyErrorBoundary onReset={handleReset}>
          <BuggyCounterFunc />
        </MyErrorBoundary>
      </section>

      <hr />

      <section>
        <h2>自定义错误UI</h2>
        <p>这个计数器使用自定义的错误回退组件：</p>
        <ErrorBoundary fallbackRender={CustomFallback} onReset={handleReset}>
          <BuggyCounterFunc />
        </ErrorBoundary>
      </section>

      <hr />

      <section>
        <h2>错误重置与恢复</h2>
        <p>这个示例演示如何在发生错误后重置组件状态：</p>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={
            [
              /* 依赖的状态，当这些状态改变时会自动重置错误边界 */
            ]
          }
        >
          <BuggyCounterFunc />
        </ErrorBoundary>
      </section>

      <hr />

      <section>
        <h2>嵌套错误边界</h2>
        <p>错误边界可以嵌套，内部错误不会影响外部组件：</p>
        <MyErrorBoundary>
          <div>
            <p>外层组件正常显示</p>
            <MyErrorBoundary>
              <BuggyCounterFunc />
            </MyErrorBoundary>
            <p>即使内部组件出错，这段文本也会显示</p>
          </div>
        </MyErrorBoundary>
      </section>

      <hr />

      <section>
        <h2>事件处理中的错误</h2>
        <p>
          注意：ErrorBoundary 不能捕获事件处理器中的错误，需要使用 try/catch：
        </p>
        <ComponentWithTryCatch />
      </section>

      <hr />

      <section>
        <h2>使用 withErrorBoundary 高阶组件</h2>
        <p>可以使用 withErrorBoundary 高阶组件包装需要错误处理的组件：</p>
        {/* 
          使用 withErrorBoundary 高阶组件的示例：
          
          import { withErrorBoundary } from 'react-error-boundary';
          
          const ComponentWithErrorBoundary = withErrorBoundary(YourComponent, {
            FallbackComponent: ErrorFallback,
            onError: (error, info) => console.error(error, info),
            onReset: () => console.log('重置')
          });
          
          然后直接使用：<ComponentWithErrorBoundary />
        */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <div>
            <p>withErrorBoundary 示例组件将在这里</p>
            <p>
              <code>
                const ProtectedComponent = withErrorBoundary(YourComponent,
                options);
              </code>
            </p>
          </div>
        </ErrorBoundary>
      </section>

      <hr />

      <section>
        <h2>安全区域</h2>
        <p>这部分不会受到上面组件错误的影响：</p>
        <p>应用的其他部分仍然可以正常工作！</p>
      </section>
    </div>
  );
}

export default ErrorBoundaryDemo;
```

## 函数组件中的错误处理详解

以下内容将详细介绍在使用 `react-error-boundary` 库时，函数组件中错误处理的完整流程和机制。

### 错误处理的完整流程

使用 `react-error-boundary` 处理函数组件中错误的完整流程如下：

1. **错误发生**：

   - 当 `BuggyCounterFunc` 组件中的计数器达到 3 时，代码执行到 `if (counter === 3) { throw new Error('...'); }`
   - React 渲染过程中遇到这个错误，开始向上冒泡寻找最近的错误边界

2. **错误捕获**：

   - `ErrorBoundary` 组件捕获到这个错误
   - 内部调用 `onError` 回调（如果提供），记录错误信息
   - 例如：`console.error("Error caught by ErrorBoundary:", error, info);`

3. **状态转换**：

   - `ErrorBoundary` 内部将自己的状态从正常渲染变为错误状态
   - 错误和错误信息被存储在内部状态中

4. **渲染降级 UI**：

   - `ErrorBoundary` 不再渲染其子组件（即出错的 `BuggyCounterFunc`）
   - 而是渲染 `FallbackComponent`（或使用 `fallbackRender` 函数）
   - 错误信息和重置函数作为 props 传递给降级组件：`{ error, resetErrorBoundary }`

5. **用户交互与恢复**：

   - 用户在错误 UI 上看到"尝试恢复"按钮
   - 当用户点击此按钮时，触发 `resetErrorBoundary` 函数
   - 此函数执行以下步骤：
     - 调用 `onReset` 回调（如例中的 `handleReset`），允许开发者执行自定义恢复逻辑
     - 重置 `ErrorBoundary` 的内部错误状态
     - `ErrorBoundary` 重新尝试渲染其子组件

6. **重置后渲染**：

   - `BuggyCounterFunc` 重新渲染
   - 由于 React 的状态持久化，counter 仍然是 3
   - 这会导致错误再次发生，错误边界再次捕获错误

7. **完整恢复（使用 resetKeys）**：
   - 为解决上述问题，可以使用 `resetKeys` 属性
   - 当 `resetKeys` 数组中的值发生变化时，子组件状态会被重置
   - 通过修改 key 值可以强制组件完全重新创建

### 自定义错误边界组件详解

`MyErrorBoundary` 组件是对 `react-error-boundary` 的 `ErrorBoundary` 组件的自定义包装，提供了更简洁的 API 和一致的错误处理体验：

```jsx
function MyErrorBoundary({ children, fallbackRender, onReset }) {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender || ErrorFallback}
      onReset={onReset}
      onError={(error, info) => {
        // 记录错误信息
        console.error("Error caught by ErrorBoundary:", error, info);

        // 可以在这里将错误发送到日志服务
        // logErrorToService(error, info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

**工作原理与优势**：

1. **简化 API**：将常用的错误边界配置封装起来，减少重复代码
2. **统一错误处理**：在整个应用中保持一致的错误处理逻辑
3. **可扩展性**：可以轻松扩展，添加应用特定的错误处理逻辑
4. **易于使用**：简化了错误边界的使用方式
5. **组合性**：可以与其他组件和功能组合使用，支持嵌套

### Error 和 ResetErrorBoundary 的来源

在错误回退组件中，我们可以直接使用 `error` 和 `resetErrorBoundary` 参数：

```jsx
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-container" role="alert">
      <h2>出错了！</h2>
      <p>很抱歉，组件渲染时发生错误。</p>
      <pre style={{ color: "red", padding: "0.5rem" }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>尝试恢复</button>
    </div>
  );
}
```

这些参数是如何传递的？

1. **error 的来源**：

   - 当子组件抛出错误时，`ErrorBoundary` 组件内部捕获该错误
   - 错误被保存在 `ErrorBoundary` 的内部状态中
   - 渲染回退 UI 时，错误对象被作为 `error` prop 传递给回退组件

2. **resetErrorBoundary 的来源**：
   - 这是 `ErrorBoundary` 内部创建的函数
   - 调用时会执行用户提供的 `onReset` 回调
   - 同时重置 `ErrorBoundary` 的内部错误状态
   - 这个函数也被传递给回退组件，供用户点击重置按钮时调用

### 回退 UI 的选择机制

在使用错误边界时，可以提供不同的回退 UI 组件：

1. **回退组件的优先级**：

   - `fallbackRender` 属性（函数形式）
   - `FallbackComponent` 属性（组件形式）
   - 默认的回退组件

2. **自定义包装器中的选择**：
   在 `MyErrorBoundary` 中，我们使用 `fallbackRender || ErrorFallback` 的短路逻辑：

   - 如果提供了 `fallbackRender`，则使用它
   - 否则，使用默认的 `ErrorFallback` 组件

3. **回退 UI 的实现**：
   在实际应用中，即使使用了 `react-error-boundary` 库，我们仍然需要自己实现回退 UI 组件，因为库提供的默认 UI 过于简单，通常不适合生产环境使用。

### 重置计数器错误的方法

当计数器达到 3 并触发错误后，要将其重置到 0 以恢复正常，有几种常用方法：

#### 1. 使用 key 重置组件（推荐方法）

这是最简单且最常用的解决方案：

```jsx
function ErrorBoundaryDemo() {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    console.log("重置计数器");
    setResetKey((prev) => prev + 1); // 更新key使组件重新创建
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
      {/* key改变会导致组件完全重新创建，内部状态重置为初始值 */}
      <BuggyCounterFunc key={resetKey} />
    </ErrorBoundary>
  );
}
```

**key 重置组件的工作原理**：

- React 使用 `key` 属性标识组件实例
- 当 `key` 值改变时，React 会：
  1. 完全卸载旧组件（销毁实例和状态）
  2. 创建全新的组件实例（状态初始化为默认值）
- 这导致 `counter` 状态被重置为初始值 `0`
- 由于这是全新的组件实例，不会立即重复之前的错误

这种方法的优势：

- 无入侵性：不需要修改子组件内部逻辑
- 完全重置：不仅重置状态，还重置所有生命周期和 Effect
- 简单高效：只需改变 key 值，无需复杂逻辑
- 适用性广：适用于任何类型的组件

#### 2. 使用状态提升和 resetKeys

另一种方法是将状态提升到父组件，并使用 `resetKeys` 属性：

```jsx
function ErrorBoundaryDemo() {
  const [counter, setCounter] = useState(0);

  const handleReset = () => {
    setCounter(0); // 重置计数器值为0
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={handleReset}
      resetKeys={[counter]} // 当counter改变时，重置错误状态
    >
      <BuggyCounterFunc counter={counter} setCounter={setCounter} />
    </ErrorBoundary>
  );
}
```

#### 3. 使用 useImperativeHandle 和 ref

通过暴露重置方法，允许父组件控制子组件状态：

```jsx
// 创建一个带有重置方法的计数器
const BuggyCounterWithReset = React.forwardRef((props, ref) => {
  const [counter, setCounter] = useState(0);

  // 暴露重置方法给父组件
  React.useImperativeHandle(ref, () => ({
    reset: () => setCounter(0),
  }));

  // 组件其余部分...
});

function ErrorBoundaryDemo() {
  const counterRef = useRef(null);

  const handleReset = () => {
    // 调用子组件的重置方法
    if (counterRef.current) {
      counterRef.current.reset();
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
      <BuggyCounterWithReset ref={counterRef} />
    </ErrorBoundary>
  );
}
```

### 总结

函数组件中的错误处理通过 `react-error-boundary` 库实现，具有完整的错误捕获、显示和恢复机制。错误恢复时，需要特别注意组件状态的重置，以避免再次触发相同的错误。使用 key 重置组件是最简单有效的方法，适用于大多数场景。

通过了解这些机制，你可以在 React 应用中构建更健壮的错误处理系统，提高用户体验。

## 结论

Error Boundaries 是 React 应用中实现错误处理和增强稳定性的重要机制。通过正确使用 Error Boundaries，你可以：

- 防止整个应用因局部组件错误而崩溃
- 提供更好的用户体验
- 收集错误信息用于改进
- 增强应用的健壮性

记住，Error Boundaries 应该成为你 React 应用错误处理策略中的重要一环，但不应该完全替代其他错误处理机制，如 try/catch 或合适的输入验证。
