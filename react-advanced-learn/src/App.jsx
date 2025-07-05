import { useRef, useState } from "react";
import { CustomInput } from "./components/CustomInput";

function App() {
  const inputRef = useRef(null);
  const [value, setValue] = useState("");

  const focusInput = () => {
    inputRef.current.focus();
  };

  const clearInput = () => {
    inputRef.current.value = "";
    setValue("");
  };
  return (
    <div className="app">
      <h1>React forwardRef 示例</h1>
      <div className="input-section">
        <CustomInput
          ref={inputRef}
          id="cutsom-input"
          label="自定义输入框:"
          placeholder="请输入内容..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className="button-section">
        <button onClick={focusInput}>聚焦输入框</button>
        <button onClick={clearInput}>清空输入框</button>
      </div>

      <div className="output-section">
        当前输入值：<strong> {value}</strong>
      </div>
    </div>
  );
}
export default App;
