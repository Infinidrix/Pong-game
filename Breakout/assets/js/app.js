// import * as Ball from "./ball.mjs"
class Ball{
    constructor(x, y, dx, dy, radius){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
    }
    moveBall(enemyPaddle, playerPaddle, canvas, endGame){
        if (this.x + this.dx - this.radius - enemyPaddle.width/2 < 0){
            this.dx = -this.dx;
        } 
        if(this.x > canvas.width-this.radius-playerPaddle.width){
            if (this.y + this.radius / 2  > playerPaddle.y && this.y + this.radius / 2 < playerPaddle.y + playerPaddle.height) {
                console.log(`Dx currently ${this.dx} and x+dx ${this.x+this.dx} and comp ${canvas.width-this.radius-playerPaddle.width}`)
                this.dx = -this.dx;
                enemyPaddle.calcDest(this, canvas, playerPaddle);
            } 
            else if (this.x + this.dx > canvas.width-this.radius-playerPaddle.width) {
                endGame();
            }
        }
        if (this.y + this.dy - this.radius < 0 || this.y + this.dy + this.radius > canvas.height){
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}

let canvas = document.querySelector("#myCanvas");
let ctx = canvas.getContext("2d");
let ball = new Ball(canvas.clientWidth/2, canvas.clientHeight - 20, 2, 5, 10);
let playerPaddle = {
    height: 75,
    width: 10,
    x: canvas.width-10,
    y: (canvas.height-75) / 2,
    move: function(canvas, upPressed, downPressed){
        if(downPressed) {
            this.y += 3;
            if (this.y + this.height > canvas.height){
                this.y = canvas.height - this.height;
            }
        }
        if(upPressed) {
            this.y -= 3;
            if (this.y < 0){
                this.y = 0;
            }
        }
    }
}
let enemyPaddle = {
    height: 75,
    width: 10,
    x: 0,
    y: (canvas.height-75) / 2,
    destination: 0,
    calcDest: function(ball, canvas, playerPaddle) {
        var moves_left = (canvas.width - playerPaddle.width) / Math.abs(ball.dx);
        var dest =  ball.y + (ball.dy * moves_left);
        console.log(ball.y, dest, ball.dx);
        while (dest > canvas.height || dest < 0){
            if (dest > canvas.height){
                dest = canvas.height - (dest - canvas.height);
            } else if (dest < 0){
                dest = -dest;
            }
        }
        console.log(ball.y, dest);
        console.log("\n");
        this.destination = dest
    },
    move: function () { 
        if (Math.abs(this.destination - this.y - this.height/2) < 3){
            return;
        }
        if (this.destination > this.y + this.height/2){
            this.y += 3;
            if (this.y + this.height > canvas.height){
                this.y = canvas.height - this.height;
            }
        } else if (this.destination < this.y + this.height/2) {
            this.y -= 3;
            if (this.y < 0){
                this.y = 0;
            }
        }
    }
}
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
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
    // TODO: fix ball glitch at the boundary of paddle (Almost fixed)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    ball.moveBall(enemyPaddle, playerPaddle, canvas, () =>
        setTimeout(() => {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval); // Needed for Chrome to end game
        }, 5)
    )
    playerPaddle.move(canvas, upPressed, downPressed)
    drawPaddle(playerPaddle);
    enemyPaddle.move();
    drawPaddle(enemyPaddle);
}
var interval = setInterval(draw, 10);
