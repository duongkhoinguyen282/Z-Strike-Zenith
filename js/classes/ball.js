class Ball{
    constructor(){
        this.position = {
            x: stadium.position.x + stadium.width / 2,
            y: stadium.position.y + stadium.height / 2,
        }
        this.radius = STD_MEASUREMENT * 0.009;

        this.velocity = {
            x: 0,
            y: 0,
        }
    }

    update(){
        this.velocity.x *= 0.95;
        this.velocity.y *= 0.95;

        if(this.position.x - this.radius + this.velocity.x < stadium.position.x){
            this.position.x = this.radius + stadium.position.x;
            this.velocity.x *= -1;
        }
        if(this.position.x + this.radius + this.velocity.x > stadium.position.x + stadium.width){
            this.position.x = stadium.position.x + stadium.width - this.radius;
            this.velocity.x *= -1;
        }
        if(this.position.y - this.radius + this.velocity.y < stadium.position.y){
            this.position.y = this.radius + stadium.position.y;
            this.velocity.y *= -1;
        }
        if(this.position.y + this.radius + this.velocity.y > stadium.position.y + stadium.height){
            this.position.y = stadium.position.y + stadium.height - this.radius;
            this.velocity.y *= -1;
        }  

        if((this.position.y > ad_board.top_left.y && this.position.y < ad_board.top_left.y + ad_board.height + goal_frame)
            || (this.position.y > ad_board.bottom_left.y - goal_frame && this.position.y < ad_board.bottom_left.y + ad_board.height)){
                if(this.position.x - this.radius + this.velocity.x < ad_board.top_left.x + ad_board.width + pitch){
                    this.position.x = this.radius + ad_board.top_left.x + ad_board.width + pitch;
                    this.velocity.x *= -1;
                }
                if(this.position.x + this.radius + this.velocity.x > ad_board.top_right.x - pitch){
                    this.position.x = ad_board.top_right.x - pitch - this.radius;
                    this.velocity.x *= -1;
                }
            }
    
            if((this.position.x > ad_board.top_left.x && this.position.x < ad_board.top_left.x + ad_board.width + pitch)
            || (this.position.x > ad_board.top_right.x - pitch && this.position.y < ad_board.top_right.x + ad_board.width)){
                if(this.position.y - this.radius + this.velocity.y < ad_board.top_left.y + ad_board.height + goal_frame){
                    this.position.y = this.radius + ad_board.top_left.y + ad_board.height + goal_frame;
                    this.velocity.y *= -1;
                }
                if(this.position.y + this.radius + this.velocity.y > ad_board.bottom_left.y - goal_frame){
                    this.position.y = ad_board.bottom_left.y - goal_frame - this.radius;
                    this.velocity.y *= -1;
                }
            }

        // update new position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    
    draw(){
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.fill();  
    }

    render(){
        this.update();
        this.draw();
    }
}