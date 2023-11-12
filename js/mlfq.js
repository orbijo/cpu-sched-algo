window.onload = function () {
    document.getElementById('optRRobin').hidden = true;
    document.getElementById('optPrio').hidden = true;
};

function calculateMLFQ() {
    // GET INPUTS
    const arrivalInput = document.getElementById("arrivalTimes").value;
    const burstInput = document.getElementById("burstTimes").value;
    const levels = +document.getElementById("levels").value;

    // VALUES
    const arrivalTimes = arrivalInput.split(" ").map(Number);
    const burstTimes = burstInput.split(" ").map(Number);

    // priorities if last queue is npp or pp
    const prioritiesInput = document.getElementById("priorities").value;
    const priorities = prioritiesInput.split(" ").map(Number);
    // quantum if last queue is round robin;
    const quantum = +document.getElementById("quantum").value;

    // get all quantums
    const queueQuantums = []
    for (let i = 1; i < levels; i++) {
        let q = document.getElementById(`q${i}`).value;
        queueQuantums.push(q)
    }
    // Initialize number of readyQueues;
    const mlQueue = createLevels(levels);
    const lowPrioAlgo = document.getElementById("lastQueue").value;

    // Initialize Waiting Queue
    const n = arrivalTimes.length;
    const waitingQueue = [];
    for (let i = 0; i < n; i++) {
        let process = { pid: i, arrivalTime: arrivalTimes[i], burstTime: burstTimes[i], priority: priorities[i], endTime: 0, turnaroundTime: 0, waitingTime: 0 };
        waitingQueue.push(process);
    }

    // Init Current Time
    var currentTime = 0;

    // Initialize Gantt
    var ganttChart = {
        processes: [],
        times: []
    }
    ganttChart = updateGanttChart(ganttChart, [], [currentTime]);

    // SIMULATION


    while (waitingQueue.length !== 0) {
        // Check if Idle
        if (waitingQueue[0].arrivalTime <= currentTime) {
            // Not Idle

            // Iterate through queues Q1:0 | Q2:1 | Q3: 2 | QN : level-1
            for (i = 0; i < levels; i++) {

                for (let i = 0; i < waitingQueue.length; i++) {
                    const readyProcess = waitingQueue[i];
                    if (readyProcess.arrivalTime <= currentTime) {
                        mlQueue[0].push(readyProcess);
                        waitingQueue.splice(i, 1);
                        i--;
                    }
                }

                while (mlQueue[i].length > 0) {
                    
                }
            }

        } else {
            // Idle
            ganttChart = updateGanttChart(ganttChart, ['idle'], [currentTime]);
            currentTime = waitingQueue[0].arrivalTime
        }
    }

    displayResults();

}

function fcfs(queue, waitingQueue) {

}

function sjf(queue, waitingQueue) {

}

function srtf(queue, waitingQueue) {

}

function prio(queue, waitingQueue) {

}

function npp(queue, waitingQueue) {

}

function rr(queue, waitingQueue, quantum) {

}

function updateGanttChart(gantt, processes, times) {
    var updatedGantt = JSON.parse(JSON.stringify(gantt));
    updatedGantt.processes = updatedGantt.processes.concat(processes);
    updatedGantt.times = updatedGantt.times.concat(times);
    return updatedGantt;
}

function displayResults() {
    // Calculate and display CPU utilization, average turnaround time, and average waiting time
}

function createLevels(levels) {
    const arrayOfArrays = [];
    for (let i = 0; i < levels; i++) {
        arrayOfArrays.push([]);
    }

    return arrayOfArrays;
}

function changeQueues() {
    const qls = +document.getElementById("levels").value;
    const parent = document.getElementById("qSlice");
    parent.innerHTML = "";

    for (let i = qls; i > 1; i--) {
        let childLabel = document.createElement("label");
        let childInput = document.createElement("input");

        // <label for="q1">Quantum for queue 1: </label>
        childLabel.htmlFor = `q${i - 1}`;
        childLabel.textContent = `Quantum for queue ${i - 1}: `;

        // <input type="number" name="q1" id="q1" min="1"></input>
        childInput.type = "number";
        childInput.name = `q${i - 1}`;
        childInput.id = `q${i - 1}`;
        childInput.min = `1`;
        childInput.value = `1`;

        parent.insertBefore(childInput, parent.firstChild);
        parent.insertBefore(childLabel, parent.firstChild);
    }
}

function changeOptions() {
    document.getElementById("optPrio").hidden = true;
    document.getElementById("optRRobin").hidden = true;
    const selection = document.getElementById("lastQueue").value;
    if (selection == 'prio' || selection == 'npp') {
        document.getElementById("optPrio").hidden = false;
    }
    if (selection == 'rr') {
        document.getElementById("optRRobin").hidden = false;
    }
}