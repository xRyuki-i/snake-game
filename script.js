const board = document.querySelector('#board');
let lastRenderTime = 0;
let isGameOver = false;
const SNAKE_SPEED = 5;

function main(currentTime) {
    if (isGameOver) {
        if (confirm('You lost. Press ok to restart.')) {
            window.location = '/';
        }
        return
    }

    window.requestAnimationFrame(main);
    const secondSinceLastRender = (currentTime - lastRenderTime) / 1000;
    if (secondSinceLastRender < 1 / SNAKE_SPEED) return;

    lastRenderTime = currentTime;

    update();
    render();
}

window.requestAnimationFrame(main);

function update() {
    updateSnake();
    updateFood();
    checkDeath();
}

function render() {
    board.innerHTML=''
    renderSnake(board);
    renderFood(board)
}

function checkDeath() {
    isGameOver = isOutsideGrid(getSnakeHead()) || isIntersecting()
}

//snake.js
const snakes = [
    {x:7,y:7},
]
let newSnake = 0;

function updateSnake() {
    addSnake();
    const inputDirection = getInputDirection();
    for (i = (snakes.length - 2); i>=0; i--){
        snakes[i+1] = {...snakes[i]};
    }
    snakes[0].x += inputDirection.x;
    snakes[0].y += inputDirection.y;
}

function renderSnake(board) {
    snakes.map(snake => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridColumnStart = snake.x;
        snakeElement.style.gridRowStart = snake.y;
        snakeElement.classList.add('snake');
        board.appendChild(snakeElement);
    })
}

function expandSnake(amount) {
    newSnake += amount;
}

function onSnake(position, { ignoreHead = false} = {}) {
    return snakes.some((snake, index) => {
        if (ignoreHead && index===0) return false
        return equalPositions(snake, position);
    })
}

function equalPositions(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}

function addSnake() {
    for (let i=0; i<newSnake; i++) {
        snakes.push({ ...snakes[snakes.length-1]})
    }
    newSnake = 0;
}

function getSnakeHead() {
    return snakes[0];
}

function isIntersecting() {
    return onSnake(snakes[0], { ignoreHead: true })
}

//input.js
let inputDirection = {x:0, y:0};
let lastInputDirection = {x:0, y:0};

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastInputDirection.y !== 0) break;
            inputDirection = {x:0, y:-1};
            break;
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) break;
            inputDirection = {x:0, y:1};
            break;
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) break;
            inputDirection = {x:-1, y:0};
            break;
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) break;
            inputDirection = {x:1, y:0};
            break;
    }
})

function getInputDirection() {
    lastInputDirection = inputDirection;
    return inputDirection;
}

//food

let food = getRandomFoodPosition();

function updateFood() {
    if (onSnake(food)) {
        expandSnake(1);
        food = getRandomFoodPosition();
    }
}

function renderFood(board) {
    const foodElement = document.createElement('div');
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.gridRowStart = food.y;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (newFoodPosition == null || onSnake(newFoodPosition)) {
        newFoodPosition = randomGridPosition()
    }
    return newFoodPosition;
}

//grid.js

function randomGridPosition() {
    return {
        x: Math.floor(Math.random() * 14)+1,
        y: Math.floor(Math.random() * 14)+1
    }
}

function isOutsideGrid(position) {
    return (
        position.x<1 || position.x > 14 ||
        position.y<1 || position.y > 14
    )
}
