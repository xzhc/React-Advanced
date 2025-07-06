# DialogModal 组件数据流

## 组件架构概述

DialogModal 组件是对原生 HTML `<dialog>` 元素的 React 封装，通过 React 状态和 DOM API 的双向绑定，实现了声明式的对话框控制。

## 数据流程图

```mermaid
graph TD
    A[用户交互] -->|点击打开按钮| B[React 状态更新]
    B -->|isOpen = true| C[useEffect 检测状态变化]
    C -->|执行 showModal()| D[DOM 更新: 对话框显示]

    E[用户交互] -->|点击关闭按钮| F[React 状态更新]
    F -->|isOpen = false| G[useEffect 检测状态变化]
    G -->|执行 close()| H[DOM 更新: 对话框关闭]

    I[用户交互] -->|按下 Esc 键| J[浏览器原生行为]
    J -->|自动关闭对话框| K[DOM 触发 close 事件]
    K -->|事件监听器捕获| L[执行 onClose 回调]
    L -->|setIsOpen(false)| F
```

## 开启对话框流程

### React → DOM 方向

1. **用户点击"Show Dialog Modal"按钮**

   ```jsx
   <button onClick={() => setIsDialogModalOpen(true)}>Show Dialog Modal</button>
   ```

2. **React 状态更新**

   - `setIsDialogModalOpen(true)` 执行
   - React 重新渲染组件

3. **DialogModal 组件接收新的 props**

   ```jsx
   <DialogModal
     isOpen={isDialogModalOpen}
     onClose={() => setIsDialogModalOpen(false)}
   />
   ```

   **关于 props 接收与执行的澄清**:

   - DialogModal 组件同时接收 `isOpen` 和 `onClose` 两个 props
   - 此时仅接收这些值，但 **不会自动执行** `onClose` 函数
   - `onClose` 函数仅被传递，只在特定条件下才会被调用:
     - 用户按下 Esc 键触发 DOM "close" 事件时
     - 对话框内的关闭按钮被点击时
   - React 组件接收所有传入的 props，但函数类型的 props 不会被自动执行

4. **第一个 useEffect 触发**

   ```jsx
   useEffect(() => {
     const dialog = dialogRef.current;
     if (dialog == null) return;

     if (isOpen) {
       // 此时 isOpen 为 true
       dialog.showModal(); // 调用原生方法打开对话框
     } else {
       dialog.close();
     }
   }, [isOpen]);
   ```

   - 检测到 isOpen 从 false 变为 true
   - 获取 dialogRef 引用的实际 DOM 元素
   - 调用原生 `showModal()` 方法
   - 浏览器显示对话框

## 关闭对话框流程

### 方式一：通过按钮关闭 (React → DOM)

1. **用户点击对话框内的"Close"按钮**

   ```jsx
   <button onClick={() => setIsDialogModalOpen(false)}>Close</button>
   ```

2. **React 状态更新**

   - `setIsDialogModalOpen(false)` 执行
   - React 重新渲染组件

3. **DialogModal 组件接收新的 props**

   - isOpen 现在为 false

4. **第一个 useEffect 再次触发**
   ```jsx
   useEffect(() => {
     // ...
     if (isOpen) {
       // 此时 isOpen 为 false
       dialog.showModal();
     } else {
       dialog.close(); // 调用原生方法关闭对话框
     }
   }, [isOpen]);
   ```

### 方式二：通过 Esc 键关闭 (DOM → React)

1. **用户按下 Esc 键**

   - 浏览器原生行为触发 dialog 关闭
   - dialog 元素发出 "close" 事件

2. **第二个 useEffect 中的事件监听捕获事件**

   ```jsx
   useEffect(() => {
     const dialog = dialogRef.current;
     if (dialog == null) return;

     dialog.addEventListener("close", onClose); // 添加事件监听
     return () => {
       dialog.removeEventListener("close", onClose);
     };
   }, [onClose]);
   ```

3. **onClose 回调执行**

   ```jsx
   onClose={() => setIsDialogModalOpen(false)}
   ```

   - 调用 `setIsDialogModalOpen(false)`
   - React 状态更新
   - React 重新渲染组件

4. **第一个 useEffect 匹配新状态**
   - isOpen 现在为 false，但 dialog 已经关闭了
   - 状态与 DOM 保持一致

## 为什么需要两个 useEffect?

1. **第一个 useEffect** - 从 React 到 DOM 的同步

   - 将 React 的声明式状态转换为 DOM 的命令式方法调用
   - 监听 `isOpen` 状态变化并执行相应的 DOM 操作

2. **第二个 useEffect** - 从 DOM 到 React 的同步
   - 监听原生 DOM 事件并更新 React 状态
   - 确保当 DOM 状态发生变化时，React 状态也随之更新

这种双向同步机制确保了无论状态变化的来源是 React 还是 DOM，两者都能保持一致，提供可靠的用户体验。
