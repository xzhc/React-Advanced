# JavaScript Prototypes

## 什么是原型（Prototype）？

JavaScript 中的原型是一种对象链接机制，允许对象从其他对象继承属性和方法。每个 JavaScript 对象都有一个指向另一个对象的内部链接，这个被链接的对象就称为"原型"。当试图访问一个对象的属性时，如果该对象本身没有这个属性，JavaScript 引擎会尝试在对象的原型上查找，如果原型上也没有，则继续在原型的原型上查找，直到找到该属性或到达原型链的末端（通常是 `Object.prototype`）。

## 如何使用原型？

在 JavaScript 中有几种使用原型的方式：

### 1. 构造函数与原型

```javascript
// 定义构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// 在原型上添加方法
Person.prototype.greet = function () {
  return `你好，我是 ${this.name}，今年 ${this.age} 岁`;
};

// 创建实例
const person1 = new Person("张三", 30);
console.log(person1.greet()); // 输出: 你好，我是 张三，今年 30 岁
```

### 2. ES6 类语法（背后仍使用原型）

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `你好，我是 ${this.name}，今年 ${this.age} 岁`;
  }
}

const person1 = new Person("张三", 30);
console.log(person1.greet()); // 输出: 你好，我是 张三，今年 30 岁
```

### 3. Object.create() 方法

```javascript
const personProto = {
  greet() {
    return `你好，我是 ${this.name}，今年 ${this.age} 岁`;
  },
};

const person1 = Object.create(personProto);
person1.name = "张三";
person1.age = 30;
console.log(person1.greet()); // 输出: 你好，我是 张三，今年 30 岁
```

## 为什么要使用原型？

1. **内存效率**：通过将方法定义在原型上而不是每个实例中，可以节省内存空间，因为所有实例共享同一个原型对象的方法。

2. **动态扩展**：可以在运行时为所有对象实例添加新的功能。

3. **继承机制**：JavaScript 的继承是基于原型链实现的，这使得代码复用更加灵活。

4. **性能优化**：原型链查找虽然比直接属性访问慢，但比为每个实例创建方法副本要高效得多。

## 应用场景

1. **创建对象模板**：当需要创建多个具有相似结构和行为的对象时。

2. **实现继承**：在不同类型的对象之间共享功能。

3. **扩展内置对象**：为 JavaScript 内置对象如 Array、String 等添加自定义方法。

4. **框架和库的开发**：许多 JavaScript 框架和库（如 jQuery）使用原型来扩展功能。

5. **插件系统**：为应用程序提供插件机制，允许动态添加功能。

## 实例演示：构建简单的继承系统

下面是一个使用原型实现继承的完整示例：

```javascript
// 基础动物构造函数
function Animal(name) {
  this.name = name;
}

// 为所有动物添加一个通用方法
Animal.prototype.breathe = function () {
  return `${this.name} 正在呼吸`;
};

// 狗构造函数
function Dog(name, breed) {
  // 调用父构造函数
  Animal.call(this, name);
  this.breed = breed;
}

// 设置狗的原型为动物的实例，实现继承
Dog.prototype = Object.create(Animal.prototype);
// 修复构造函数指向
Dog.prototype.constructor = Dog;

// 为狗添加特有方法
Dog.prototype.bark = function () {
  return `${this.name} (${this.breed}) 汪汪叫！`;
};

// 猫构造函数
function Cat(name, color) {
  Animal.call(this, name);
  this.color = color;
}

// 设置猫的原型链
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;

// 为猫添加特有方法
Cat.prototype.meow = function () {
  return `${this.name} (${this.color}色) 喵喵叫！`;
};

// 创建实例并测试
const dog = new Dog("旺财", "金毛");
const cat = new Cat("咪咪", "橘");

console.log(dog.breathe()); // 输出: 旺财 正在呼吸
console.log(dog.bark()); // 输出: 旺财 (金毛) 汪汪叫！

console.log(cat.breathe()); // 输出: 咪咪 正在呼吸
console.log(cat.meow()); // 输出: 咪咪 (橘色) 喵喵叫！

// 验证原型链
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
console.log(cat instanceof Cat); // true
console.log(cat instanceof Animal); // true
console.log(dog instanceof Cat); // false
```

这个示例展示了如何使用原型创建继承层次结构，允许不同类型的对象共享通用功能，同时保持各自的特殊行为。
