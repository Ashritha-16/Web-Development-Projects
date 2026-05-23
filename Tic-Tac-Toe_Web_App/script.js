const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
const newGameBtn = document.getElementById("newGame");
const modeBtn = document.getElementById("mode");

const turnText = document.getElementById("turn");
const resultText = document.getElementById("result");
const popup = document.querySelector(".popup");
const resultBox = document.getElementById("resultBox");

let currentPlayer = "O";
let gameOver = false;
let vsAI = false;

/* SCORES */
let scoreX = Number(localStorage.getItem("scoreX")) || 0;
let scoreO = Number(localStorage.getItem("scoreO")) || 0;
let scoreDraw = Number(localStorage.getItem("scoreDraw")) || 0;

/* WIN PATTERNS */
const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

/* UPDATE SCORE */
function updateScore(){
    document.getElementById("scoreX").innerText = scoreX;
    document.getElementById("scoreO").innerText = scoreO;
    document.getElementById("scoreDraw").innerText = scoreDraw;
}

/* CLICK EVENT */
cells.forEach(cell=>{
    cell.addEventListener("click",()=>{
        if(cell.innerText !== "" || gameOver) return;

        playMove(cell, currentPlayer);
        checkWinner();

        if(!gameOver){
            currentPlayer = currentPlayer === "O" ? "X" : "O";
            updateTurn();
        }

        if(vsAI && currentPlayer === "X" && !gameOver){
            setTimeout(aiMove, 400);
        }
    });
});

/* MOVE */
function playMove(cell, player){
    cell.innerText = player;
}

/* AI */
function aiMove(){
    const empty = [...cells].filter(c=>c.innerText==="");

    if(empty.length===0) return;

    const move = empty[Math.floor(Math.random()*empty.length)];

    playMove(move,"X");
    checkWinner();

    if(!gameOver){
        currentPlayer="O";
        updateTurn();
    }
}

/* CHECK WIN */
function checkWinner(){

    for(let pattern of winPatterns){

        let [a,b,c] = pattern;

        if(
            cells[a].innerText &&
            cells[a].innerText === cells[b].innerText &&
            cells[a].innerText === cells[c].innerText
        ){
            showWinner(cells[a].innerText, pattern);
            return;
        }
    }

    if([...cells].every(c=>c.innerText!=="")){
        showDraw();
    }
}

/* WIN */
function showWinner(player, pattern){

    gameOver = true;

    pattern.forEach(i=>{
        cells[i].classList.add("win");
    });

    popup.classList.remove("hide");

    if(player==="X"){
        resultBox.className="result-box win-x";
        resultText.innerText="X Wins!";
        scoreX++;
    }else{
        resultBox.className="result-box win-o";
        resultText.innerText="O Wins!";
        scoreO++;
    }

    saveScore();
}

/* DRAW */
function showDraw(){

    gameOver = true;

    popup.classList.remove("hide");

    resultBox.className="result-box draw";
    resultText.innerText="Game Draw!";

    scoreDraw++;

    saveScore();
}

/* TURN */
function updateTurn(){
    turnText.innerText = "Turn: " + currentPlayer;
}

/* SAVE */
function saveScore(){
    localStorage.setItem("scoreX",scoreX);
    localStorage.setItem("scoreO",scoreO);
    localStorage.setItem("scoreDraw",scoreDraw);
    updateScore();
}

/* RESET */
function resetGame(){

    cells.forEach(c=>{
        c.innerText="";
        c.classList.remove("win");
    });

    currentPlayer="O";
    gameOver=false;

    popup.classList.add("hide");
    updateTurn();
}

/* BUTTONS */
restartBtn.addEventListener("click",resetGame);
newGameBtn.addEventListener("click",resetGame);

modeBtn.addEventListener("click",()=>{
    vsAI=!vsAI;
    modeBtn.innerText = vsAI ? "Play 2 Player" : "Play vs AI";
    resetGame();
});

/* INIT */
updateScore();
updateTurn();