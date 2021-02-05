
export class Ball{
    constructor(x, y, dx, dy, radius){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
    }
    moveBall(enemyPaddle, playerPaddle, state, endGame){
        let { canvas } = state;
        if (this.x + this.dx - this.radius - enemyPaddle.width/2 < 0){
            this.dx = -this.dx;
        } 
        if(this.x > canvas.clientWidth-this.radius-playerPaddle.width){
            if (this.y + this.radius / 2  > playerPaddle.y && this.y + this.radius / 2 < playerPaddle.y + playerPaddle.height) {
                console.log(`Dx currently ${this.dx} and x+dx ${this.x+this.dx} and comp ${canvas.clientWidth-this.radius-playerPaddle.width}`)
                this.dx = -this.dx;
                this.dx *= 1.05;
                this.dy *= 1.07;
                playerPaddle.speed *= 1.05;
                enemyPaddle.calcDest(this, canvas, playerPaddle);
                state.score += 1;
            } 
            else if (this.x > canvas.clientWidth-this.radius) {
                console.log(this.x, canvas.clientWidth, this.radius)
                endGame();
            }
        }
        if (this.y + this.dy - this.radius < 0 || this.y + this.dy + this.radius > canvas.clientHeight){
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}