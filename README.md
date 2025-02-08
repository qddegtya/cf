<h1 align="center">
  <br>
	<img width="128" src="media/logo.png" alt="cf">
  <br>
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

# 特性

- 🎯 **引导式开发** - 交互式创建和添加命令，告别繁琐的手动配置
- 🔌 **强大的钩子系统** - 灵活的插件架构，支持异步钩子
- 🎨 **现代化架构** - 采用现代 JavaScript 特性和最佳实践
- 🚀 **易于扩展** - 以最小的样板代码创建和注入自定义命令
- 📦 **零配置** - 开箱即用的合理默认配置
- 🛠️ **自举实现** - 框架本身就是最好的示例代码

# 快速开始

```bash
# 安装框架
$ npm install -g @atools/cf

# 创建新的 CLI 项目
$ mkdir my-cli && cd my-cli
$ npm init -y

# 添加依赖
$ npm install @atools/cf --save

# 初始化项目（即将支持）
$ cf init

# 添加新命令
$ cf add -o commands -t node_modules/@atools/cf/_template/cmd.tpl
```

## 添加命令

使用内置的 `add` 命令可以快速创建新的命令模块：

```bash
$ cf add -o commands -t node_modules/@atools/cf/_template/cmd.tpl

[CF] -> command name: hello
[CF] -> command alias: h
[CF] -> command description: Say hello to someone
```

这将自动创建如下命令文件 `commands/hello/index.js`：

```javascript
const { BC } = require('@atools/cf');

class Hello extends BC {
  init(commander) {
    // 在这里配置命令选项
    commander
      .option('-n, --name <name>', '要问候的名字');
  }

  async do() {
    const { name = '世界' } = this.config;
    console.log(`你好, ${name}!`);
  }
}

Hello.command = 'hello'
Hello.alias = 'h'
Hello.description = 'Say hello to someone'

module.exports = Hello;
```

## 高级用法

### 钩子系统

框架提供了强大的钩子系统用于扩展功能：

```javascript
const { bootstrap } = require('@atools/cf');

// 可用的钩子：
// - will-inject: 在命令模块注入之前
// - will-parse: 在 CLI 引擎启动之前

bootstrap.hooks.tap('will-inject', async (next) => {
  // 添加你的自定义逻辑
  console.log('正在注入命令...');
  await next();
});
```

### 启动和配置

```javascript
const { bootstrap } = require('@atools/cf');

// 初始化 CLI 应用
const app = await bootstrap({
  root: path.join(__dirname, 'commands'), // 命令目录路径
  version: '1.0.0'                        // CLI 版本号
});

// CLI 会自动扫描并注入 commands 目录下的所有命令
```

## API 参考

### BaseCommand

用于创建 CLI 命令的基类：

- `static command`: 命令名称（必需）
- `static alias`: 命令别名（可选）
- `static description`: 命令描述（可选）
- `init(commander)`: 配置命令选项
- `do()`: 执行命令逻辑

### Bootstrap 选项

```javascript
bootstrap({
  cli: commander,    // 自定义的 Commander 实例（可选）
  root: __dirname,   // 命令发现的根目录
  version: '1.0.0'   // CLI 版本
})
```
