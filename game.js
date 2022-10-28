//khai báo biến
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
const GAME_SWIDTH = 400;
const UNIT = 20;
canvas.width = canvas.height = GAME_SWIDTH;
let BACKGROUND_COLOR = 'darkcyan';
context.fillStyle = BACKGROUND_COLOR;
context.fillRect(0, 0, GAME_SWIDTH, GAME_SWIDTH);
const GAME_DELAY = 100;
const [LEFT, UP, RIGHT, DOWN] = [37, 38, 39, 40];

//khai báo tọa độ
class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let currentDirection = new Vector2d(1, 0);

//hàm Snake
class Snake {
    constructor() {
        this.body = [new Vector2d(UNIT * 6, UNIT * 3),
                    new Vector2d(UNIT * 7, UNIT * 3)];
        this.head = this.body[0];
        this.moves = new Vector2d(1, 0);
    }

//vẽ snake
    draw() {
        context.fillStyle = 'blue';
        context.fillRect(this.body[0].x, this.body[0].y, UNIT, UNIT);
        context.fillStyle = 'red';
        for (let i = 1; i < this.body.length; i++) {
            context.fillRect(this.body[i].x, this.body[i].y, UNIT, UNIT);
        }
    }

// xóa vị trí snake đã đi qua
    clear() {
        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(this.body[0].x, this.body[0].y, UNIT, UNIT);
        for (let i = 1; i < this.body.length; i++) {
            context.fillRect(this.body[i].x, this.body[i].y, UNIT, UNIT);
        }
    }

// snake đi xuyên tường
    handleBound() {
        if (this.head.x < 0) {
            this.head.x = GAME_SWIDTH;
        }
        if (this.head.x > GAME_SWIDTH) {
            this.head.x = 0;
        }
        if (this.head.y < 0) {
            this.head.y = GAME_SWIDTH;
        }
        if (this.head.y > GAME_SWIDTH) {
            this.head.y = 0;
        }
    }

// kiểm tra chết
    checkDead() {
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === this.head.x && this.body[i].y === this.head.y) {
                return true;
            }
        }
        return false;
    }

//snake dịch chuyển
    move() {
        this.clear();
        for (let i = this.body.length - 1; i >= 1; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        this.body[0].x = this.body[0].x + this.moves.x * UNIT;
        this.body[0].y = this.body[0].y + this.moves.y * UNIT;

        if (this.checkDead()) {
            clearInterval(myVar);
            console.log("die");
        }
        this.handleBound();
        this.draw();
    }

//kiểm tra ăn
    checkEat(food) {
        let head = this.body[0];
        return food.x === head.x && food.y === head.y;
    }

//khi ăn tăng thêm chiều dài
    grow() {
        this.clear();
        let snakeLength = this.body.length;
        let mountX = this.body[snakeLength - 1].x - this.body[snakeLength - 2].x;
        let mountY = this.body[snakeLength - 1].y - this.body[snakeLength - 2].y;

        let newPart = new Vector2d(this.body[snakeLength - 1].x + mountX, this.body[snakeLength - 1].y + mountY)
        this.body.push(newPart);
        this.draw();
    }
}

//hàm Food
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

//vẽ Food
    draw() {
        context.fillStyle = 'yellow';
        context.fillRect(this.x, this.y, UNIT, UNIT);
    }

//xóa vị trí Food
    clear() {
        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(this.x, this.y, UNIT, UNIT);
    }

//vị trí Food ngẫu nhiên
    getRandomNumber() {
        let randomNumber = Math.floor(Math.random() * GAME_SWIDTH);
        randomNumber = randomNumber - randomNumber % UNIT;
        return randomNumber;
    }

//xuất hiện Food ngẫu nhiên
    spawn() {
        this.clear();
        this.x = this.getRandomNumber();
        this.y = this.getRandomNumber();
        this.draw();
    }
}

//vẽ snake trên canvas
let player = new Snake();
player.draw();

//vẽ food trên canvas
let food = new Food();
food.spawn();

//nút start bắt đầu game
let isRun = false;
let myVar;
let score = 0;
let highScore = localStorage.getItem("highScore");
if (highScore === null) {
    highScore = 0;
}
document.getElementById("highScore").innerHTML = highScore;

function start() {
    if (isRun === false) {
        myVar = setInterval(() => {
            player.move();
            if (player.checkEat(food)) {
                player.grow();
                food.spawn();
                score++;
                document.getElementById("score").innerHTML = score;
            }
            if (player.checkDead()) {
                if (highScore < score) {
                    localStorage.setItem("highScore", score);
                }
            }
        }, GAME_DELAY);
        isRun = true;
    }
}

// nút reset game
function reset() {
    window.location.reload();

}

//hàm di chuyển snake
document.onkeydown = function (event) {
    switch (event.keyCode) {
        case LEFT:
            if (currentDirection.x === 1)
                break;
            player.moves = new Vector2d(-1, 0);
            currentDirection = new Vector2d(-1, 0);
            break;
        case RIGHT:
            if (currentDirection.x === -1)
                break;
            player.moves = new Vector2d(1, 0);
            currentDirection = new Vector2d(1, 0);
            break;
        case UP:
            if (currentDirection.y === 1)
                break;
            player.moves = new Vector2d(0, -1);
            currentDirection = new Vector2d(0, -1);
            break;
        case DOWN:
            if (currentDirection.y === -1)
                break;
            player.moves = new Vector2d(0, 1);
            currentDirection = new Vector2d(0, 1);
            break;
        default:
            break;
    }
}