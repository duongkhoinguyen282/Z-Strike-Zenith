class Player{
    constructor({ position }){
        this.position = position
        this.radius = STD_MEASUREMENT * 0.018;
        
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.acceleration = this.radius * 0.005;

        this.normal_speed = this.radius * 0.1; // need to lower the speed later to 0.2
        this.sprint_speed = this.radius * 0.2;

        this.shot_power = this.radius;
        this.can_kick = false;
        
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false,

            sprint: false,
            kick: false,
        };
    }

    handle_input(){
        window.addEventListener("keydown", (event) => {
            if(event.key == "ArrowLeft"){
                this.input.left = true;
            }
            if(event.key == "ArrowRight"){
                this.input.right = true;
            }
            if(event.key == "ArrowUp"){
                this.input.up = true;
            }
            if(event.key == "ArrowDown"){
                this.input.down = true;
            }

            if(event.key == "Shift"){
                this.input.sprint = true;
            }
            if(event.key == " "){
                this.input.kick = true;
            }
        });

        window.addEventListener("keyup", (event) => {
            if(event.key == "ArrowLeft"){
                this.input.left = false;  
            }
            if(event.key == "ArrowRight"){
                this.input.right = false;             
            }
            if(event.key == "ArrowUp"){
                this.input.up = false;
            }
            if(event.key == "ArrowDown"){
                this.input.down = false;
            }

            if(event.key == "Shift"){
                this.input.sprint = false;
            }
            if(event.key == " "){
                this.input.kick = false;
                console.log("stop");
            }
        })
    }

    update(){
        // handle input
        this.handle_input();

        this.check_collision(ball, 0.95);

        // stop moving
        if(!this.input.left && !this.input.right){
            this.velocity.x *= 0.9;
        }
        if(!this.input.up && !this.input.down){
            this.velocity.y *= 0.9;
        }

        // movement
        if(this.input.left){
            // console.log("I pressed left");
            this.velocity.x -= this.acceleration;
        }
        if(this.input.right){
            console.log("I pressed right");
            this.velocity.x += this.acceleration;
        }
        if(this.input.up){
            // console.log("I pressed up");
            this.velocity.y -= this.acceleration;
        }
        if(this.input.down){
            // console.log("I pressed down");
            this.velocity.y += this.acceleration;
        }

        // reach maximum speed
        let max_speed = this.normal_speed;

        if(this.input.sprint){
            max_speed = this.sprint_speed;
        }

        if(Math.abs(this.velocity.x) >= max_speed){
            this.velocity.x = max_speed * Math.sign(this.velocity.x);
        }
        if(Math.abs(this.velocity.y) >= max_speed){
            this.velocity.y = max_speed * Math.sign(this.velocity.y);
        }

        let temp_vel = {
            x: this.velocity.x,
            y: this.velocity.y,
        }

        // move diagonally
        if((this.input.left || this.input.right) && (this.input.up || this.input.down)){
            temp_vel.x /= Math.sqrt(2);
            temp_vel.y /= Math.sqrt(2);
        }

        // check boundaries
        if(this.position.x - this.radius + temp_vel.x < stadium.position.x){
            this.position.x = this.radius + stadium.position.x;
            temp_vel.x = 0;
        }
        if(this.position.x + this.radius + temp_vel.x > stadium.position.x + stadium.width){
            this.position.x = stadium.position.x + stadium.width - this.radius;
            temp_vel.x = 0;
        }
        if(this.position.y - this.radius + temp_vel.y < stadium.position.y){
            this.position.y = this.radius + stadium.position.y;
            temp_vel.y = 0;
        }
        if(this.position.y + this.radius + temp_vel.y > stadium.position.y + stadium.height){
            this.position.y = stadium.position.y + stadium.height - this.radius;
            temp_vel.y = 0;
        }   

        if((this.position.y > ad_board.top_left.y && this.position.y < ad_board.top_left.y + ad_board.height + goal_frame)
        || (this.position.y > ad_board.bottom_left.y - goal_frame && this.position.y < ad_board.bottom_left.y + ad_board.height)){
            if(this.position.x - this.radius + temp_vel.x < ad_board.top_left.x + ad_board.width + pitch){
                this.position.x = this.radius + ad_board.top_left.x + ad_board.width + pitch;
                temp_vel.x = 0;
            }
            if(this.position.x + this.radius + temp_vel.x > ad_board.top_right.x - pitch){
                this.position.x = ad_board.top_right.x - pitch - this.radius;
                temp_vel.x = 0;
            }
        }

        if((this.position.x > ad_board.top_left.x && this.position.x < ad_board.top_left.x + ad_board.width + pitch)
        || (this.position.x > ad_board.top_right.x - pitch && this.position.y < ad_board.top_right.x + ad_board.width)){
            if(this.position.y - this.radius + temp_vel.y < ad_board.top_left.y + ad_board.height + goal_frame){
                this.position.y = this.radius + ad_board.top_left.y + ad_board.height + goal_frame;
                temp_vel.y = 0;
            }
            if(this.position.y + this.radius + temp_vel.y > ad_board.bottom_left.y - goal_frame){
                this.position.y = ad_board.bottom_left.y - goal_frame - this.radius;
                temp_vel.y = 0;
            }
        }

        if(this.input.kick && this.can_kick){
            console.log("kick");
            this.kick(ball);
        }
    
        // update new position
        this.position.x += temp_vel.x;
        this.position.y += temp_vel.y;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fill();
    }

    render(){
        this.update();
        this.draw();
    }

    check_collision(object, push_power = 1){
        let delta = {
            x: this.position.x + this.velocity.x - object.position.x,
            y: this.position.y + this.velocity.y - object.position.y,
        }
        let delta_move = {
            x: this.position.x - (object.position.x + object.velocity.x),
            y: this.position.y - (object.position.y + object.velocity.y),
        };
    
        let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
        let distance_move = Math.sqrt(Math.pow(delta_move.x, 2) + Math.pow(delta_move.y, 2));
    
        let intersect = distance - (this.radius + object.radius);
        let intersect_move = distance_move - (this.radius + object.radius);
            
        let ax = (intersect / distance) * delta.x;
        let ay = (intersect / distance) * delta.y;
    
        if(intersect_move <= 0 || intersect <= 0){
            object.position.x += ax;
            object.position.y += ay; 

            if(object.velocity.x / this.velocity.x < 0){
                if(Math.abs(object.velocity.x) > Math.abs(this.velocity.x)){
                    this.velocity.x -= ax;
                }
                object.velocity.x *= -0.95;
            }
            if(object.velocity.y / this.velocity.y < 0){
                if(Math.abs(object.velocity.y) > Math.abs(this.velocity.y)){
                    this.velocity.y -= ay;
                }
                object.velocity.y *= -0.95;
            }
    
            player.can_kick = true;
    
            push_power = Math.min(Math.max(push_power, 0), 1);
    
            if(object.is_blocked.x){
                this.velocity.x = 0;
                // object.velocity.x = 0;
                ax = 0;
            }
            else{
                this.velocity.x *= push_power;
            }
            if(object.is_blocked.y){
                this.velocity.y = 0;
                // object.velocity.y = 0;
                ay = 0;
            }
            else{
                this.velocity.y *= push_power;
            }
    
            object.velocity.x += ax;
            object.velocity.y += ay;
        }
    }

    kick(object){
        player.can_kick = false;

        let delta = {
            x: this.position.x - object.position.x,
            y: this.position.y - object.position.y,
        }

        let pptn = Math.abs(delta.y / delta.x); // proportion between delta.y and delta.x

        let shot_power_x = this.shot_power / Math.sqrt(Math.pow(pptn, 2) + 1);
        let shot_power_y = pptn * shot_power_x;
        
        object.velocity.x -= shot_power_x * Math.sign(delta.x);
        object.velocity.y -= shot_power_y * Math.sign(delta.y);
    }
};