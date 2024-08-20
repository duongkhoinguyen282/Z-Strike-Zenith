//----- VARIABLES -----//
//#region VARIABLES

const none = "transparent";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

const STD_MEASUREMENT = canvas.width;

let pitch = canvas.height * 0.009375;
let goal_frame = canvas.height * 0.015625;

const stadium = {
    position: {
        x: goal_frame,
        y: canvas.height * 0.2 + pitch,        
    },
    width: canvas.width - goal_frame * 2,
    height: canvas.height * 0.8 - pitch * 2,
}

const ad_board = {
    width: canvas.height * 0.125,
    height: canvas.height * 0.26,
    color: "cadetblue",

    top_left: {
        x: 0,
        y: canvas.height * 0.2,
    },
    top_right: {
        x: canvas.width - canvas.height * 0.125,
        y: canvas.height * 0.2,
    },
    bottom_left: {
        x: 0,
        y: canvas.height - canvas.height * 0.26,
    },
    bottom_right: {
        x: canvas.width - canvas.height * 0.125,
        y: canvas.height - canvas.height * 0.26,
    },
}

const player = new Player({
    position: {
        x: stadium.position.x + stadium.width * 0.25,
        y: stadium.position.y + stadium.height * 0.5,
    }
});
const ball = new Ball();

//#endregion VARIABLES

//----- MAIN CODE -----//
//#region MAIN CODE



// render game
animate();

//#endregion MAIN CODE

//----- FUNCTIONS -----//
//#region FUNCTIONS

function resize_canvas() {
    canvas.width = screen.width;
    canvas.height = screen.height;
}

function resize_game(){
    resize_canvas();
}

function animate(){
    window.requestAnimationFrame(animate);

    // game runs
    if(window.innerWidth == screen.width && window.innerHeight == screen.height){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // console.log("running");

        // visualize score_board
        ctx.fillStyle = none;
        ctx.fillRect(0, 0, canvas.width * 0.5, canvas.height * 0.2);
        
        // visualize stadium
        ctx.fillStyle = none;
        ctx.fillRect(stadium.position.x, stadium.position.y, stadium.width, stadium.height);

        // visualize ad boards
        ctx.fillStyle = ad_board.color;
        ctx.fillRect(ad_board.top_left.x, ad_board.top_left.y, ad_board.width, ad_board.height);
        ctx.fillRect(ad_board.top_right.x, ad_board.top_right.y, ad_board.width, ad_board.height);
        ctx.fillRect(ad_board.bottom_left.x, ad_board.bottom_left.y, ad_board.width, ad_board.height);
        ctx.fillRect(ad_board.bottom_right.x, ad_board.bottom_right.y, ad_board.width, ad_board.height);
        
        check_collision(ball, player, 0);
        check_collision(player, ball, 0.9);

        player.render();
        ball.render();
    }

    // if the game is not fullscreen
    else{
        player.input.left = false;
        player.input.right = false;    
        player.input.up = false;
        player.input.down = false;        

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);   

        ctx.fillStyle = "white";
        ctx.font = "50px Times";
        ctx.fillText("Press F11 to have a better experience", window.innerWidth / 2, window.innerHeight / 2);
        ctx.textAlign = "center";
    }
}

function check_collision(object1, object2, push_power = 1){
    let delta = {
        x: object1.position.x - object2.position.x,
        y: object1.position.y - object2.position.y,
    }

    let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

    let intersect = distance - (object1.radius + object2.radius);
    
    let ax = (intersect / distance) * delta.x;
    let ay = (intersect / distance) * delta.y;

    if(intersect <= 0){
        player.can_kick = true;

        push_power = Math.min(Math.max(push_power, 0), 1);

        object2.velocity.x += ax * 0.5;
        object2.velocity.y += ay * 0.5;

        object1.velocity.x *= push_power;
        object1.velocity.y *= push_power;
    }

}

//#endregion FUNCTIONS