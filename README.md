## Note to myself.
1. 使用node 18 build 的话，需要设置环境变量
```bash
export NODE_OPTIONS=--openssl-legacy-provider
```
这部分不打算改，也许webpack会在18进入lts之后更新。
2. from js/jsx to html file
```js
plugins: [
    new HTMLPlugin({
      title: "test",
      chunks: ['content', 'options'],
      filename: 'test.html',
    }),
]
```
这样会用`content.js`和`options.js`生成html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>test</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body>
    <script src="options.js"></script>
    <script src="content.js"></script>
  </body>
</html>
```
也可以尝试custom template， 
```js
plugins: [
  new HtmlWebpackPlugin({
    title: 'Custom template',
    // Load a custom template (lodash by default)
    template: 'index.html'
  })
]
```
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
  </body>
</html>
```
3. localization
in `manifest.json`
```json
{
    "name": "__MSG_appName__",
    "short_name": "__MSG_appShortName__",
    "description": "__MSG_appDesc__",
}
```
variable after `__MSG__` is the key in messages.json
4. 如果需要其他library
不要动`devDependencies`里的东西，他们用来打包。可以动`dependencies`里的东西，他们是运行时实际用到的库。
5. 删除了`webpack-extension-reloader`，因为不支持v3，而且3年没更新过了。确切来说，我也不太需要这个东西。
6. `unsafe-eval` 在v3中被移除掉了，不可以用`eval()`了。
正确的用法是：
```js
chrome.scripting.executeScript
```
7. `chrome` api的使用范围
* service worker: 
```
0:"loadTimes"
1:"csi"
2:"action"
3:"dom"
4:"extension"
5:"i18n"
6:"management"
7:"permissions"
8:"runtime"
9:"storage"
10:"tabs"
11:"windows"
0:"loadTimes"
1:"csi"
2:"action"
3:"dom"
4:"extension"
5:"i18n"
6:"management"
7:"permissions"
8:"runtime"
9:"storage"
10:"tabs"
11:"windows"
```
注意，`chrome.devtools`不在这个范围内。它只能在devtools里使用。使用方法：
```html
// devtools.html
<script src="devtools.js"></script>
```
```js
// devtools.js
chrome.devtools.panels.create(
  "My Panel",
  "icon.png",
  "panel.html",
  function (panel) {
    // code invoked on panel creation
  }
);
```

8. 更多实例在: [edge developers](https://github.com/MicrosoftDocs/edge-developer/blob/main/microsoft-edge/extensions-chromium/developer-guide/devtools-extension.md)