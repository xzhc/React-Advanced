import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export const UseImperativeHandleExample = forwardRef((props, ref) => {
  const [value, setValue] = useState(0);
  const inputRef = useRef(null);

  //使用useImperativeHandle定义暴露给父组件的方法
  useImperativeHandle(
    ref,
    () => ({
      //聚焦输入框
      focus: () => {
        inputRef.current.focus();
      },
      //获取输入框的值
      getValue: () => {
        return value;
      },
      //清除输入框内容
      clear: () => {
        setValue("");
      },
    }),
    [value]
  );

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});
