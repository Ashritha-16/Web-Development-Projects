let timer;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let lapNumber = 1;

const display = document.getElementById("display");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");
const lapButton = document.getElementById("lap-btn");
const lapList = document.getElementById("lap-list");

function startStopwatch(){

    if(!isRunning){

        startTime = Date.now() - elapsedTime;

        timer = setInterval(updateTime,10);

        isRunning = true;

        startButton.disabled = true;
        lapButton.disabled = false;
    }
}

function pauseStopwatch(){

    clearInterval(timer);

    elapsedTime = Date.now() - startTime;

    isRunning = false;

    startButton.disabled = false;
}

function resetStopwatch(){

    clearInterval(timer);

    elapsedTime = 0;
    lapNumber = 1;
    isRunning = false;

    display.textContent = "00:00:00:00";

    lapList.innerHTML = "";

    startButton.disabled = false;
    lapButton.disabled = true;
}

function updateTime(){

    elapsedTime = Date.now() - startTime;

    let hours = Math.floor(elapsedTime/3600000);
    let minutes = Math.floor((elapsedTime%3600000)/60000);
    let seconds = Math.floor((elapsedTime%60000)/1000);
    let milliseconds = Math.floor((elapsedTime%1000)/10);

    hours = String(hours).padStart(2,"0");
    minutes = String(minutes).padStart(2,"0");
    seconds = String(seconds).padStart(2,"0");
    milliseconds = String(milliseconds).padStart(2,"0");

    display.textContent =
    `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

function saveLap(){

    if(isRunning){

        let lapItem = document.createElement("li");

        lapItem.textContent =
        `Lap ${lapNumber}: ${display.textContent}`;

        lapList.prepend(lapItem);

        lapNumber++;
    }
}

startButton.addEventListener("click",startStopwatch);
pauseButton.addEventListener("click",pauseStopwatch);
resetButton.addEventListener("click",resetStopwatch);
lapButton.addEventListener("click",saveLap);