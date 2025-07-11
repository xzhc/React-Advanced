import { UseImperativeHandleExample } from "./components/UseImperativeHandleExample.jsx";
import { useRef } from "react";

function App() {
  const inputRef = useRef(null);
  const handleFocus = () => {
    inputRef.current.focus();
  };
  const handleClear = () => {
    inputRef.current.clear();
  };
  const handleGetValue = () => {
    alert(`输入框的值为：${inputRef.current.getValue()}`);
  };
  return (
    <div>
      <UseImperativeHandleExample ref={inputRef} placeholder="请输入内容" />
      <button onClick={handleFocus}>聚焦输入框</button>
      <button onClick={handleClear}>清除输入框</button>
      <button onClick={handleGetValue}>获取输入框值</button>
    </div>
  );
}
export default App;
