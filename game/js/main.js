"use strict";
let app = new PIXI.Application(800, 600, {
    backgroundColor: 0x808080
});

document.querySelector("#game").appendChild(app.view);
// Constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// Pre-load the images
PIXI.loader.
add([]).on("progress", e => {
    console.log(`progress=${e.progress}`)
}).
load(setup);

// Game State enum
const gameState = Object.freeze({
    StartScene: 0,
    GameScene: 1,
    ControlScene: 2,
    GameOverScene: 3
});

const enemyType = Object.freeze({
    Water: 1,
    Lava: 2,
    Goo: 3,
    Poison: 4,
    Chocolate: 5,
    Pee: 6,
    Ice: 7,
    Milk: 8
});

// Aliases
let stage;

// Field for local storage
const prefix = "Playersenses-";
let storedHighScore = localStorage.getItem(prefix + "highScore");
let highScore;
// Field for game variables
let enemysTextures = [];
let backgroundImgs = [];

let startScene;
let gameScene;
let controlsScene;
let player;
let timeLabel;
let waterDropSound, fireSound, gooSound, poisonSound, chocolateSound, peeSound, enemyNitroSound, milkSound;
let hitSound, loseSound;
let gameOverScene;
let gameOverTimeLabel;
let highScoreLabel;
let dt;
// Game Scene variables
let divider = 8;
let division = (sceneWidth - 250) / divider;
let randomNum;

let circles = [];
let enemys = [];
let playerTextures;
let crawlAnimation;
let time = 0;
let timeToFire = 0;
let paused = true;
let currentScene;
/// Set up the scenes
function setup() {
    // Create the 'controls scene'
    //controlsScene = new PIXI.Container();
    //controlsScene.visible = false;
    //stage.addChild(controlsScene); 

    // Load background images

    // Load the enemy sprites

    // Create the `start` scene

    // Create the main `game` scene and make it invisible

    // Add the pipettes

    // Create the `controls` scene

    // Create the `gameOver` scene and make it invisible

    // Create labels for all 3 scenes
    createLabelsAndButtons();

    player = new Player(300, 250, 250);

    // Load Sounds
    // waterDropSound, fire, goo, poison, chocolate, pee, enemyNitro;

    // Load player spritesheet
    // playerTextures = loadSpriteSheet();
    // crawlAnimation = new PIXI.extras.AnimatedSprite(playerTextures);

    // Start update loop

}

