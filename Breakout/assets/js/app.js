import { Ball } from "./ball.js"
import { Enemy } from "./enemy.js"
import { Player } from "./player.js"
import { addScore } from "./db.js";
/*
    TODO:
        Move stuff to modules and import them es6 style
        draw some styling on the for the canvas
        Improve the end game screen
        ✓ increasing difficulty with time
        ✓ implement scores
        implement leaderboard
*/
let canvas = document.querySelector("#myCanvas");
let ctx = canvas.getContext("2d");
ctx.font = "30px sans-serif"

let ball = new Ball(canvas.clientWidth/2, canvas.clientHeight - 20, 2.2, 2.2, 10);
let playerPaddle = new Player(75, 10, 3, canvas.clientWidth, canvas.clientHeight)

let enemyPaddle = new Enemy(75, 10, 0, (canvas.clientHeight-75) / 2);


let gameState = {
    score: 0,
    upPressed: false,
    downPressed: false,
    canvas
};


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

function drawScore(){
    ctx.fillText(gameState.score, canvas.clientWidth / 2, 30)
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    drawBall();
    ball.moveBall(enemyPaddle, playerPaddle, gameState, () =>
        setTimeout(() => {
            clearInterval(interval); // Needed for Chrome to end game
            alert("GAME OVER");
            let leaderboards = addScore("player", gameState.score)(showScores);
        }, 5)
    );
    playerPaddle.move(canvas, gameState.upPressed, gameState.downPressed);
    drawPaddle(playerPaddle);
    enemyPaddle.move(canvas);
    drawPaddle(enemyPaddle);
    drawScore();
}

function showScores(scores){
    let iter = returnScores(scores);
    let score = iter.next();;
    while (!score.done) {
        console.log(score.value);
        score = iter.next() 
    } 
}

function* returnScores(scores){
    for(let i = 0; i < scores.length; i++){
        yield formatScores`${i}|${scores[i].username}|${scores[i].score}`;
    }
}

function formatScores(initString, rank, username, score){
    return [rank, username, score]
}

var interval = setInterval(draw, 10);
