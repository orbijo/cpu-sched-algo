class Process {
    constructor(name, AT, BT) {
        this.name = name;
        this.AT = AT;
        this.BT = BT;
        this.WT = 0;
        this.TAT = 0;
        this.RT = 0;
        this.CT = 0;
    }
}

let Q1 = [];
let Q2 = [];
let Q3 = [];

let n;
let tq1 = 1;
let tq2 = 1;

function sortByArrival() {
    Q1.sort((a, b) => a.AT - b.AT);
}

function calculateMLFQ() {
    let i, j, k = 0, r = 0, time = 0, flag = 0;
    let c;

    const arrivalInput = document.getElementById("arrivalTimes").value;
    const burstInput = document.getElementById("burstTimes").value;

    const arrivalTimes = arrivalInput.split(" ").map(Number);
    const burstTimes = burstInput.split(" ").map(Number);

    tq1 = +document.getElementById("q1").value;
    tq2 = +document.getElementById("q2").value;

    let outputTable = document.getElementById("outputTable");
    let ganttTimeline = document.getElementById("ganttTimeline");
    let ganttProcesses = document.getElementById("ganttProcesses");

    outputTable.innerHTML = ""; // Clear the table body
    ganttTimeline.innerHTML = ""; // Clear the Gantt chart
    ganttProcesses.innerHTML = ""; // Clear the Gantt chart

    const gTimes = [];
    const gProcs = [];

    // number of processes
    n = arrivalTimes.length;

    for (let i = 0; i < n; i++) {
        Q1.push(new Process(String.fromCharCode(65 + i), arrivalTimes[i], burstTimes[i]));
        Q1[i].RT = Q1[i].BT;
    }

    // Q1.push(new Process(c, AT, BT));
    //  /* save burst time in remaining time for each process */

    sortByArrival();
    time = Q1[0].AT;

    console.log(`Process in first queue following RR with qt=${tq1}`);
    console.log("Process\t\tRT\t\tWT\t\tTAT");

    for (i = 0; i < n; i++) {
        if (Q1[i].RT <= tq1) {
            time += Q1[i].RT;
            Q1[i].RT = 0;
            Q1[i].WT = time - Q1[i].AT - Q1[i].BT;
            Q1[i].TAT = time - Q1[i].AT;
            gProcs.push(Q1[i].name);
            gTimes.push(time);
            console.log(`${Q1[i].name}\t\t${Q1[i].BT}\t\t${Q1[i].WT}\t\t${Q1[i].TAT}`);
        } else {
            Q2[k] = new Process(Q1[i].name, 0, 0);
            Q2[k].WT = time;
            time += tq1;
            Q1[i].RT -= tq1;
            Q2[k].BT = Q1[i].RT;
            Q2[k].RT = Q2[k].BT;
            k++;
            flag = 1;
        }
    }

    if (flag === 1) {
        console.log(`Process in second queue following RR with qt=${tq2}`);
        console.log("Process\t\tRT\t\tWT\t\tTAT");
    }

    for (i = 0; i < k; i++) {
        if (Q2[i].RT <= tq2) {
            time += Q2[i].RT;
            Q2[i].RT = 0;
            Q2[i].WT = time - tq1 - Q2[i].BT;
            Q2[i].TAT = time - Q2[i].AT;
            console.log(`${Q2[i].name}\t\t${Q2[i].BT}\t\t${Q2[i].WT}\t\t${Q2[i].TAT}`);
        } else {
            Q3[r] = new Process(Q2[i].name, 0, 0);
            Q3[r].AT = time;
            time += tq2;
            Q2[i].RT -= tq2;
            Q3[r].BT = Q2[i].RT;
            Q3[r].RT = Q3[r].BT;
            r++;
            flag = 2;
        }
    }

    if (flag === 2) {
        console.log("Process in third queue following FCFS");
    }

    for (i = 0; i < r; i++) {
        if (i === 0) {
            Q3[i].CT = Q3[i].BT + time - tq1 - tq2;
        } else {
            Q3[i].CT = Q3[i - 1].CT + Q3[i].BT;
        }
    }

    for (i = 0; i < r; i++) {
        Q3[i].TAT = Q3[i].CT;
        Q3[i].WT = Q3[i].TAT - Q3[i].BT;
        console.log(`${Q3[i].name}\t\t${Q3[i].BT}\t\t${Q3[i].WT}\t\t${Q3[i].TAT}`);
    }
}

// main();
