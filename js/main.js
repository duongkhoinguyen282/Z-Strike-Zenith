//----- VARIABLES -----//
//#region VARIABLES

const none = "transparent";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = screen.width;
canvas.height = screen.height;

const STD_MEASUREMENT = canvas.width;

const pitch = canvas.height * 0.009375;
const goal_frame = canvas.height * 0.015625;

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

const score_board = new Score_Board();

//#endregion VARIABLES

//----- MAIN CODE -----//
//#region MAIN CODE

// render game
animate();

//#endregion MAIN CODE

//----- FUNCTIONS -----//
//#region FUNCTIONS

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

        player.render();
        ball.render();
        score_board.render(ball);

    }

    // if the game is not fullscreen users are not allowed to play
    else{
        // prevent character moving 
        player.input.left = false;
        player.input.right = false;    
        player.input.up = false;
        player.input.down = false;     
        
        // some notes for users
        let text_position = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        }

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);   

        ctx.fillStyle = "white";
        ctx.font = "50px Times";
        ctx.fillText("Press F11 to have a better experience", text_position.x, text_position.y - 50);
        ctx.fillText("Use \"Arrows\" to move the player", text_position.x, text_position.y + 50);
        ctx.fillText("Press \"Space\" to kick the ball or hold for stronger power", text_position.x, text_position.y + 100);
        ctx.textAlign = "center";
    }
}

//#endregion FUNCTIONS