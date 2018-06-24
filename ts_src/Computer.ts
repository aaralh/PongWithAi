namespace Pong {
    export class Computer {
        public paddle: Paddle;
        public aiPlays: boolean;
    
        constructor(x: number, y: number, width: number, height: number) {
            this.paddle = new Paddle(x, y, width, height);
            this.aiPlays = false;
        }
    
        render(context: any) {
            this.paddle.render(context);
        }
    
        update(ball: Pong.Ball) {
            var x_pos = ball.x;
            var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
            if (diff < 0 && diff < -4) {
                diff = -5;
            } else if (diff > 0 && diff > 4) {
                diff = 5;
            }
            this.paddle.move(diff, 0);
            if (this.paddle.x < 0) {
                this.paddle.x = 0;
            } else if (this.paddle.x + this.paddle.width > CONFIG.areaWidth) {
                this.paddle.x = CONFIG.areaWidth - this.paddle.width;
            }
        };
    
        ai_update(move = 0) {
            this.paddle.move(4 * move, 0);
        };
    }
}