import Queue from "./queue.js"

const queue = new Queue()

queue.enqueue({ key: 'value-1-default' })
queue.enqueue({ key: 'value-2-default' })
queue.enqueue({ key: 'value-3-default' })
queue.enqueue({ key: 'value-1-tenant-1' }, { groupId: 'tenant-1' })
queue.enqueue({ key: 'value-2-tenant-1' }, { groupId: 'tenant-1' })
queue.enqueue({ key: 'value-1-tenant-2' }, { groupId: 'tenant-2' })

// It will consume the queue in a round robin way across groups
queue.consume(console.log)

// Stop when drained
let intervalId;

intervalId = setInterval(() => {
    if (queue.isDrained()) {
        queue.stopConsuming()

        if (intervalId) clearInterval(intervalId)
    }
}, 100)