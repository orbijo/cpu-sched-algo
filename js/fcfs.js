function calculateFCFS() {
    // reset function here
    // GET INPUTS
    const arrivalInput = document.getElementById("arrivalTimes").value;
    const burstInput = document.getElementById("burstTimes").value;

    const arrivalTimes = arrivalInput.split(" ").map(Number);
    const burstTimes = burstInput.split(" ").map(Number);

    const n = arrivalTimes.length;

    const waitingQueue = [];

    for (let i = 0; i < n; i++) {
        let process = { pid: i, arrivalTime: arrivalTimes[i], burstTime: burstTimes[i], endTime: 0, turnaroundTime: 0, waitingTime: 0 };
        waitingQueue.push(process);
    }

    // SIMULATE CPU SCHED
    // initialize variables
    const processes = [];
    var readyQueue = [];
    var currentTime = 0;

    // Variables for Gantt
    const ganttProcesses = [];
    const ganttTimes = [];

    // Sort waitingQueue according to arrival time
    waitingQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

    ganttTimes.push(currentTime);
    // Iterate through waitingQueue
    while (waitingQueue.length !== 0) {
        // Check if Idle
        if (waitingQueue[0].arrivalTime <= currentTime) {
            // Not Idle

            // Move all processes <= current time to ready queue and sort
            for (let i = 0; i < waitingQueue.length; i++) {
                let readyProcess = waitingQueue[i];
                if (readyProcess.arrivalTime <= currentTime) {
                    readyQueue.push(readyProcess);
                    waitingQueue.splice(i, 1);
                    i--;
                }
            }

            readyQueue.sort((a, b) => a.arrivalTime - b.arrivalTime);

            // Calculate
            while (readyQueue.length !== 0) {
                let currentProcess = readyQueue.shift();

                currentTime += currentProcess.burstTime;
                currentProcess.endTime = currentTime;
                currentProcess.turnaroundTime = currentProcess.endTime - currentProcess.arrivalTime;
                currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;

                processes.push(currentProcess);
                ganttProcesses.push(String.fromCharCode(65 + currentProcess.pid));
                ganttTimes.push(currentTime);
            }

        } else {
            // Idle
            ganttProcesses.push('idle');
            currentTime = waitingQueue[0].arrivalTime
            ganttTimes.push(currentTime);
        }
    }
    processes.sort((a, b) => a.pid - b.pid);

    const outputTable = document.getElementById("outputTable");
    outputTable.innerHTML = "";

    let ganttChartHTML = "Gantt Chart:<br>";
    let cpuUtil = 0;
    let averageTAT = 0;
    let averageWT = 0;

    for (let i = 0; i < processes.length; i++) {
        const processId = processes[i].pid;
        const processName = String.fromCharCode(65 + processId);
        const arrivalTime = processes[i].arrivalTime;
        const burstTime = processes[i].burstTime;
        const completionTime = processes[i].endTime;
        const turnaroundTime = processes[i].turnaroundTime;
        const waitingTime = processes[i].waitingTime;
        cpuUtil += burstTime;
        outputTable.innerHTML += `<tr>
            <td>${processName}</td>
            <td>${arrivalTime}</td>
            <td>${burstTime}</td>
            <td>${completionTime}</td>
            <td>${turnaroundTime}</td>
            <td>${waitingTime}</td>
        </tr>`;

        averageTAT += turnaroundTime;
        averageWT += waitingTime;
    }

    ganttProcesses.forEach((step, index) => {
        const item = document.createElement("div");
        item.classList.add('item', 'flex-center');
        item.textContent = step;
        document.getElementById("processes").appendChild(item);
    });
    ganttTimes.forEach((step, index) => {
        const item = document.createElement("div");
        item.classList.add('time', 'flex-center');
        item.textContent = step;
        document.getElementById("timeline").appendChild(item);
    });

    console.log(ganttProcesses);
    console.log(ganttTimes);

    averageTAT /= n;
    averageWT /= n;

    document.getElementById("cpuUtil").textContent = `${((cpuUtil/currentTime)*100).toFixed(2)}%`;
    document.getElementById("averageTAT").textContent = averageTAT.toFixed(2);
    document.getElementById("averageWT").textContent = averageWT.toFixed(2);

}