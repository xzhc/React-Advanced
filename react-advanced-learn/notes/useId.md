# useId Hook

## 介绍

`useId` 是 React 18 新引入的一个 Hook，用于生成稳定、唯一的 ID，主要用于可访问性（Accessibility）属性。它解决了服务端渲染（SSR）和客户端渲染（CSR）之间 ID 不匹配的问题，确保了跨环境的 ID 一致性。

## 如何使用

使用 `useId` 非常简单：

```jsx
import { useId } from "react";

function Component() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>Label</label>
      <input id={id} />
    </div>
  );
}
```

特点：

- 调用 `useId` 会返回一个唯一的字符串 ID
- 同一组件的多次渲染中，返回的 ID 保持不变
- 不同组件实例调用会返回不同的 ID
- 支持前缀添加：`const id = useId(); const emailId = id + '-email';`

## 为什么要用 useId

1. **解决 SSR 和 CSR 不匹配问题**：在服务端渲染时，如果使用随机生成的 ID 或者递增计数器，客户端水合(hydration)时会生成不同的 ID，导致 React 警告和潜在的可访问性问题。

2. **替代不安全的随机 ID 生成方式**：避免使用 `Math.random()` 或时间戳等方式生成不稳定的 ID。

3. **避免硬编码 ID**：硬编码的 ID 在组件多次使用时会导致重复 ID，违反 HTML 规范。

4. **提高可访问性**：为表单控件、aria 属性等提供稳定的关联 ID，改善屏幕阅读器等辅助技术的使用体验。

## 应用场景

1. **表单元素关联**：将 label 和 input 关联起来
2. **aria 属性**：为 aria-labelledby, aria-describedby 等属性提供 ID
3. **复杂组件**：如模态框、下拉菜单、标签页等需要关联多个元素的组件
4. **任何需要生成稳定、唯一 ID 的场景**

## 示例代码

以下是一个表单组件的例子，展示了如何使用 `useId` 为多个关联元素生成 ID：

```jsx
import React, { useId } from "react";

function SignupForm() {
  // 生成基础 ID
  const formId = useId();

  // 为不同字段创建唯一 ID
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;
  const errorId = `${formId}-error`;

  const [hasError, setHasError] = React.useState(false);

  return (
    <form>
      <h2>注册账号</h2>

      {/* 使用生成的 ID 关联 label 和 input */}
      <div>
        <label htmlFor={nameId}>用户名:</label>
        <input
          id={nameId}
          type="text"
          aria-describedby={hasError ? errorId : undefined}
        />
      </div>

      <div>
        <label htmlFor={emailId}>邮箱:</label>
        <input
          id={emailId}
          type="email"
          aria-describedby={hasError ? errorId : undefined}
        />
      </div>

      <div>
        <label htmlFor={passwordId}>密码:</label>
        <input
          id={passwordId}
          type="password"
          aria-describedby={hasError ? errorId : undefined}
        />
      </div>

      {/* 错误信息区域，使用 aria-describedby 关联 */}
      {hasError && (
        <div id={errorId} role="alert" style={{ color: "red" }}>
          请检查表单填写是否正确
        </div>
      )}

      <button type="submit">注册</button>
    </form>
  );
}

export default SignupForm;
```

## 注意事项

- useId 不是为列表项生成 keys 设计的，列表项的 key 应该基于数据生成
- useId 在每次渲染时会返回相同的 ID，所以不要期望每次调用都获得新的 ID
- 生成的 ID 包含 ":" 字符，这是有意设计的，以确保其唯一性
