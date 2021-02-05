export class Ball{
    constructor(x, y, dx, dy, radius){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
    }
    moveBall(enemyPaddle, playerPaddle, canvas){
        if (this.x + this.dx - this.radius - enemyPaddle.width/2 < 0){
            this.dx = -this.dx;
        } 
        if(this.x > canvas.width-this.radius-playerPaddle.width){
            if (this.y + this.radius / 2  > playerPaddle.y && this.y + this.radius / 2 < playerPaddle.y + playerPaddle.height) {
                console.log(`Dx currently ${this.dx} and x+dx ${this.x+this.dx} and comp ${canvas.width-this.radius-playerPaddle.width}`)
                this.dx = -this.dx;
                enemyPaddle.calcDest();
            } 
            else if (this.x + this.dx > canvas.width-this.radius-playerPaddle.width) {
                setTimeout(() => {
                    alert("GAME OVER");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                }, 5)
            }
        }
        if (this.y + this.dy - this.radius < 0 || this.y + this.dy + this.radius > canvas.height){
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}