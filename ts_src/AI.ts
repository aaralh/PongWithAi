namespace Pong {
    export class AI {
        private previous_data;
        private training_data;
        private last_data_object;
        private turn: number;
        private grab_data: boolean;
        private flip_table: boolean;
        private data;
        private data_xs;
        private data_ys;
        private index;
        private model;
    
        constructor(model: any) {
            this.previous_data = null;
            this.training_data = [[], [], []];
            this.last_data_object = null;
            this.turn = 0;
            this.grab_data = true;
            this.flip_table = true;
            this.model = model;
        }
    
        save_data(player: Paddle, computer:Paddle, ball: Ball, width: number, height: number){
    
            if(!this.grab_data)
                return;
        
            // If this is the very first frame (no prior data):
            if(this.previous_data == null){
                this.data = this.flip_table ? [width - computer.x, width - player.x, width - ball.x, height - ball.y] : [player.x, computer.x, ball.x, ball.y];
                this.previous_data = this.data;
                return;
            }
        
            // table is rotated to learn from player, but apply to computer position:
            if(this.flip_table){
                this.data_xs = [width - computer.x, width - player.x, width - ball.x, height - ball.y];
                this.index = ((width - player.x) > this.previous_data[1])?0:(((width - player.x) == this.previous_data[1])?1:2);
            }else{
                this.data_xs = [player.x, computer.x, ball.x, ball.y];
                this.index = (player.x < this.previous_data[0])?0:((player.x == this.previous_data[0])?1:2);
            }
        
            this.last_data_object = [...this.previous_data, ...this.data_xs];
            this.training_data[this.index].push(this.last_data_object);
            this.previous_data = this.data_xs;
        }
    
        new_turn(computer: Computer){
            this.previous_data = null;
            this.turn++;
            console.log('new turn: ' + this.turn);

            if(CONFIG.peekMode) {
                if(this.turn % 4 === 0) {
                    this.train();
                    this.reset(false);
                    computer.aiPlays = !computer.aiPlays
                }
            }
        
            //hm games til train?
            if(this.turn > CONFIG.gamesBeforeAiPlays){
                this.train();
                computer.aiPlays = true;
                this.reset(true);
            }
        }
    
        reset(reset_turns: boolean){
            this.previous_data = null;
            this.training_data = [[], [], []];
            if(reset_turns){
                this.turn = 0;
            }
        }
    
        async train(){
            console.log('balancing');
            //shuffle attempt
            let len = Math.min(this.training_data[0].length, this.training_data[1].length, this.training_data[2].length);
            if(!len){
                console.log('nothing to train');
                return;
            }
            this.data_xs = [];
            this.data_ys = [];
            for(let index = 0; index < 3; index++){
                this.data_xs.push(...this.training_data[index].slice(0, len));
                this.data_ys.push(...Array(len).fill([index==0?1:0, index==1?1:0, index==2?1:0]));
            }
            console.log('training');
            const xs = tf.tensor(this.data_xs);
            const ys = tf.tensor(this.data_ys);

            console.log('training2');
            await this.model.fit(xs, ys);

            console.log('trained');
        
        }
    
        predict_move(){
            if(this.last_data_object != null){
                //use this.last_data_object for input data
                //do prediction here
                //return -1/0/1
                let prediction = this.model.predict(tf.tensor([this.last_data_object]));
                return tf.argMax(prediction, 1).dataSync()-1;
            }
        
        }
    }
}