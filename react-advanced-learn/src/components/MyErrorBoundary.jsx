import { ErrorBoundary } from "react-error-boundary";
//默认回退渲染错误UI组件
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-container">
      <h2>出错了！</h2>
      <p>很抱歉，出现了一些错误。</p>
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
//自定义错误边界组件
export function MyErrorBoundary({ children, fallbackRender, onReset }) {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender || ErrorFallback}
      onReset={onReset}
      onError={(error, info) => {
        //记录错误信息
        console.error("Error caught by MyErrorBoundary:", error, info);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
