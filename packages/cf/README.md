# @atools/cf

CF Framework 的主应用包，提供完整的命令行工具和模板系统。

## 安装

```bash
npm install @atools/cf
# 或
yarn add @atools/cf
# 或
pnpm add @atools/cf
```

## 特性

- 🎯 **命令行工具** - 提供完整的命令行界面
- 📝 **模板系统** - 内置模板，快速创建新命令
- 🎨 **优雅设计** - 简洁的 API 设计，易于使用

## 基本使用

### add 命令

`add` 命令是框架最重要的功能之一，用于快速创建新的命令模块：

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

支持的选项：
- `-o, --output <path>`: 输出目录，默认为 `commands`
- `-t, --template <path>`: 模板文件路径，默认使用内置模板

生成的命令文件示例（`commands/hello/index.js`）：

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

### 创建命令

你也可以直接创建命令类：

```javascript
const { BaseCommand } = require('@atools/cf-core');

class MyCommand extends BaseCommand {
  constructor(config) {
    super(config);
  }

  init(commander) {
    commander
      .option('-n, --name <name>', '选项描述');
  }

  async do() {
    const { name } = this.config;
    // 实现你的命令逻辑
  }
}

MyCommand.command = 'my-command';
MyCommand.alias = 'mc';
MyCommand.description = '命令描述';

module.exports = MyCommand;
```

## 命令状态

| 命令 | 状态 | 描述 |
|------|------|------|
| `add` | ✅ 可用 | 添加新命令 |
| `ui` | 🚧 开发中 | 交互式 UI |
| `init` | 🚧 开发中 | 项目初始化 |
| `remove` | 🚧 开发中 | 移除命令 |

## 版本说明

当前版本：2.0.0

这是一个重大版本更新，作为 CF Framework monorepo 重构的一部分发布。主要变化：

- 核心功能已移至 `@atools/cf-core`
- 改进了模板系统
- 优化了包体积

### 从 1.x 升级

如果你正在使用 1.x 版本，需要使用我们的迁移 🔧 工具


```bash
# 升级到最新版本
npm install @atools/cf@latest
```

## 贡献

欢迎提交 issue 和 PR！请查看项目根目录的贡献指南。

## 许可证

MIT © [CF Team]
