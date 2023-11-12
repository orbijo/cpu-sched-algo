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

    const originalProcesses = JSON.parse(JSON.stringify(waitingQueue));
    const completedProcesses = [];

    // Init Current Time
    var currentTime = 0;

    // Initialize Gantt
    var ganttChart = {
        processes: [],
        times: []
    }
    updateGanttChart(ganttChart, [], currentTime);

    // SIMULATION
}

function fcfs(queue, currentTime, ganttChart, completedProcesses) {
    queue.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while(queue.length>0){
        const currentProcess = queue.shift();
        currentTime += currentProcess.burstTime;
        currentProcess.endTime = currentTime;
        completedProcesses.push(currentProcess);
        
        ganttChart = updateGanttChart(ganttChart, [String.fromCharCode(65 + currentProcess.pid)], [currentTime])
    }
}

function sjf(queue, currentTime, ganttChart, completedProcesses) {
    queue.sort((a, b) => (a.burstTime == b.burstTime)?a.arrivalTime - b.arrivalTime:a.burstTime - b.burstTime);

    while(queue.length>0){
        const currentProcess = queue.shift();
        currentTime += currentProcess.burstTime;
        currentProcess.endTime = currentTime;
        completedProcesses.push(currentProcess);
        
        ganttChart = updateGanttChart(ganttChart, [String.fromCharCode(65 + currentProcess.pid)], [currentTime])
    }
}

function srtf(queue, waitingQueue) {

}

function prio(queue, waitingQueue) {

}

function npp(queue, waitingQueue) {

}

function rr(queue, waitingQueue, quantum) {

}

function updateGanttChart(gantt, processes, time) {
    gantt.processes.concat(processes);
    gantt.times.push(time);
}


function displayResults(ganttChart, processesCopy, completedProcesses) {
    console.log(ganttChart.processes);
    console.log(ganttChart.times);
    console.log(processesCopy);
    console.log(completedProcesses);
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