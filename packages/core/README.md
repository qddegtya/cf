# @atools/cf-core

CF Framework 的核心功能包，提供基础命令系统和钩子系统。

## 安装

```bash
npm install @atools/cf-core
# 或
yarn add @atools/cf-core
# 或
pnpm add @atools/cf-core
```

## 特性

- 🎯 **命令系统** - 基于类的命令定义，简洁优雅
- 🔌 **钩子系统** - 支持异步钩子和中间件
- 🎨 **现代化** - 使用最新的 JavaScript 特性
- 📦 **轻量级** - 核心功能无冗余代码

## 基本使用

### 创建命令

```javascript
const { BaseCommand } = require('@atools/cf-core');

class MyCommand extends BaseCommand {
  constructor(config) {
    super(config);
  }

  // 配置命令选项
  init(commander) {
    commander
      .option('-n, --name <name>', '选项描述');
  }

  // 实现命令逻辑
  async do() {
    const { name } = this.config;
    // 使用 this.context 访问上下文
    const { env, cwd } = this.context;
    // 实现你的命令逻辑
  }
}
```

### 使用 Bootstrap

```javascript
const { bootstrap } = require('@atools/cf-core');

// 注册钩子
bootstrap.hooks.tap('will-inject', async (next) => {
  // 在命令注入前执行
  console.log('will-inject');
  await next();
});

// 启动应用
bootstrap({
  root: 'path/to/commands',  // 命令目录
  version: '1.0.0'          // 版本号
});
```

## API 参考

### BaseCommand

基础命令类，提供以下功能：

#### 属性
- `config` - 命令配置对象
- `context` - 命令上下文，包含：
  - `env` - 环境变量
  - `cwd` - 当前工作目录
- `helper` - 辅助工具对象

#### 方法
- `constructor(config)` - 构造函数，接收配置对象
- `setup()` - 初始化命令上下文
- `init(commander)` - 配置命令选项
- `do()` - 实现命令逻辑
- `action()` - 执行命令（内部使用）

### bootstrap

启动函数，用于初始化 CLI 应用：

```javascript
bootstrap({
  root: string,    // 命令目录路径
  version: string  // CLI 版本号
});
```

#### hooks
- `will-inject` - 在命令注入前执行
- `will-parse` - 在命令注入前执行

## 贡献

欢迎提交 issue 和 PR！

## 许可证

MIT
