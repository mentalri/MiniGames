const snakeboard = document.getElementById("gameCanvas");
const snakeboard_ctx = snakeboard.getContext("2d");
snakeboard.width = document.getElementById("background").offsetWidth * 0.3419;
snakeboard.height = document.getElementById("background").offsetWidth * 0.3419;
const board_background = "#373737";
const board_border = "#0d0d0d";
const snakeBodyPartSize = snakeboard.width * 0.025;
let snake = [{ x: 200, y: 200 }, { x: 200 - snakeBodyPartSize, y: 200 }];
let dx = snakeBodyPartSize;
let dy = 0;
let play = false;
let delay = 170;
let food = { x: Math.floor(((Math.random() * snakeboard.width - snakeBodyPartSize) / snakeBodyPartSize) * snakeBodyPartSize), y: Math.floor(((Math.random() * snakeboard.width - snakeBodyPartSize) / snakeBodyPartSize) * snakeBodyPartSize) };
let eatenOnLastTick = false;
let notStopAble = true;

window.addEventListener("load", loadedListener);
document.addEventListener("keydown", changeDirection);

function loadedListener() {

    clearCanvas();
    snakeboard_ctx.font = snakeboard.width * 0.15 + "px Comic Sans MS";
    snakeboard_ctx.fillStyle = "red";
    snakeboard_ctx.textAlign = "center";
    snakeboard_ctx.fillText("Play", snakeboard.width / 2, snakeboard.height / 2);
}

function togglePlay() {
    if (play)
        stop();
    else
        start();
}

function stop() {
    if (notStopAble)
        return;

    play = false;
    setTimeout(function() {
        clearCanvas();
        snakeboard_ctx.fillStyle = "red";
        snakeboard_ctx.fillText("paused", snakeboard.width / 2, snakeboard.height / 2);
    }, 300);
}

function start() {
    play = true;
    notStopAble = true;
    clearCanvas();
    snakeboard_ctx.fillStyle = "red";
    snakeboard_ctx.fillText("3", snakeboard.width / 2, snakeboard.height / 2);
    setTimeout(function() {
        clearCanvas();
        snakeboard_ctx.fillStyle = "red";
        snakeboard_ctx.fillText("2", snakeboard.width / 2, snakeboard.height / 2);
    }, 1000);
    setTimeout(function() {
        clearCanvas();
        snakeboard_ctx.fillStyle = "red";
        snakeboard_ctx.fillText("1", snakeboard.width / 2, snakeboard.height / 2);
    }, 2000);
    setTimeout(function() {
        notStopAble = false;
        main();
    }, 3000);
}

function main() {
    setTimeout(function onTick() {
        clearCanvas();
        moveSnake();
        if (hasGameEnded()) {
            snakeboard_ctx.fillStyle = "red";
            snakeboard_ctx.fillText("defeat", snakeboard.width / 2, snakeboard.height / 2);
            play = false;
            snake = [{ x: 200, y: 200 }, { x: 200 - snakeBodyPartSize, y: 200 }];
            delay = 170;
            food = { x: Math.floor(((Math.random() * snakeboard.width - snakeBodyPartSize) / snakeBodyPartSize) * snakeBodyPartSize), y: Math.floor(((Math.random() * snakeboard.width - snakeBodyPartSize) / snakeBodyPartSize) * snakeBodyPartSize) };
        } else {
            drawFood();
            drawSnake();
        }
        if (foodEaten()) {
            food = { x: Math.floor(((Math.random() * snakeboard.width - snakeBodyPartSize) / snakeBodyPartSize) * snakeBodyPartSize), y: Math.floor(((Math.random() * snakeboard.width - snakeBodyPartSize) / snakeBodyPartSize) * snakeBodyPartSize) };
            eatenOnLastTick = true;
            delay = delay - 3;
        }
        if (play)
            main();
    }, delay);

}

function clearCanvas() {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokestyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (!eatenOnLastTick)
        snake.pop();
    eatenOnLastTick = false;
}

function drawSnakePart(snakePart) {

    snakeboard_ctx.fillStyle = "#0000ff"
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, snakeBodyPartSize, snakeBodyPartSize);
    snakeboard_ctx.strokestyle = '#000080';
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, snakeBodyPartSize, snakeBodyPartSize);
}

function hasGameEnded() {
    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            return true;
        }
    }

    return snake[0].x < 0 || snake[0].x + snakeBodyPartSize > snakeboard.width || snake[0].y < 0 || snake[0].y + snakeBodyPartSize > snakeboard.height;
}

function drawFood() {
    snakeboard_ctx.fillStyle = "#ffff00"
    snakeboard_ctx.fillRect(food.x, food.y, snakeBodyPartSize, snakeBodyPartSize);
    snakeboard_ctx.strokestyle = '#9b9b00';
    snakeboard_ctx.strokeRect(food.x, food.y, snakeBodyPartSize, snakeBodyPartSize);
}

function foodEaten() {
    if (snake[0].x > food.x && snake[0].x < food.x + snakeBodyPartSize && snake[0].y > food.y && snake[0].y < food.y + snakeBodyPartSize) {
        return true;
    }
    if (snake[0].x + snakeBodyPartSize >= food.x && snake[0].x + snakeBodyPartSize <= food.x + snakeBodyPartSize && snake[0].y >= food.y && snake[0].y <= food.y + snakeBodyPartSize) {
        return true;
    }
    if (snake[0].x >= food.x && snake[0].x <= food.x + snakeBodyPartSize && snake[0].y + snakeBodyPartSize >= food.y && snake[0].y + snakeBodyPartSize <= food.y + snakeBodyPartSize) {
        return true;
    }
    if (snake[0].x + snakeBodyPartSize >= food.x && snake[0].x + snakeBodyPartSize <= food.x + snakeBodyPartSize && snake[0].y + snakeBodyPartSize >= food.y && snake[0].y + snakeBodyPartSize <= food.y + snakeBodyPartSize) {
        return true;
    }

    return false;
}

function changeDirection(event) {

    if (event.keyCode === 32)
        togglePlay();

    if (play) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        const keyPressed = event.keyCode;
        const goingUp = dy === -1 * snakeBodyPartSize;
        const goingDown = dy === snakeBodyPartSize;
        const goingRight = dx === snakeBodyPartSize;
        const goingLeft = dx === -1 * snakeBodyPartSize;

        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -1 * snakeBodyPartSize;
            dy = 0;
        }

        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -1 * snakeBodyPartSize;
        }

        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = snakeBodyPartSize;
            dy = 0;
        }

        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = snakeBodyPartSize;
        }
    }

}