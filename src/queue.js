import BasicQueue from "./basic-queue.js"

export default class Queue {
    constructor() {
        this.defaultGroupId = '$_default_$'

        this.groupedDeques = {
            [this.defaultGroupId]: new BasicQueue(this.defaultGroupId)
        }

        this.groupIds = new BasicQueue('group-ids')

        this.groupIds.add(this.defaultGroupId)

        this.currentGroupIdPosition = 0

        this._isConsuming = false

        this._isDrained = true
    }

    enqueue(element, options = {}) {
        const { groupId}  = options

        if (!groupId) {
            return this.groupedDeques[this.defaultGroupId].add(element)
        }

        if (!this.groupedDeques[groupId]) {
            this.groupedDeques[groupId] = new BasicQueue(groupId)
            this.groupIds.add(groupId)
        }

        return this.groupedDeques[groupId].add(element)
    }

    dequeue() {
        const initialGroupId = this.nextGroupId()

        let groupId = initialGroupId
        let hasLooped = false

        let deque = this.groupedDeques[groupId]

        while(deque.isEmpty()) {
            if (hasLooped && groupId === initialGroupId) {
                return null
            }

            hasLooped = true

            groupId = this.nextGroupId()
            deque = this.groupedDeques[groupId]
        }

        return deque.pop()
    }

    nextGroupId() {
        if (this.currentGroupIdPosition >= this.groupIds.size()) {
            this.currentGroupIdPosition = 0
        }

        const groupId = this.groupIds.getElementByPosition(this.currentGroupIdPosition++)
        return groupId
    }

    consume(callbackFn) {
        this._isConsuming = true

        const checkQueue = async () => {
            while (this._isConsuming) {
                const element = this.dequeue()

                if (element) {
                    this._isDrained = false
                    await callbackFn(element)
                } else {
                    this._isDrained = true
                    await new Promise(resolve => setTimeout(resolve, 100))
                }
            }
        }

        checkQueue()
    }

    stopConsuming() {
        this._isConsuming = false
    }

    isDrained() {
        return this._isDrained
    }
}