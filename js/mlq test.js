class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    enqueue(data) {
        const newNode = new Node(data);
        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    dequeue() {
        if (this.head === null) {
            console.log("Queue is empty");
            return null;
        } else {
            const data = this.head.data;
            this.head = this.head.next;
            if (this.head === null) {
                this.tail = null;
            }
            return data;
        }
    }

    isEmpty() {
        return this.head === null;
    }

    print() {
        let temp = this.head;
        while (temp !== null) {
            console.log(temp.data);
            temp = temp.next;
        }
    }
}

class MultilevelFeedbackQueue {
    constructor() {
        this.queues = [[], [], []];
        this.quantums = [2, 4];
        this.algorithm = "FCFS";
    }

    setAlgorithm(algorithm) {
        this.algorithm = algorithm;
    }

    addProcess(process) {
        this.queues[0].push(process);
    }

    run() {
        let currentQueue = 0;
        let time = 0;
        while (!this.isEmpty()) {
            const queue = this.queues[currentQueue];
            if (queue.length > 0) {
                const process = queue.shift();
                if (this.algorithm === "FCFS") {
                    this.runProcess(process, time);
                } else if (this.algorithm === "SRTF") {
                    this.runProcess(process, time, true);
                } else if (this.algorithm === "SJF") {
                    this.runProcess(process, time, false);
                } else if (this.algorithm === "Priority") {
                    this.runProcess(process, time, false, true);
                }
                if (queue.length === 0 && currentQueue < this.queues.length - 1) {
                    currentQueue++;
                }
            } else {
                if (currentQueue > 0) {
                    currentQueue--;
                }
            }
            time++;
        }
    }

    runProcess(process, time, preemptive = false, priority = false) {
        let quantum = this.quantums[0];
        if (process.level === 1) {
            quantum = this.quantums[1];
        }
        let remainingTime = process.time;
        while (remainingTime > 0) {
            if (preemptive && this.shouldPreempt(process, time)) {
                this.queues[process.level].push(process);
                return;
            }
            if (priority && this.shouldPromote(process, time)) {
                process.level--;
                this.queues[process.level].push(process);
                return;
            }
            remainingTime--;
            quantum--;
            if (quantum === 0 && remainingTime > 0) {
                if (process.level < this.queues.length - 1) {
                    process.level++;
                }
                this.queues[process.level].push(process);
                return;
            }
        }
        console.log(`Process ${process.id} finished at time ${time}`);
    }

    shouldPreempt(process, time) {
        const queue = this.queues[process.level];
        for (let i = 0; i < queue.length; i++) {
            if (queue[i].time < process.time && queue[i].arrivalTime < time) {
                return true;
            }
        }
        return false;
    }

    shouldPromote(process, time) {
        const queue = this.queues[process.level];
        for (let i = 0; i < queue.length; i++) {
            if (queue[i].priority < process.priority && queue[i].arrivalTime < time) {
                return true;
            }
        }
        return false;
    }

    isEmpty() {
        for (let i = 0; i < this.queues.length; i++) {
            if (this.queues[i].length > 0) {
                return false;
            }
        }
        return true;
    }
}

const queue = new MultilevelFeedbackQueue();
queue.addProcess({id: 1, time: 10, level: 0, arrivalTime: 0, priority: 3});
queue.addProcess({id: 2, time: 5, level: 0, arrivalTime: 1, priority: 2});
queue.addProcess({id: 3, time: 8, level: 0, arrivalTime: 2, priority: 1});