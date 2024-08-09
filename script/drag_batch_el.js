window.onload = function () {
    const parent = document.getElementById("box");
    const body = document.body;
    // 获取大盒子下的所有可选中的子元素
    const childrenList = parent.querySelectorAll(".column");
    const mask = document.querySelector(".draw-selection");
    // 拖拽盒子
    const drag_box = document.querySelector(".drag-box")
    drag_box.style.opacity = 0

    // 配置flip动画
    const flip = new CustomFlip()

    var selectList = []
    let startTop = 0, 
        endTop = 0, 
        startLeft = 0, 
        endLeft = 0;
        isDragging = false;
    var firstRect, lastRect, drag, offsetX=0, offsetY=0;

    // 绑定子集事件
    const newItems = Array.from(childrenList)
    for (let i = 0; i < newItems.length; i++) {
        const el = newItems[i];
        el.onmouseup = function (evt) {
            evt.preventDefault()
            evt.stopPropagation()
            if (evt.button !== 0) return;
        }
        el.onclick = function (evt) {
            evt.preventDefault()
            evt.stopPropagation()            
        }
    }

    updateState('selected', 'data-state', parent)

    // 父元素parent操作
    parent.onclick = function (evt) {
        evt.preventDefault()
        evt.stopPropagation()
        // 恢复初始值
        childrenList.forEach(el => updateState('', 'data-state', el))
        selectList = []
        isDragging = false
        
    }

    // 绘制选择区域
    body.onmousedown = function (evt) {
        evt.preventDefault()
        // 只有鼠标左键可以触发遮罩层
        if (evt.button !== 0) return;
        // 检测鼠标拖拽对象是否被选中，如果选中，则拖拽
        const className = evt.target.className
        // 批量元素拖拽控制
        const state = evt.target.parentNode.getAttribute('data-state')
        if (className==='column'&&state==='selected') {
            updateState('dragging', 'data-state', parent)
            isDragEvent(evt)
            isDragging = true
        }
        
        body.addEventListener("mousemove", getMousePosition);
        startTop = evt.y - body.offsetTop;
        startLeft = evt.x - body.offsetLeft;
    }
    body.onmouseup = function (evt) {
        evt.preventDefault()
        evt.stopPropagation()
        if (evt.button !== 0) return;
        // console.log(selectList);
        resetPosition();
        isDragging = false
        parent.style.pointerEvents = "auto"
        isDragEnd(evt)
    }

    // 鼠标移动触发
    function getMousePosition(evt) {
        parent.style.pointerEvents = "none"

        // 拖拽事件
        if (isDragging) {
            isDragMove(evt)
            return
        }

        // 正在框选
        updateState('selecting', 'data-state', parent)

        // 获取遮罩层位置信息
        const maskPosition = mask.getBoundingClientRect();
        // 鼠标移动触发时，先清空数据
        selectList = [];

        for (let i = 0; i < childrenList.length; i++) {
            // 获取每个子元素的位置信息
            const { left, top, right, bottom } = childrenList[i].getBoundingClientRect();
            if (
                right > maskPosition.left &&
                bottom > maskPosition.top &&
                left < maskPosition.right &&
                top < maskPosition.bottom
            ) {
                updateState('selected', 'data-state', childrenList[i].parentNode)
                // 获取选中的子元素索引
                selectList.push(i+1);
            } else {
                updateState('', 'data-state', childrenList[i].parentNode)
            }
        }

        // 获取移动中的鼠标位置
        endTop = evt.y - body.offsetTop;
        endLeft = evt.x - body.offsetLeft;
        // 设置遮罩层的位置
        const maskTop = Math.min(startTop, endTop);
        const maskLeft = Math.min(startLeft, endLeft);

        // 计算遮罩层宽高
        const maskWidth = Math.abs(startLeft - endLeft);
        const maskHeight = Math.abs(startTop - endTop);
       
        styleVars({
            mx1: maskLeft,
            my1: maskTop,
            maskW: maskWidth,
            maskH: maskHeight,
            opacity: 1,
            useSelect: 'none'
        })
    }

    // 利用flip动画技术拖拽元素
    function isDragMove (evt) {
        // console.log('拖拽数据:', firstRect, drag.innerHTML);
        // console.log(`鼠标坐标：X:${evt.clientX}，Y:${evt.clientY}`);

        // 批量拖拽
        if (!drag_box.innerHTML) return;
        drag_box.style.opacity = 1
        drag_box.style.position = "absolute"
        drag_box.style.left = `${evt.clientX - offsetX}px`
        drag_box.style.top = `${evt.clientY - offsetY}px`
    }
    function isDragEvent(evt) {
        // 置空子元素
        drag_box.innerHTML = ""
        // 拖拽事件，需要将选中元素添加到拖拽列表内
        const childrens = Array.from(parent.querySelectorAll('[data-state="selected"]'))
        childrens.forEach(el => {
            el.querySelector('.column').style.opacity = 0
            const clone = el.cloneNode(true)
            clone.querySelector('.column').style.opacity = 1
            drag_box.appendChild(clone)
        })
        // 获取last状态
        flip.last(childrens)
        // console.log('拖拽事件:', drag_box.children);
    }
    // 鼠标拖拽结束
    function isDragEnd(evt) {
        // console.log(firstRect, lastRect);
        // 批量元素动画
        if (drag_box.children.length === 0) return
        // 获取first状态
        flip.first(drag_box.children)

        // 设置原有目标状态
        const childrens = Array.from(parent.querySelectorAll('[data-state="selected"]'))
        childrens.forEach(el => {
            el.querySelector('.column').style.opacity = 1
        })
        drag_box.innerHTML = ""
        drag_box.style.opacity = 0
        
        // 播放动画
        flip.play()
        drag_box.innerHTML = ""

    }


    // 重置鼠标选中信息
    function resetPosition() {
        // 更新状态
        updateState('selected', 'data-state', parent)
        body.removeEventListener("mousemove", getMousePosition);
        styleVars({
            opacity: 0,
            useSelect: ''
        })
        startTop = 0
        endTop = 0
        startLeft = 0
        endLeft = 0
    }

    const styleVars = (vars, el = document.documentElement) => {
        Object.keys(vars).forEach(key => {
            el.style.setProperty(`--${key}`, vars[key]);
        });
    };

    // 更新状态
    function updateState(state='ready', key="data-state", el = body){
        el.setAttribute(key, state)
    }
}