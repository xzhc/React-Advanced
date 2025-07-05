# React forwardRef 详解

## forwardRef 是什么？

`forwardRef` 是 React 提供的一个高级功能，它允许组件接收一个 ref 并将其向下传递（转发）给子组件。这在以下情况特别有用：当你需要直接访问子组件或 DOM 元素的时候，尤其是在封装可复用组件的场景中。

```jsx
const MyComponent = React.forwardRef((props, ref) => {
  return <子组件 ref={ref} {...props} />;
});
```

- `props`: 组件接收的常规 props
- `ref`: 由 React 提供的特殊参数，指向父组件创建的 ref 对象

## 如何使用 forwardRef？

### 基本用法

1. 创建一个使用 forwardRef 的自定义输入组件：

```jsx
import React, { forwardRef } from "react";

const CustomInput = forwardRef((props, ref) => {
  return (
    <div className="custom-input-container">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        ref={ref}
        id={props.id}
        type={props.type || "text"}
        className="custom-input"
        placeholder={props.placeholder}
        {...props}
      />
    </div>
  );
});

// 给组件添加显示名称，便于调试
CustomInput.displayName = "CustomInput";
```

2. 在父组件中使用该自定义输入组件：

```jsx
function App() {
  const inputRef = useRef(null);
  const [value, setValue] = useState("");

  // 聚焦到输入框的函数
  const focusInput = () => {
    inputRef.current.focus();
  };

  // 清空输入框的函数
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
          id="custom-input"
          label="自定义输入框："
          placeholder="请输入内容..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="buttons">
          <button onClick={focusInput}>聚焦输入框</button>
          <button onClick={clearInput}>清空输入框</button>
        </div>
      </div>

      <div className="value-display">
        <p>
          当前输入值: <strong>{value}</strong>
        </p>
      </div>
    </div>
  );
}
```

## 什么场景使用 forwardRef？

forwardRef 适用于以下场景：

1. **自定义表单组件**：当你创建自定义输入、选择或其他表单组件时，通常需要转发 ref 以便父组件可以访问底层的 DOM 元素（例如聚焦、选择文本等）。

2. **组件库开发**：开发可重用组件库时，forwardRef 允许库的使用者获取对内部 DOM 元素的访问权限。

3. **高阶组件（HOC）**：当你创建包装其他组件的高阶组件时，使用 forwardRef 可以确保 ref 正确地传递到被包装的组件。

4. **复合组件系统**：在构建具有多层嵌套的复杂组件系统时，forwardRef 可以帮助将 ref 从顶层组件传递到深层嵌套的特定元素。

5. **集成第三方 DOM 库**：当需要将 React 组件与需要直接 DOM 访问的第三方库集成时。

## 为什么使用 forwardRef 而不是其他方案？

### forwardRef vs 直接传递 DOM 元素

在以下情况下，forwardRef 比直接传递 DOM 元素更有优势：

1. **封装性**：

   - 直接传递：可能会破坏组件的封装性，暴露不必要的内部实现细节。
   - forwardRef：保持组件的封装性，同时提供对特定 DOM 元素的受控访问。

2. **类型安全**：
   - 直接传递：可能导致类型不匹配的问题，特别是在使用 TypeScript 的项目中。
   - forwardRef：提供类型安全的方式来传递 ref。

### forwardRef vs props 传递回调函数

有时候，开发者可能会考虑通过 props 传递回调函数来获取对 DOM 元素的引用：

1. **代码简洁性**：

   - 回调函数：需要额外的状态管理和回调处理逻辑。
   - forwardRef：更符合 React 的 ref API，代码更简洁。

2. **与 React 生态系统的兼容性**：
   - forwardRef 与 React 的其他 API（如 useImperativeHandle）配合使用，提供更强大的功能。

## 高级用法

### 与 useImperativeHandle 结合使用

`useImperativeHandle` 可以与 forwardRef 一起使用，自定义暴露给父组件的实例值：

```jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    // 只暴露特定的方法，而不是整个 DOM 元素
    setValue: (value) => {
      inputRef.current.value = value;
    },
  }));

  return <input ref={inputRef} {...props} />;
});
```

### TypeScript 中的 forwardRef

在 TypeScript 中使用 forwardRef 时，可以提供更精确的类型定义：

```tsx
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
} from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const CustomInput: ForwardRefRenderFunction<
  HTMLInputElement,
  CustomInputProps
> = (props, ref) => {
  const { label, ...rest } = props;
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} {...rest} />
    </div>
  );
};

export default forwardRef(CustomInput);
```

## 注意事项

1. **不要过度使用**：只在真正需要访问 DOM 元素或组件实例的情况下使用 forwardRef。过度使用可能导致代码难以维护。

2. **displayName 属性**：为使用 forwardRef 创建的组件设置 displayName 属性，以便在 React DevTools 中更容易识别。

3. **函数组件限制**：forwardRef 主要用于函数组件。类组件可以直接使用 ref 而不需要 forwardRef。

4. **条件渲染**：在条件渲染的情况下使用 forwardRef 时要小心，确保 ref 总是附加到正确的元素上。

5. **与 React.memo 结合**：当与 React.memo 一起使用时，确保正确的顺序：
   ```jsx
   const MemoizedComponent = React.memo(
     React.forwardRef((props, ref) => {
       // 组件实现
     })
   );
   ```

## 总结

React 的 forwardRef API 提供了一种优雅的方式来转发 refs 到组件树的深层次，使父组件能够与子组件中的 DOM 元素进行交互。这对于构建可重用的组件库、自定义表单元素和需要直接 DOM 操作的复杂组件特别有用。通过合理使用 forwardRef，我们可以在保持组件封装性的同时，提供必要的 DOM 访问能力，从而构建更灵活、更强大的 React 应用。
