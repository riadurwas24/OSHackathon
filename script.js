class Process {
    constructor(id, arrivalTime, burstTime, priority) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.priority = priority;
    }
}

function FCFS(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    return simulate(processes);
}

function SJF(processes) {
    processes.sort((a, b) => a.burstTime - b.burstTime);
    return simulate(processes);
}

function PS(processes) {
    processes.sort((a, b) => a.priority - b.priority);
    return simulate(processes);
}

function simulate(processes) {
    let waitingTime = 0;
    let turnaroundTime = 0;
    let responseTime = 0;
    let ganttChart = [];

    for (let process of processes) {
        const startTime = Math.max(waitingTime, process.arrivalTime);
        const endTime = startTime + process.burstTime;
        waitingTime += startTime - process.arrivalTime;
        turnaroundTime += endTime - process.arrivalTime;
        responseTime += startTime - process.arrivalTime;
        ganttChart.push({ process: process.id, start: startTime, end: endTime });
        waitingTime = endTime; // Update waiting time for the next process
    }

    return { waitingTime, turnaroundTime, responseTime, ganttChart };
}

function drawGanttChart(ganttChart) {
    const canvas = document.getElementById('gantt-chart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ganttChart.forEach((entry, index) => {
        ctx.fillStyle = `hsl(${index * 30}, 100%, 50%)`;
        ctx.fillRect(entry.start * 10, 50, (entry.end - entry.start) * 10, 50);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`P${entry.process}`, (entry.start + entry.end) / 2 * 10, 75);
    });
}

document.getElementById('generate-processes').addEventListener('click', () => {
    const processCount = parseInt(document.getElementById('process-count').value);
    const processInputs = document.getElementById('process-inputs');
    processInputs.innerHTML = '';

    for (let i = 0; i < processCount; i++) {
        processInputs.innerHTML += `
            <h3>Process ${i + 1}</h3>
            <label for="arrival-time-${i}">Arrival Time:</label>
            <input type="number" id="arrival-time-${i}" min="0" value="0">

            <label for="burst-time-${i}">Burst Time:</label>
            <input type="number" id="burst-time-${i}" min="1" value="1">

            <label for="priority-${i}">Priority:</label>
            <input type="number" id="priority-${i}" min="1" value="1">
        `;
    }
});

document.getElementById('run-simulation').addEventListener('click', () => {
    const algorithm = document.getElementById('algorithm').value;
    const processCount = parseInt(document.getElementById('process-count').value);
    const processes = [];

    for (let i = 0; i < processCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival-time-${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst-time-${i}`).value);
        const priority = parseInt(document.getElementById(`priority-${i}`).value);
        processes.push(new Process(i + 1, arrivalTime, burstTime, priority));
    }

    let results;
    switch (algorithm) {
        case 'FCFS':
            results = FCFS(processes);
            break;
        case 'SJF':
            results = SJF(processes);
            break;
        case 'PS':
            results = PS(processes);
            break;
        default:
            console.error('Unknown scheduling algorithm');
            return;
    }

    drawGanttChart(results.ganttChart);
    document.getElementById('waiting-time').innerText = results.waitingTime;
    document.getElementById('turnaround-time').innerText = results.turnaroundTime;
    document.getElementById('response-time').innerText = results.responseTime;
    generateProcessTable(processes);
});

function generateProcessTable(processes) {
    const tableBody = document.getElementById('process-table-body');
    tableBody.innerHTML = '';

    processes.forEach((process) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>P${process.id}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            <td>${process.priority}</td>
        `;
        tableBody.appendChild(row);
    });
}
