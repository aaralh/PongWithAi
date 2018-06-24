namespace Pong {
    export class Ball {
        public x: number;
        public y: number;
        private x_speed: number;
        private y_speed: number;
        private y_speedList: number[] = [-1.5, 1, -1, 0.4, -0.4,1.7];
    
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.x_speed = 2;
            this.y_speed = 3;
        }
    
        render(context: any) {
            context.beginPath();
            context.arc(this.x, this.y, 5, 2 * Math.PI, false);
            context.fillStyle = "#ddff59";
            context.fill();
        };

        getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
          }
    
        update(paddle1: Paddle, paddle2: Paddle, ai: AI, computer: Computer) {
            this.x += this.x_speed;
            this.y += this.y_speed;
            var top_x = this.x - 5;
            var top_y = this.y - 5;
            var bottom_x = this.x + 5;
            var bottom_y = this.y + 5;
        
            if (this.x - 5 < 0) {
                this.x = 5;
                this.x_speed = -this.x_speed;
            } else if (this.x + 5 > CONFIG.areaWidth) {
                this.x = CONFIG.areaWidth -5;
                this.x_speed = -this.x_speed;
            }
            
            // If ball goes over top or bottom.
            if (this.y < 0 || this.y > CONFIG.areaHeight) {
                this.x_speed = this.y_speedList[this.getRandomInt(6)];
                this.y_speed = 3;
                this.x = CONFIG.areaWidth/2;
                this.y = CONFIG.areaHeight/2;
                ai.new_turn(computer);
            }
        
            if (top_y > CONFIG.areaHeight/2) {
                if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
                    this.y_speed = -3;
                    this.x_speed += (paddle1.x_speed / 2);
                    this.y += this.y_speed;
                }
            } else {
                if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
                    this.y_speed = 3;
                    this.x_speed += (paddle2.x_speed / 2);
                    this.y += this.y_speed;
                }
            }
        };
    }
}