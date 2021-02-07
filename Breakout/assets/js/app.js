import { Ball } from "./ball.js"
import { Enemy } from "./enemy.js"
import { Player } from "./player.js"
import { addScore, mostFrequentPlayers } from "./db.js";
/*
    TODO:
        Move stuff to modules and import them es6 style
        draw some styling on the for the canvas
        Improve the end game screen
        ✓ increasing difficulty with time
        ✓ implement scores
        implement leaderboard
*/

document.querySelector("#btn-play").addEventListener("click", ()=>{
    if (!interval){
        interval = setInterval(draw, 10);
    }
})

document.querySelector("#btn-pause").addEventListener("click", ()=>{
    if (interval){
        clearInterval(interval);
        interval = undefined;
    }
})

document.querySelector("#btn-reset").addEventListener("click", ()=>{
    startGameState();
    if (!interval){
        interval = setInterval(draw, 10);
    }
})

function startGameState(){
    ball = Reflect.construct(Ball, [Reflect.get(canvas, "clientWidth")/2, canvas.clientHeight - 20, -2.2, 2.2, 10])
    // ball = new Ball(canvas.clientWidth/2, canvas.clientHeight - 20, -2.2, 2.2, 10);
    playerPaddle = new Player(75, 10, 3, 0, (canvas.clientHeight-75) / 2)
    
    enemyPaddle = new Enemy(75, 10, canvas.clientWidth - 10, (canvas.clientHeight-75) / 2);
    
    
    gameState = {
        score: 0,
        upPressed: false,
        downPressed: false,
    };
    Reflect.set(gameState, 'canvas', canvas);

}
let ball, playerPaddle, enemyPaddle, gameState, interval;
let canvas = document.querySelector("#myCanvas");
let ctx = canvas.getContext("2d");


startGameState();
drawInit();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Down" || e.key == "ArrowDown") {
        gameState.downPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        gameState.upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Down" || e.key == "ArrowDown") {
        gameState.downPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        gameState.upPressed = false;
    }
}

function drawInit(){
    ctx.fillStyle = "white";
    ctx.font = "50px roboto";
    Reflect.apply(Reflect.getPrototypeOf(ctx).fillText, ctx, ["Pong", canvas.clientWidth / 2 - 25, canvas.clientHeight / 2 - 25])
}

function drawScore(){
    ctx.font = "30px sans-serif"
    ctx.fillText(gameState.score, canvas.clientWidth / 2, 30)
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}
function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawBall();
    ball.moveBall(enemyPaddle, playerPaddle, gameState, () =>
        setTimeout(() => {
            clearInterval(interval);
            interval = undefined; // Needed for Chrome to end game
            alert("GAME OVER");
            let playerName = document.querySelector("#input-name").value;
            console.log(`Player is ${playerName}`)
            addScore(playerName || "player", gameState.score)((res) => showScores("#scorelist", res));
            mostFrequentPlayers((res) => showScores("#playerlist", res))
        }, 5)
    );
    playerPaddle.move(canvas, gameState.upPressed, gameState.downPressed);
    drawPaddle(playerPaddle);
    enemyPaddle.move(canvas);
    drawPaddle(enemyPaddle);
    drawScore();
}

export function showScores(nodeName, scores){
    let leaderboard = document.querySelector(nodeName)
    leaderboard.innerHTML = ""
    let iter = returnScores(scores);
    let score = iter.next();
    while (!score.done) {
        let scoreEntry = document.createElement("li");
        let nameElem = document.createElement("mark")
        nameElem.textContent = score.value[0];
        scoreEntry.appendChild(nameElem);
        let scoreElem = document.createElement("small")
        scoreElem.textContent = score.value[1];
        scoreEntry.appendChild(scoreElem);
        leaderboard.appendChild(scoreEntry);
        score = iter.next();
    } 
}

function* returnScores(scores){
    for(let i = 0; i < scores.length; i++){
        if (!Array.isArray(scores[i])){
            yield formatScores`${i}|${scores[i].username}|${scores[i].score}`;
        }
        else{ 
            yield formatScores`${i}|${scores[i][0]}|${scores[i][1]}`;
        }
    }
}
function formatScores(initString, rank, username, score){
    return [username, score]
}
