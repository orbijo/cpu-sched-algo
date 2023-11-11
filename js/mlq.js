function calculateMLQ() {
    // GET INPUTS
    const arrivalInput = document.getElementById("arrivalTimes").value;
    const burstInput = document.getElementById("burstTimes").value;
    const prioritiesInput = document.getElementById("priorities").value;

    const arrivalTimes = arrivalInput.split(" ").map(Number);
    const burstTimes = burstInput.split(" ").map(Number);
    const priorities = prioritiesInput.split(" ").map(Number);

    const levels = +document.getElementById("levels").value;
    const selectedQueues = [];
    for (let i = 1; i <= levels; i++) {
        const selectedValue = document.getElementById(`q${i}`).value;
        selectedQueues.push(selectedValue);
    }

    // Initialize number of readyQueues;
    

    // Initialize Waiting Queue
    const n = arrivalTimes.length;
    const waitingQueue = [];
    for (let i = 0; i < n; i++) {
        let process = { pid: i, arrivalTime: arrivalTimes[i], burstTime: burstTimes[i], priority: priorities[i], endTime: 0, turnaroundTime: 0, waitingTime: 0 };
        waitingQueue.push(process);
    }

    // selectedQueues ['fcfs', 'sjf', 'srtf', ...]



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
    const queuesDOM = document.getElementById("queues");

    queuesDOM.innerHTML = "";

    for (let i = 1; i <= qls; i++) {
        const queueSelect = document.createElement("select");
        queueSelect.id = `q${i}`;
        queueSelect.name = `q${i}`;
        queueSelect.innerHTML = `
        <option value="fcfs">FCFS</option>
        <option value="sjf">SJF</option>
        <option value="srtf">SRTF</option>
        <option value="prio">Priority (Preemptive)</option>
        <option value="npp">Priority (Non-Preemptive)</option>
        <option value="rr">Round Robin</option>
        `;
        queuesDOM.appendChild(queueSelect);
    }
}