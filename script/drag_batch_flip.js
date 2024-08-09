/**
 * Function 面向对象封装flip动画
 * FLIP动画技术，就是只利用transform 或 opacity模拟布局变动的技巧，
 * 因为它不触发Layout，所以动画比较丝滑。 FLIP是 First, Last, Invert, Play的简称。
 * dom动画对象：elements cubic-bezier(0,0,0.32,1)
 * 动画配置对象：options = {duration: 0.3, easing: 'ease-in-out' }
*/
function CustomFlip (element_list = [], options = { duration: 300, easing: 'cubic-bezier(0,0,0.32,1)' }) {
    this.elemetns = Array.from(element_list)
    this.origins = []
    this.option = options
    this.firstPosition = []
    this.lastPosition = []
}

// Play 真正需要执行动画时，将 transform 置为 None.
CustomFlip.prototype.play = function () {
    this.invert()
}

// First 对应动画的Start阶段，用 element.getBoundingClientRect()记录初始位置。
CustomFlip.prototype.first = function (firstDoms = []) {
    this.elemetns = Array.from(firstDoms)
    this.firstPosition = this.getElementRect()
}

// Last 对应动画的End阶段，先执行触发layout变动的代码，记录元素的终止位置。
CustomFlip.prototype.last = function (lastDoms = []) {
    this.elemetns = this.origins = Array.from(lastDoms)
    this.lastPosition = this.getElementRect()
}

// Invert 现在元素处于End位置，利用 transform 做一个逆运算，让添加了 transform 的元素回归到初始位置。
CustomFlip.prototype.invert = function () {
    // 获取每个元素的first和last位置的偏差
    const differencePosition = this.firstPosition.map((First, index) => {
        const Last = this.lastPosition[index]
        return {
            left: First.left - Last.left,
            top: First.top - Last.top,
            scale: First.width / Last.width
        }
    })
    // web animation api animate 
    this.origins.forEach((el, index) => {
        const { left, top, scale } = differencePosition[index]
        el.animate(
            [
                {
                    transform: `
                        translateX(${left}px)
                        translateY(${top}px)
                        scale(${Math.floor(scale)})
                    `
                },
                {
                    transform: `
                    translateX(0)
                    translateY(0)
                    scale(1)
                    `
                }
            ],
            {
                duration: 1000,
                easing: "cubic-bezier(0.2, 0, 0.2, 1)"
            }
        );
    })
}

// 记录元素的初始位置，通过getBoundingClientRect方法获取每个对象的属性，包括left，width，height，top
CustomFlip.prototype.getElementRect = function () {
    return this.elemetns.map(el => el.getBoundingClientRect())
}