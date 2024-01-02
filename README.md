# 🎿FLIP动画技术栈

官网：https://aerotwist.com/blog/flip-your-animations/

​		Flip 动画原则可以让动画变为60fps动画，刚好符合web应用程序动画规范，**保证动画的流畅度和高质量视觉效果，在解决animation逐帧动画卡顿问题的同时又突显轻量级动画优势。**

​       Flip 它本质上是一个原则，而不是一个框架或库。这是一种思考动画的方式，并试图让它们对浏览器来说尽可能便宜，如果一切顺利的话，应该会转换为 60fps 动画。

获取更多前端资源：
![这是图片](./images/source.png)

### FLIP经典案例
* [random(随机布局)](https://qiunanya.github.io/css-flip/pages/random.html)
* [list-add-remove(列表增删)](https://qiunanya.github.io/css-flip/pages/list-add-remove.html)
* [box-move(移动盒子)](https://qiunanya.github.io/css-flip/pages/box-move.html)
* [list-image(图片预览)](https://qiunanya.github.io/css-flip/pages/list-image.html)


### FLIP核心思想

Flip 核心思想是把动画翻转【invert】过来，先获取元素【first】动画开始前的dom和【last】动画结束后的dom，然后动态计算【first】和【last】差值 【invert】，在【play】配置【invert】动画平滑过渡，以低成本动画播放，减少动画成本，提升动画性能。

**Flip 动画包含四个核心步骤：first（动画起始状态）、last（动画结束状态）、invert（动画倒置），play（播放动画）**。

Flip 是 first、last、invert 和play 等单词的简写。

**四个重要的状态：**

1. **first**：参与转换的元素的初始状态；
2. **last**：元素的最终状态；
3. **invert**：这是有趣的一点。你可以从第一个和最后一个元素中找出元素是如何变化的，比如说它的宽度、高度、不透明度。接下来，应用变换和不透明度更改来反转或反转它们。如果元素在第一个和最后一个之间向下移动了 90px，您将在 Y 中应用 -90px 的变换。这使得元素看起来好像它们仍然处于第一个位置，但最重要的是，它们不是。
4. **play**：打开您更改的任何属性的转换，然后删除反转更改。因为一个或多个元素处于其最终位置，所以删除变换和不透明度将使它们从人造的“第一个”位置轻松到“最后一个”位置。

### FLIP应用场景

FLIP动画一般在动画状态不明确的场景下使用，比如只知道元素的起始状态和结束状态，并不能准确知道元素具体坐标值。

### 仓库功能

这里拥有完整的FLIP动画案例，每个案例都有详细的代码注释，通俗易懂，包括卡片列表新增删除动画，图片列表，图片预览动画等等，帮助更多小伙伴快速入门FLIP动画技术栈，从原生HTML入手更容易，至于迁移到vue或者react环境，需要学习者自行构建，我们暂时没有发布任何FLIP动画NPM插件。