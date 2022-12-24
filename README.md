## 开发笔记
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

### feature:
* 可选语言，用模板吧，mustache
* 可识别cookie，在request中标记，并在生成代码中加入setCookie选项
* 可识别token，在request中标记，并在生成代码中加入bear选项 __todo__
* refresh token?  __todo__
* 登录和跳转 __todo__

### 2022-12-24 第二版
#### 一堆问题:
1. css不会自动apply到动态生成的dom上，需要手动apply
```
window.getComputedStyle(document.getElementById("sidepanel")).getPropertyValue("width")
```
2. 测试某个模块
直接在脚本里run是不行的，会闹说：“不能在module外import”之类的鬼话
所以在jest里run比较好，也可以正常输出log