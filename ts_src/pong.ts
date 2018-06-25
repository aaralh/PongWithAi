namespace Game {

    export interface IPaddleOptions {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    // initial model definition
    const model = tf.sequential();
    //input is a 1x8 (players paddle position, computers paddle position, ball x, ball y, previous ball x, previous ball y, previous paddle x, previous paddle y)
    model.add(tf.layers.dense({ units: 256, inputShape: [8] }));
    model.add(tf.layers.dense({ units: 512, inputShape: [256], activation: "sigmoid" }));
    model.add(tf.layers.dense({ units: 256, inputShape: [512], activation: "sigmoid" }));
    model.add(tf.layers.dense({ units: 3, inputShape: [256] })); //returns a 1x3
    const optimizer = tf.train.adam(CONFIG.learningRate);
    model.compile({ loss: 'meanSquaredError', optimizer: optimizer });

    //animation of the pong game code
    let animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60)
    };

    // variables for pong game.
    let canvas = document.createElement("canvas");
    canvas.width = CONFIG.areaWidth;
    canvas.height = CONFIG.areaHeight;
    let context = canvas.getContext('2d');
    let player;
    if (CONFIG.humanPlayer) {
        player = new Pong.Player(175, CONFIG.areaHeight - 20, 50, 10);
    } else {
        player = new Pong.Computer(175, CONFIG.areaHeight - 20, 50, 10);
    }
    let computer = new Pong.Computer(175, 10, 50, 10);
    let ball = new Pong.Ball(200, 300);
    let ai = new Pong.AI(model);

    let keysDown: {} = {};

    //from pong code:
    function render() {
        context.fillStyle = "#000000";
        context.fillRect(0, 0, CONFIG.areaWidth, CONFIG.areaHeight);
        player.render(context);
        computer.render(context);
        ball.render(context);
    };

    function update() {
        if (CONFIG.humanPlayer){
            player.update(keysDown);
        } else {
            player.update(ball);
        }

        if (computer.aiPlays) {
            let move = ai.predict_move();
            computer.ai_update(move);
        } else
            computer.update(ball);
        ball.update(player.paddle, computer.paddle, ai, computer);
        ai.save_data(player.paddle, computer.paddle, ball, CONFIG.areaWidth, CONFIG.areaHeight)
    };

    function step() {
        update();
        render();
        animate(step);
    };
    document.body.appendChild(canvas);
    animate(step);

    window.addEventListener("keydown", (event) => {
        keysDown[event.keyCode] = true;
        
    });

    window.addEventListener("keyup", (event) => {
        delete keysDown[event.keyCode];
    });

}