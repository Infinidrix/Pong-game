export default class Player{
    constructor(height, width, speed, screenWidth, screenHeight){
        this.height = height;
        this.width = width 
        this.speed = speed;
        this.x = screenWidth;
        this.y = screenHeight;
    }
    move(canvas, upPressed, downPressed){
        if(downPressed) {
            this.y += this.speed;
            if (this.y + this.height > canvas.clientHeight){
                this.y = canvas.clientHeight - this.height;
            }
        }
        if(upPressed) {
            this.y -= this.speed;
            if (this.y < 0){
                this.y = 0;
            }
        }
    }
}
