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
<br>
</p>

# About

✨ a guided and prescriptive CLI creator.

# Feature

* 🚀 One-shot bootstrap
* ⚙ Support lifecycle mode
* 🙂 Guided and prescriptive

# Quick Start

```
$ npm install -g cf
```

# Advanced Usage

**hooks list**

* will-inject: before command module's injection
* will-parse: before cli-engine start

```javascript
bootstrap.hooks.listen('will-inject', async (next) => {
  try {
    await sleep(3000)
  } catch (error) {
    console.log(error)
  }
  
  await next();
})
```
