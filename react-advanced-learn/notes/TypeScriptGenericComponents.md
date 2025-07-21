# TypeScript Generic Components

## 什么是 TypeScript Generic Components？

TypeScript 泛型组件是指那些能够接受类型参数的 React 组件，使组件能够适应不同的数据类型而保持类型安全。泛型允许我们创建可重用的组件，这些组件可以处理各种不同类型的数据，同时保持完整的类型检查和自动补全功能。

## 为什么要使用泛型组件？

1. **类型安全** - 确保在不同数据类型间保持一致性，避免运行时错误
2. **代码复用** - 创建能处理多种数据类型的通用组件
3. **更好的开发体验** - 提供更准确的自动补全和类型提示
4. **减少重复代码** - 避免为不同数据类型创建多个相似组件
5. **自我文档化** - 泛型参数使组件的用途和预期输入更加明确

## 如何使用泛型组件？

### 基本语法

```tsx
// 定义泛型组件
function GenericComponent<T>(props: { item: T; callback: (item: T) => void }) {
  // 组件实现
}

// 使用泛型组件
<GenericComponent<string>
  item="Hello"
  callback={(item) => console.log(item)}
/>;
```

### 使用 React.FC 的语法

```tsx
import React from "react";

interface GenericComponentProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const GenericComponent = <T,>({
  items,
  renderItem,
}: GenericComponentProps<T>): React.ReactElement => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
};
```

## 应用场景

1. **数据列表组件** - 可以显示任何类型的数据集合
2. **表单组件** - 处理不同类型的表单数据
3. **选择器组件** - 如下拉菜单，可以选择不同类型的选项
4. **数据获取钩子** - 创建能处理不同数据类型的自定义 hooks
5. **状态管理** - 在 Context 或状态管理解决方案中使用泛型
6. **高阶组件(HOC)** - 创建能够包装任何组件并增强其功能的 HOC

## 示例：通用列表组件

下面是一个泛型列表组件的完整示例，可以用来显示任何类型的数据：

```tsx
import React from "react";

// 定义泛型接口
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
}

// 泛型组件定义
export const GenericList = <T,>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = "没有可显示的项目",
}: ListProps<T>): React.ReactElement => {
  // 如果列表为空，显示空消息
  if (items.length === 0) {
    return <div className="empty-list">{emptyMessage}</div>;
  }

  return (
    <ul className="generic-list">
      {items.map((item, index) => (
        <li
          key={keyExtractor ? keyExtractor(item, index) : index.toString()}
          className="list-item"
        >
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
};

// 使用示例 - 用户列表
interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const users: User[] = [
    { id: 1, name: "张三", email: "zhangsan@example.com" },
    { id: 2, name: "李四", email: "lisi@example.com" },
    { id: 3, name: "王五", email: "wangwu@example.com" },
  ];

  return (
    <div>
      <h2>用户列表</h2>
      <GenericList<User>
        items={users}
        keyExtractor={(user) => user.id.toString()}
        renderItem={(user) => (
          <div>
            <strong>{user.name}</strong>
            <p>{user.email}</p>
          </div>
        )}
      />
    </div>
  );
};

// 使用示例 - 产品列表
interface Product {
  sku: string;
  title: string;
  price: number;
}

const ProductList: React.FC = () => {
  const products: Product[] = [
    { sku: "P001", title: "笔记本电脑", price: 5999 },
    { sku: "P002", title: "智能手机", price: 3999 },
    { sku: "P003", title: "无线耳机", price: 999 },
  ];

  return (
    <div>
      <h2>产品列表</h2>
      <GenericList<Product>
        items={products}
        keyExtractor={(product) => product.sku}
        renderItem={(product) => (
          <div>
            <strong>{product.title}</strong>
            <p>¥{product.price}</p>
          </div>
        )}
      />
    </div>
  );
};
```

## 高级技巧

### 泛型约束

你可以限制泛型参数必须符合特定条件：

```tsx
// T 必须有 id 属性
interface GenericProps<T extends { id: string | number }> {
  item: T;
}

const GenericComponent = <T extends { id: string | number }>({
  item,
}: GenericProps<T>) => {
  return <div>{`ID: ${item.id}`}</div>;
};
```

### 多个泛型参数

组件可以接受多个泛型参数：

```tsx
interface MapperProps<T, U> {
  items: T[];
  mapFunction: (item: T) => U;
  renderItem: (item: U) => React.ReactNode;
}

const Mapper = <T, U>({
  items,
  mapFunction,
  renderItem,
}: MapperProps<T, U>) => {
  const mappedItems = items.map(mapFunction);

  return (
    <div>
      {mappedItems.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
};
```

### 默认泛型类型

你可以为泛型参数提供默认类型：

```tsx
interface DefaultGenericProps<T = string> {
  value: T;
  onChange: (value: T) => void;
}

const DefaultGenericComponent = <T = string,>({
  value,
  onChange,
}: DefaultGenericProps<T>) => {
  // 实现...
};
```

## 总结

TypeScript 泛型组件是创建灵活、可重用且类型安全的 React 组件的强大工具。通过使用泛型，我们可以构建能够处理各种数据类型的组件，同时保持完整的类型检查和开发体验。泛型组件特别适用于创建通用 UI 元素、数据容器和高阶组件，使我们的代码更加干净、可维护且类型安全。
