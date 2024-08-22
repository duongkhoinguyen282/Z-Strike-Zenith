class Score_Board {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        }
        this.width = canvas.width;
        this.height = canvas.height * 0.2;
        this.home = 0;
        this.away = 0;

        this.is_a_goal = false;
    }

    is_home_goal(ball){
        if(!this.is_a_goal && ball.position.x - ball.radius > ad_board.top_right.x){
            this.home++;
            return true;
        }

        return false;
    }
    is_away_goal(ball){
        if(!this.is_a_goal && ball.position.x + ball.radius < ad_board.top_left.x + ad_board.width){
            this.away++;
            return true;
        }
        
        return false;
    }

    update(ball){
        // if it is a goal, the ball will return to kick-off position
        if(this.is_home_goal(ball) || this.is_away_goal(ball)){
            this.is_a_goal = true;
            
            ball.position.x = ball.initial_position.x;
            ball.position.y = ball.initial_position.y;

            ball.velocity.x = 0;
            ball.velocity.y = 0;
        }

        if(this.is_a_goal && ball.position.x == ball.initial_position.x && ball.position.y == ball.initial_position.y){
            this.is_a_goal = false;
        }

        console.log("Home: " + this.home + " - Away: " + this.away);
        }  
    
    draw(){
        ctx.fillStyle = none;
        ctx.fillRect(0, 0, this.width, this.height);

        let text_position = {
            x: this.width / 2,
            y: this.height / 2,
        }

        ctx.fillStyle = "white";
        ctx.font = "50px Times";
        ctx.fillText("HOME                  AWAY", text_position.x, text_position.y);
        ctx.fillText(`${this.home}                            ${this.away}`, text_position.x, text_position.y + 60);
        ctx.textAlign = "center";
    }

    render(ball){
        this.update(ball);
        this.draw();
    }
}