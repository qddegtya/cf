# CF Framework Monorepo

<h1 align="center">
  <br>
	<img width="128" src="media/logo.png" alt="cf">
  <br>
  <br>
</h1>

<p align="center">
<em>I'd rather write programs to write programs than write programs.</em>
<br>
<br>
<em>我想写的不只是程序，而且是会写程序的程序。</em>
<br>
<br>
</p>

# 关于

✨ 一个引导式的、基于类的 Node.js CLI 开发框架，具有强大的钩子系统。专为创建优雅且易维护的命令行应用而设计。有趣的是，这个框架本身就是使用自己来构建的！

## 包结构

| Package | Version | Description |
|---------|---------|-------------|
| [@atools/cf-core](./packages/core) | [![NPM Version](https://img.shields.io/npm/v/%40atools%2Fcf-core)](https://www.npmjs.com/package/@atools/cf-core) | 核心功能包，提供基础命令系统、钩子系统等 |
| [@atools/cf](./packages/cf) | [![NPM Version](https://img.shields.io/npm/v/%40atools%2Fcf)](https://www.npmjs.com/package/@atools/cf) | 主应用包，提供命令行工具和模板 |

## 重要更新

🚀 **2.0.0 版本已发布！**

在这个重大版本更新中，我们：
- 重构了项目结构，采用 monorepo 架构
- 将核心功能抽离到 `@atools/cf-core` 包
- 1.x 版本需要使用迁移 🔧 工具
- 优化了项目配置和构建流程

## 开发

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 发布新版本
pnpm release       # 正式版
pnpm release:canary # 预览版
```

# 特性

- 🎯 **引导式开发** - 交互式创建和添加命令，告别繁琐的手动配置
- 🔌 **强大的钩子系统** - 灵活的插件架构，支持异步钩子
- 🎨 **现代化架构** - 采用现代 JavaScript 特性和最佳实践
- 🚀 **易于扩展** - 以最小的样板代码创建和注入自定义命令
- 📦 **零配置** - 开箱即用的合理默认配置
- 🛠️ **自举实现** - 框架本身就是最好的示例代码

# 快速开始

## 安装

```bash
# 使用 npm
npm install @atools/cf

# 使用 yarn
yarn add @atools/cf

# 使用 pnpm
pnpm add @atools/cf
```

## 使用 add 命令

`add` 命令用于快速创建新的命令模块，支持以下选项：

- `-o, --output <path>`: 输出目录，默认为 `commands`
- `-t, --template <path>`: 模板文件路径，默认使用内置模板

```bash
# 使用默认配置
$ cf add

# 自定义输出目录
$ cf add -o custom-commands

# 自定义模板
$ cf add -t custom-template.tpl

[CF] -> command name: hello
[CF] -> command alias: h
[CF] -> command description: Say hello to someone
```

这将创建一个新的命令文件，例如 `commands/hello/index.js`：

```javascript
const { BaseCommand } = require('@atools/cf-core');

class Hello extends BaseCommand {
  constructor(config) {
    super(config);
  }

  init(commander) {
    commander
      .option('-n, --name <name>', '要问候的名字');
  }

  async do() {
    const { name = '世界' } = this.config;
    console.log(`你好, ${name}!`);
  }
}

Hello.command = 'hello';
Hello.alias = 'h';
Hello.description = 'Say hello to someone';

module.exports = Hello;
```

> **注意**：`ui`、`init` 和 `remove` 命令目前正在开发中，敬请期待！

## 基本使用

```javascript
const { BaseCommand } = require('@atools/cf-core');

class MyCommand extends BaseCommand {
  constructor(config) {
    super(config);
  }

  init(commander) {
    // 配置命令选项
  }

  async do() {
    // 实现命令逻辑
  }
}
```

## Hook 系统

CF 框架使用 `bootstrap.hooks` 提供了简单而强大的钩子系统：

```javascript
const { bootstrap } = require('@atools/cf-core');

// 注册 will-inject 钩子
bootstrap.hooks.tap('will-inject', async (next) => {
  // 在命令注入前执行的逻辑
  console.log('Command injection starting...');
  await next();
});

// 启动应用
bootstrap({
  root: path.join(__dirname, 'commands'),
  version: '1.0.0'
});
```

## 贡献

欢迎提交 issue 和 PR！

## 许可证

MIT
