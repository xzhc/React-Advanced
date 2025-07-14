# React PropTypes

## 什么是 PropTypes？

PropTypes 是 React 中的一个类型检查工具，用于验证传递给 React 组件的 props 是否符合预期的类型。它可以帮助开发者在开发过程中捕获潜在的类型错误，使代码更加健壮和可维护。PropTypes 在开发模式下会进行类型检查，在生产环境中会被自动跳过以提高性能。

## 如何使用 PropTypes？

### 1. 安装依赖

从 React 16.3.0 版本开始，`prop-types` 已经从 React 核心包中分离出来，需要单独安装：

```bash
npm install prop-types
```

### 2. 导入并使用

```jsx
import React from "react";
import PropTypes from "prop-types";

function Greeting({ name, age }) {
  return (
    <div>
      <h1>你好，{name}！</h1>
      <p>你今年 {age} 岁了。</p>
    </div>
  );
}

// 定义 props 类型
Greeting.propTypes = {
  name: PropTypes.string.isRequired, // 必须是字符串且不能为空
  age: PropTypes.number, // 必须是数字，但可以不提供
};

// 可以设置默认值
Greeting.defaultProps = {
  age: 18,
};

export default Greeting;
```

### 3. 在类组件中使用

```jsx
import React, { Component } from "react";
import PropTypes from "prop-types";

class UserProfile extends Component {
  render() {
    const { username, email, isAdmin } = this.props;

    return (
      <div>
        <h2>用户: {username}</h2>
        <p>邮箱: {email}</p>
        {isAdmin && <p>管理员权限: 是</p>}
      </div>
    );
  }
}

UserProfile.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool,
};

UserProfile.defaultProps = {
  isAdmin: false,
};

export default UserProfile;
```

## 为什么要使用 PropTypes？

1. **提早发现错误**：在开发阶段就能发现类型错误，而不是在运行时才出现问题。

2. **自文档化**：PropTypes 为组件提供了清晰的 API 文档，开发者可以快速了解组件需要什么类型的 props。

3. **增强可维护性**：当项目规模变大或多人协作时，明确的类型定义可以减少误解和错误。

4. **辅助开发工具**：许多 IDE 和编辑器可以基于 PropTypes 提供代码补全和错误提示。

5. **易于调试**：当类型不匹配时，React 会在控制台提供明确的警告信息，帮助快速定位问题。

## 可用的 PropTypes 验证器

PropTypes 提供了多种验证器来确保接收的数据是正确的：

```jsx
import PropTypes from "prop-types";

MyComponent.propTypes = {
  // 基本类型
  optionalString: PropTypes.string,
  optionalNumber: PropTypes.number,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalObject: PropTypes.object,
  optionalArray: PropTypes.array,
  optionalSymbol: PropTypes.symbol,

  // 任何可渲染的元素 (数字、字符串、元素或包含这些类型的数组)
  optionalNode: PropTypes.node,

  // React 元素
  optionalElement: PropTypes.element,

  // React 元素类型（例如 MyComponent）
  optionalElementType: PropTypes.elementType,

  // 指定特定的枚举值
  optionalEnum: PropTypes.oneOf(["News", "Photos"]),

  // 多种类型之一
  optionalUnion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  // 特定类型的数组
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // 对象中的值都为特定类型
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // 特定形状的对象
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number,
  }),

  // 严格形状的对象 (不允许额外属性)
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    age: PropTypes.number,
  }),

  // 自定义验证器
  customProp: function (props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        "无效的 `" + propName + "` 在 " + componentName + "中。验证失败。"
      );
    }
  },

  // 添加 isRequired 使属性不可为 null 或 undefined
  requiredFunc: PropTypes.func.isRequired,
  requiredAny: PropTypes.any.isRequired,
};
```

## 应用场景

1. **复杂组件**：当组件接受多种类型的 props 时，使用 PropTypes 可以清晰地定义每个 prop 的期望类型。

2. **共享组件**：对于被多个团队或开发者使用的组件，PropTypes 提供了明确的接口文档。

3. **组件库开发**：为组件库中的每个组件定义 PropTypes，使使用者能够正确使用这些组件。

4. **大型项目**：在大型项目中，PropTypes 有助于保持代码质量和一致性。

## 实例演示：构建一个使用 PropTypes 的产品卡片组件

下面是一个使用 PropTypes 验证的产品卡片组件示例：

```jsx
import React from "react";
import PropTypes from "prop-types";

function ProductCard({ product, onAddToCart, showDiscount }) {
  const { id, name, price, discount, imageUrl, stock, categories } = product;

  const discountedPrice =
    showDiscount && discount ? price - (price * discount) / 100 : price;

  return (
    <div className="product-card">
      <img src={imageUrl} alt={name} className="product-image" />
      <h3>{name}</h3>

      <div className="price-section">
        {showDiscount && discount > 0 ? (
          <>
            <span className="original-price">¥{price.toFixed(2)}</span>
            <span className="discount-price">
              ¥{discountedPrice.toFixed(2)}
            </span>
            <span className="discount-badge">-{discount}%</span>
          </>
        ) : (
          <span className="price">¥{price.toFixed(2)}</span>
        )}
      </div>

      <div className="categories">
        {categories.map((category) => (
          <span key={category} className="category-tag">
            {category}
          </span>
        ))}
      </div>

      <button onClick={() => onAddToCart(id)} disabled={stock === 0}>
        {stock > 0 ? "加入购物车" : "缺货"}
      </button>

      {stock < 5 && stock > 0 && (
        <p className="stock-warning">库存紧张，仅剩 {stock} 件</p>
      )}
    </div>
  );
}

// 详细的 PropTypes 定义
ProductCard.propTypes = {
  // 产品对象必须有特定的形状
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number,
    imageUrl: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,

  // 添加到购物车的回调函数
  onAddToCart: PropTypes.func.isRequired,

  // 是否显示折扣价格
  showDiscount: PropTypes.bool,
};

// 默认值
ProductCard.defaultProps = {
  showDiscount: true,
};

export default ProductCard;
```

使用示例：

```jsx
// 父组件使用 ProductCard
function ProductList() {
  const products = [
    {
      id: 1,
      name: "超级舒适椅",
      price: 599,
      discount: 15,
      imageUrl: "/images/chair.jpg",
      stock: 8,
      categories: ["家具", "办公"],
    },
    {
      id: 2,
      name: "专业编程键盘",
      price: 899,
      discount: 0,
      imageUrl: "/images/keyboard.jpg",
      stock: 3,
      categories: ["电子", "办公"],
    },
    {
      id: 3,
      name: "超大显示器",
      price: 1299,
      discount: 10,
      imageUrl: "/images/monitor.jpg",
      stock: 0,
      categories: ["电子", "办公"],
    },
  ];

  const handleAddToCart = (productId) => {
    console.log(`添加产品 ${productId} 到购物车`);
    // 购物车逻辑...
  };

  return (
    <div className="product-list">
      <h2>热门产品</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            showDiscount={true}
          />
        ))}
      </div>
    </div>
  );
}
```

这个示例展示了如何使用 PropTypes 为一个产品卡片组件定义清晰的 props 接口，包括复杂的嵌套对象结构、必填字段验证和默认值设置。
