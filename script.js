var bricks = [];
var colors = ["red", "green", "blue", "yellow"];

function startGame() {
    for (let x = 0; x < 20; x++) {
        bricks.push([]);
        for (let y = 0; y < 20; y++) {
            bricks[x].push(new Sprite(50, 50, `${colors[Math.floor(Math.random() * colors.length)]}`, x * 50, y * 50))
            bricks[x][y].accelerationY = 0;
        }
    }

    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

class Sprite {
    constructor (width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.start_x = x;
        this.start_y = y;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.visible = true;
        this.emptyBelow = false;
    }

    reset() {
        this.x = this.start_x;
        this.y = this.start_y;
        this.speedX = 0;
        this.speedY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
    }

    move() {
        if (this.emptyBelow) {
            this.speedY = 10;
            this.speedX = this.speedX + this.accelerationX;
            this.speedY = this.speedY + this.accelerationY;
            this.x = this.x + this.speedX;
            this.y = this.y + this.speedY;
        } else {
            this.speedX = 0;
            this.speedY = 0;
        }
    };

    destroy() {
        if (this.visible) {
        this.visible = false;
             for (let row of bricks) {
                for (let brick of row) {
                    if (brick.x + brick.width === this.x && brick.y === this.y && brick.color === this.color
                    || brick.x - brick.width === this.x && brick.y === this.y && brick.color === this.color
                    || brick.x === this.x && brick.y + brick.height === this.y && brick.color === this.color
                    || brick.x === this.x && brick.y - brick.height === this.y && brick.color === this.color) {
                        brick.destroy();
                    }
                }
             }

        }
    }

    initiateDestroy () {
        for (let row of bricks) {
            for (let brick of row) {
                if (brick.x + brick.width === this.x && brick.y === this.y && brick.color === this.color
                || brick.x - brick.width === this.x && brick.y === this.y && brick.color === this.color
                || brick.x === this.x && brick.y + brick.height === this.y && brick.color === this.color
                || brick.x === this.x && brick.y - brick.height === this.y && brick.color === this.color) {
                    this.destroy()
                }
            }
        }
    }

    checkEmptyBelow() {
        this.emptyBelow = (myGameArea.context.getImageData(this.x, this.y+this.height, 1, 1).data.toString() === "255,255,255,255")
    }

    update() {
        if (this.visible) {
            this.move();

            let ctx = myGameArea.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

function updateGameArea() {

    myGameArea.clear();
    myGameArea.context.fillStyle = "white";
    myGameArea.context.fillRect(0,0, myGameArea.canvas.width, myGameArea.canvas.height);
    for (let row of bricks) {
        for (let brick of row) {
            brick.update();
        }
    }for (let row of bricks) {
        for (let brick of row) {
            brick.checkEmptyBelow();
        }
    }
}

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    for (let row of bricks) {
        for (let brick of row) {
            if (brick.x <= x && brick.x+brick.width >= x && brick.y <= y && brick.y+brick.height >= y) {
                brick.initiateDestroy()
            }
        }
    }
}

myGameArea.canvas.addEventListener("mousedown", function(e) {
    getMousePosition(myGameArea.canvas, e);
});

startGame();
