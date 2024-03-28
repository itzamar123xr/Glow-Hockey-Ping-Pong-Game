const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 18,
    paddleHeight = 120,
    paddleSpeed = 8,
    ballRadius = 12,
    initialBallSpeed = 8,
    maxBallSpeed = 40,
    netWidth = 5,
    netColor = "rgba(255,255,255,0.8)",
    glowColor = "rgba(255,255,255,0.5)",
    goalScore = 5; // Score limit to win the game

let userScore = 0,
    comScore = 0;

// Paddle objects
const userPaddle = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "red",
};

const comPaddle = {
    x: canvas.width - paddleWidth - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "blue",
};

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    velocityX: initialBallSpeed,
    velocityY: initialBallSpeed,
    speed: initialBallSpeed,
    color: "white",
};

// Load sound effects
const collisionSound = new Audio("collision_sound.wav");
const scoreSound = new Audio("score_sound.wav");

// Play sound effect for ball collisions
function playCollisionSound() {
    collisionSound.play();
}

// Play sound effect for scoring
function playScoreSound() {
    scoreSound.play();
}

// Draw net on canvas
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
    }
}

// Draw rectangle on canvas with glow effect
function drawRect(x, y, width, height, color) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = glowColor;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.shadowBlur = 0; // Reset shadow
}

// Draw a circle on canvas with glow effect
function drawCircle(x, y, radius, color) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = glowColor;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
}

// Draw text on canvas
function drawText(text, x, y, color, fontSize = 60, fontWeight = "bold", font = "Courier New") {
    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

// Move user paddle with mouse or touch controls
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    userPaddle.y = e.clientY - rect.top - userPaddle.height / 2;
});

canvas.addEventListener("touchmove", function (e) {
    const rect = canvas.getBoundingClientRect();
    userPaddle.y = e.touches[0].clientY - rect.top - userPaddle.height / 2;
});

// Update game logic
function update() {
    // Update ball position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collisions with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Ball collisions with paddles
    if (ball.x - ball.radius < userPaddle.x + userPaddle.width && ball.x + ball.radius > userPaddle.x &&
        ball.y - ball.radius < userPaddle.y + userPaddle.height && ball.y + ball.radius > userPaddle.y) {
        ball.velocityX = -ball.velocityX;
        playCollisionSound();
    }

    if (ball.x - ball.radius < comPaddle.x + comPaddle.width && ball.x + ball.radius > comPaddle.x &&
        ball.y - ball.radius < comPaddle.y + comPaddle.height && ball.y + ball.radius > comPaddle.y) {
        ball.velocityX = -ball.velocityX;
        playCollisionSound();
    }

    // Check if ball goes out of bounds
    if (ball.x - ball.radius < 0) {
        comScore++;
        resetBall();
        playScoreSound();
    } else if (ball.x + ball.radius > canvas.width) {
        userScore++;
        resetBall();
        playScoreSound();
    }

    // Update computer paddle position
    comPaddle.y += (ball.y - (comPaddle.y + comPaddle.height / 2)) * 0.1;

    // Check if either player reached goal score
    if (userScore >= goalScore || comScore >= goalScore) {
        endGame();
    }
}

// Reset ball position and velocity
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX; // Reverse direction
    ball.speed = initialBallSpeed;
}

// Render game on canvas
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    drawRect(comPaddle.x, comPaddle.y, comPaddle.width, comPaddle.height, comPaddle.color);

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Draw scores
    drawText(userScore, canvas.width / 4, 100, "white", 60);
    drawText(comScore, (3 * canvas.width) / 4, 100, "white", 60);
}

// Run game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
