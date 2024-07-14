export default class BasicQueue {
    constructor(name = '_default_') {
        this.name = name

        this.elementStore = {}

        this.elementIndex = 1

        this.frontKeyList = []
        this.backKeyList = []
    }

    add(element) {
        const key = this._generateKey()

        this.elementStore[key] = element

        this.backKeyList.push(key)
    }

    pop() {
        if (this.frontKeyList.length === 0) {
            while (this.backKeyList.length > 0) {
                this.frontKeyList.push(this.backKeyList.pop())
            }
        }

        const key = this.frontKeyList.pop()

        return this.elementStore[key]
    }

    size() {
        return this.frontKeyList.length + this.backKeyList.length
    }

    isEmpty() {
        return this.size() === 0
    }

    getElementByPosition(position, throwOutOfBoundsError = true) {
        if (position < 0 || position >= this.size()) {
            if (throwOutOfBoundsError) throw new Error('position out of bounds')
        }

        if (this.frontKeyList.length === 0) {
            const key = this.backKeyList[position]

            return this.elementStore[key]
        }

        if (position < this.frontKeyList.length) {
            const key = this.frontKeyList[this.frontKeyList.length - (1 + position)]

            return this.elementStore[key]
        }

        const key = this.backKeyList[this.frontKeyList.length - position]

        return this.elementStore[key]
    }

    forEach(callbackFn) {
        for (let i = 0; i < this.size(); i++) {
            callbackFn(this.getElementByPosition(i))
        }
    }
    
    [Symbol.iterator]() {
        let index = 0
        
        return {
            next: () => {
                return {
                    value: this.getElementByPosition(index++, false),
                    done: index > this.size()
                }
            }
        }
    }
    
    _generateKey() {
        return `${this.name}:element-${this.elementIndex++}`
    }
}