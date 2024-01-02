class FlipAnimate {
    constructor (els, options = {duration: 0.5, easing: 'ease-in-out' }) {
        this.els = Array.from(els)
        this.option = options
        this.firstPositon = []
        this.lastPositon = []
        this.first()
    }
    
    
    play () {
        this.last()
        this.invert()
    }
    invert () {
        // 计算每个元素的start和end位置的偏差
        const relativePositions = this.firstPositon.map((elStartPosition, index) => {
            const elEndPosition = this.lastPositon[index]
            return {
                left: elStartPosition.left - elEndPosition.left,
                top: elStartPosition.top - elEndPosition.top
            }
        })
        // 这一步是将元素移动到初始值
        this.els.forEach((el, index) => {
            const { left, top } = relativePositions[index]
            el.style.transition = `none`
            el.style.transform = `translate(${left}px, ${top}px)`

        })
        // 这一步是将初始位置的元素（此时dom位置已经发生变化了）回到真实的dom位置
        requestAnimationFrame(() => {
            this.els.forEach((el, index) => {
                el.style.transition = `transform ${this.option.duration}s ${this.option.easing}`
                el.style.transform = `none`
            })
        })
        
    }
    first () {
        this.firstPositon = this.getPositon()
    }

    last () {
        this.lastPositon = this.getPositon()
    }
    // 记录元素的初始位置				
    getPositon () {
        return this.els.map(el => el.getBoundingClientRect())
    }
}