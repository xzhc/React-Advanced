# CSS-in-JS

CSS-in-JS 是一种将 CSS 样式直接在 JavaScript 代码中编写的技术方案，它允许开发者在同一个文件中管理组件的结构、行为和样式，从而实现真正的组件封装。

## 什么是 CSS-in-JS？

CSS-in-JS 是一系列解决方案的总称，而不是特定的一个库。它的核心理念是将 CSS 样式直接嵌入到 JavaScript 代码中，通常与 React、Vue 等组件化框架结合使用。代表性的库包括：

- Styled Components
- Emotion
- JSS
- Aphrodite
- Styled JSX

这些库的实现方式各有不同，但都遵循相同的基本原则：在 JavaScript 中定义样式，并将其应用到组件。

## 怎么用？

以最流行的 Styled Components 为例：

### 安装

```bash
npm install styled-components
```

### 基本使用

```jsx
import styled from "styled-components";

// 创建一个带样式的 button 组件
const Button = styled.button`
  background-color: ${(props) => (props.primary ? "#0077ff" : "white")};
  color: ${(props) => (props.primary ? "white" : "#0077ff")};
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid #0077ff;
  border-radius: 3px;
  cursor: pointer;
`;

// 在 React 组件中使用
function App() {
  return (
    <div>
      <Button>普通按钮</Button>
      <Button primary>主要按钮</Button>
    </div>
  );
}
```

### 高级用法

1. **继承样式**

```jsx
const TomatoButton = styled(Button)`
  color: tomato;
  border-color: tomato;
`;
```

2. **全局样式**

```jsx
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      {/* 其他组件 */}
    </>
  );
}
```

3. **主题支持**

```jsx
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    primary: "#0077ff",
    secondary: "#ff4081",
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 组件可以访问主题 */}
      <StyledComponent />
    </ThemeProvider>
  );
}

const StyledComponent = styled.div`
  color: ${(props) => props.theme.colors.primary};
`;
```

## 为什么要用 CSS-in-JS？

### 优势

1. **组件封装**：CSS 和组件逻辑放在一起，增强了组件的独立性和可复用性。

2. **消除全局命名空间冲突**：每个组件的样式是隔离的，不会污染全局 CSS。

3. **动态样式**：可以基于 props、状态或主题动态生成样式。

4. **自动添加浏览器前缀**：许多 CSS-in-JS 库会自动为需要的 CSS 属性添加浏览器前缀。

5. **代码分割**：只加载当前页面组件需要的样式，而不是整个应用的样式。

6. **开发体验**：在同一个文件中处理逻辑和样式，减少上下文切换。

### 应用场景

1. **大型 React/Vue 项目**：可维护性和可扩展性至关重要的场景。

2. **组件库开发**：需要高度封装和可复用的组件。

3. **需要动态主题和样式的应用**：如支持用户自定义主题的应用。

4. **微前端架构**：不同团队开发的组件需要样式隔离。

5. **需要 JavaScript 和 CSS 深度集成的场景**：如基于复杂状态的样式变化。

## 示例代码：构建一个主题切换卡片组件

以下是一个使用 Emotion（另一个流行的 CSS-in-JS 库）构建的可切换主题的卡片组件示例：

```jsx
import React, { useState } from "react";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";

// 定义主题
const themes = {
  light: {
    background: "#ffffff",
    text: "#333333",
    border: "#dddddd",
    shadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  dark: {
    background: "#2d2d2d",
    text: "#f5f5f5",
    border: "#444444",
    shadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
  },
};

// 创建样式化组件
const CardContainer = styled.div`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
  width: 300px;
  box-shadow: ${(props) => props.theme.shadow};
  transition: all 0.3s ease;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.text};
  color: ${(props) => props.theme.background};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h2`
  margin-top: 0;
  border-bottom: 1px solid ${(props) => props.theme.border};
  padding-bottom: 10px;
`;

// 卡片组件
function ThemeCard() {
  const [currentTheme, setCurrentTheme] = useState("light");

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "light" ? "dark" : "light");
  };

  return (
    <CardContainer theme={themes[currentTheme]}>
      <Title theme={themes[currentTheme]}>CSS-in-JS 示例</Title>
      <p>这是一个使用 Emotion 构建的主题切换卡片。</p>
      <p>当前主题: {currentTheme}</p>
      <Button theme={themes[currentTheme]} onClick={toggleTheme}>
        切换到 {currentTheme === "light" ? "暗色" : "亮色"} 主题
      </Button>
    </CardContainer>
  );
}

export default ThemeCard;
```

## 注意事项和挑战

1. **学习成本**：需要学习特定 CSS-in-JS 库的 API 和模式。

2. **性能考量**：在某些情况下，可能会有轻微的性能开销。

3. **SSR 支持**：不同库对服务器端渲染的支持程度不同。

4. **开发工具支持**：相比纯 CSS，某些 IDE 功能（如语法高亮、自动完成）可能受限。

CSS-in-JS 是现代前端开发中的重要工具，特别适合组件化开发范式。选择是否使用它应该基于项目需求、团队经验和应用场景。
