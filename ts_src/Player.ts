namespace Pong {
    export class Player {
        public paddle: Paddle;
    
        constructor(x: number, y: number, width: number, height: number) {
            this.paddle = new Paddle(x, y, width, height);
        }
    
        render(context: any) {
            this.paddle.render(context);
        };
    
        update(keysDown: {}) {
            for (var key in keysDown) {
                var value = Number(key);
                if (value == 37) {
                    this.paddle.move(-4, 0);
                } else if (value == 39) {
                    this.paddle.move(4, 0);
                } else {
                    this.paddle.move(0, 0);
                }
            }
        };
    }
}
