export class Enemy{
    constructor(height, width, x, y){
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;
        this.destination = 0
    }
    calcDest(ball, canvas, playerPaddle) {
        var moves_left = (canvas.clientWidth - playerPaddle.width) / Math.abs(ball.dx);
        var dest =  ball.y + (ball.dy * moves_left);
        console.log(ball.y, dest, ball.dx);
        while (dest > canvas.clientHeight || dest < 0){
            if (dest > canvas.clientHeight){
                dest = canvas.clientHeight - (dest - canvas.clientHeight);
            } else if (dest < 0){
                dest = -dest;
            }
        }
        console.log(ball.y, dest);
        console.log("\n");
        this.destination = dest
    }
    move(canvas) { 
        if (Math.abs(this.destination - this.y - this.height/2) < 3){
            return;
        }
        if (this.destination > this.y + this.height/2){
            this.y += 3;
            if (this.y + this.height > canvas.clientHeight){
                this.y = canvas.clientHeight - this.height;
            }
        } else if (this.destination < this.y + this.height/2) {
            this.y -= 3;
            if (this.y < 0){
                this.y = 0;
            }
        }
    }
}