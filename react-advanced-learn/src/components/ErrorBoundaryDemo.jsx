import { MyErrorBoundary } from "./MyErrorBoundary";
import { useState } from "react";

function BuggyCounterFunc() {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter((prev) => prev + 1);
  };

  if (counter === 3) {
    throw new Error("函数组件计时器达到3了");
  }

  return (
    <div>
      <p>计数： {counter}</p>
      <button onClick={handleClick}>+1</button>
    </div>
  );
}
//自定义错误UI组件
function CustomErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="custom-error">
      <h3>自定义错误UI</h3>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>尝试恢复</button>
      <button
        onClick={() => {
          window.location.reload();
        }}
      >
        刷新页面
      </button>
    </div>
  );
}
export function ErrorBoundaryDemo() {
  const [resetKey, setResetKey] = useState(0);
  const handleReset = () => {
    console.log("重置计数器");
    setResetKey((prev) => prev + 1);
  };
  return (
    <div className="app">
      <h1>函数组件中的 ErrorBoundary 示例</h1>

      <section>
        <h2>基础示例</h2>
        <p>这个计数器被ErrorBoundary包裹，当计数器达到3时，会抛出错误：</p>
        <MyErrorBoundary onReset={handleReset}>
          <BuggyCounterFunc key={resetKey} />
        </MyErrorBoundary>
      </section>

      <section>
        <h2>自定义错误UI</h2>
        <p>这个计数器被ErrorBoundary包裹，当计数器达到3时，会抛出错误：</p>
        <MyErrorBoundary
          fallbackRender={CustomErrorFallback}
          onReset={handleReset}
        >
          <BuggyCounterFunc key={resetKey} />
        </MyErrorBoundary>
      </section>
    </div>
  );
}
