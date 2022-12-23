## 开发笔记

基于https://github.com/maxieluan/react-browser-extension-boilerplate，但有若干改动。后续会同步过去。

### 2022-12-23 第一版
#### 一堆问题:
1. 性能问题，不能把extension当作一般的web应用，浏览器会给extension非常大的性能限制。
2. react绝对不能用，太大了，preact可以，但是还是很大，dependency array稍微多一点就会出现性能问题
3. 尽量用静态的实现，不要搞动态效果，没有意义。
4. 尽量还是用原生api吧。

#### 一点点笔记：
1. 如何输出log
就用正常的`console.log`输出就行，不过不会输出在devtool的console里，而是在devtool panel的console里。
2. 工作流程：
* 写代码
* build
* 浏览器extension页面重新加载
* 测试页面重新打开devtools

#### roadmap
先用preact把第一版功能做出来。然后再考虑用其他的库重构。
