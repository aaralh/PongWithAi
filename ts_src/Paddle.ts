namespace Pong {
    export class Paddle {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public x_speed: number;
        public y_speed: number;
    
        constructor(x: number, y: number, width: number, height: number) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.x_speed = 0;
            this.y_speed = 0;
        }
    
        render(context: any) {
            context.fillStyle = "#59a6ff";
            context.fillRect(this.x, this.y, this.width, this.height);
        };
    
        move(x: number, y: number) {
            this.x += x;
            this.y += y;
            this.x_speed = x;
            this.y_speed = y;
            if (this.x < 0) {
                this.x = 0;
                this.x_speed = 0;
            } else if (this.x + this.width > CONFIG.areaWidth) {
                this.x = CONFIG.areaWidth - this.width;
                this.x_speed = 0;
            }
        };
    }
}