// For creatings labels and buttons
function createLabelsAndButtons() {
    // Start Scene
    // The title
    let title = new PIXI.Text("Player Senses");
    title.style = new PIXI.TextStyle({
        fill: 0xBA55D3,
        fontSize: 100,
        fontFamily: 'Futura',
        stoke: 0xFF0000,
        strokeThickness: 12
    });
    title.x = sceneWidth / 4 - 70;
    title.y = 120;
    startScene.addChild(title);

    let playStyle = new PIXI.TextStyle({
        fill: 0xe75480,
        fontSize: 50,
        fontFamily: "Arial",
        stroke: 0x000000,
        strokeThickness: 4
    });

    // How to play text
    let howToPlay = new PIXI.Text("Press C for Controls");
    howToPlay.style = playStyle;
    howToPlay.x = 200;
    howToPlay.y = sceneHeight - 140;
    startScene.addChild(howToPlay);

    // Start game text
    let startButton = new PIXI.Text("Press Enter to Play");
    startButton.style = playStyle;
    startButton.x = 200;
    startButton.y = sceneHeight - 260;
    startScene.addChild(startButton);

    // 2 - set up `gameScene`
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 30,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    // Make time label
    timeLabel = new PIXI.Text("Time " + time);
    timeLabel.style = new PIXI.TextStyle({
        fill: 0xBEFF00,
        fontSize: 50,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 6
    });
    timeLabel.x = 5;
    timeLabel.y = 5;
    gameScene.addChild(timeLabel);

    // Game Over Text    
    textStyle = new PIXI.TextStyle({
        fill: 0xBE0000,
        fontSize: 90,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 6
    });
    let gameOverText = new PIXI.Text("Game Over!");
    gameOverText.style = textStyle;
    gameOverText.x = sceneWidth / 4;
    gameOverText.y = sceneHeight / 12;
    gameOverScene.addChild(gameOverText);

    // Actual time
    gameOverTimeLabel = new PIXI.Text();
    gameOverTimeLabel.style = textStyle;
    gameOverTimeLabel.x = sceneWidth / 12 + 30;
    gameOverTimeLabel.y = sceneHeight / 2 - 100;
    gameOverScene.addChild(gameOverTimeLabel);

    // High score label
    highScoreLabel = new PIXI.Text();
    highScoreLabel.style = textStyle;
    highScoreLabel.x = sceneWidth / 12 + 10;
    highScoreLabel.y = sceneHeight / 2;
    gameOverScene.addChild(highScoreLabel);

    let overStyle = new PIXI.TextStyle({
        fill: 0x016699,
        fontSize: 44,
        fontFamily: "Arial",
        stroke: 0x000000,
        strokeThickness: 4
    });

    // Make play again text
    let playAgainText = new PIXI.Text("Press R to Play Again");
    playAgainText.style = overStyle;
    playAgainText.x = sceneWidth / 4;
    playAgainText.y = sceneHeight - 175;
    gameOverScene.addChild(playAgainText);

    // Make quit text
    let quitText = new PIXI.Text("Press Q to Quit");
    quitText.style = overStyle;
    quitText.x = sceneWidth / 4;
    quitText.y = sceneHeight - 100;
    gameOverScene.addChild(quitText);

    // Make how to play text
    let howToTitleCtor = new PIXI.TextStyle({
        fill: 0xFFFF00,
        fontSize: 90,
        fontFamily: "Futura",
        stroke: 0x000000,
        strokeThickness: 6
    });
    let howToTitle = new PIXI.Text("How To Play");
    howToTitle.style = howToTitleCtor;
    howToTitle.x = sceneWidth / 5 + 10;
    howToTitle.y = 35;
    controlsScene.addChild(howToTitle);

    // Make instructions
    let controlTxtStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 40,
        fontFamily: "Arial",
        stroke: 0x000000,
        strokeThickness: 5
    });
    let instructions = new PIXI.Text("- Player crawls around the\ncontainer with the WASD keys." +
        "\n\n- Your goal is to survive the\nlongest time by avoiding the\nlethal enemys falling from above.");
    instructions.style = controlTxtStyle;
    instructions.x = sceneWidth / 6;
    instructions.y = sceneHeight / 4 + 20;
    controlsScene.addChild(instructions);

    let sGoBack = new PIXI.Text("Press Q to go back");
    sGoBack.style = new PIXI.TextStyle({
        fill: 0xe75480,
        fontSize: 50,
        fontFamily: 'Futura',
        stoke: 0xFF0000,
        strokeThickness: 4
    });
    sGoBack.x = sceneWidth / 4;
    sGoBack.y = sceneHeight - 100;
    controlsScene.addChild(sGoBack);
}

function quitGame() {
    currentScene = gameState.StartScene;
    startScene.visible = true;
    controlsScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = false;
}

function viewControls() {
    currentScene = gameState.ControlScene;
    startScene.visible = false;
    controlsScene.visible = true;
    gameOverScene.visible = false;
    gameScene.visible = false;
}

function fromControlsToStart() {
    currentScene = gameState.StartScene;
    startScene.visible = true;
    controlsScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = false;
}

// Clicking the button calls startGame()
function startGame() {
    currentScene = gameState.GameScene;

    gameScene.addChild(player);
    player.x = 450;
    player.y = sceneHeight - 50;
    time = 0;
    timeToFire = 0.5;
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
}

// Load game over scene
function end() {
    //paused = true;
    currentScene = gameState.GameOverScene;

    // clear out the level
    enemys.forEach(b => gameScene.removeChild(b)); // ditto
    enemys = [];

    loseSound.play();
    let score = roundToTwoDP(time);
    gameOverTimeLabel.text = "Your Time: " + score + " s";

    // Local storage
    if (storedHighScore == null || parseInt(storedHighScore, 10) < score) {
        score = JSON.stringify(score);
        localStorage.setItem(prefix + "highScore", score);
    }
    
    // Retrieve the current high score
    storedHighScore = localStorage.getItem(prefix + "highScore");
    storedHighScore = JSON.parse(storedHighScore);
    highScoreLabel.text = "High Score: " + storedHighScore + "s";

    startScene.visible = false;
    controlsScene.visible = false;
    gameOverScene.visible = true;
    gameScene.visible = false;
}