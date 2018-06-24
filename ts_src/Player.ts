namespace Pong {
    export class Player {
        public paddle: Paddle;
    
        constructor() {
            this.paddle = new Paddle(175, 580, 50, 10);
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
