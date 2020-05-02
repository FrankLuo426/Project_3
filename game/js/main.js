//Enable strict mode
"use strict";

const app = new PIXI.Application(1200, 800);
document.body.appendChild(app.view);

// Constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

// Pre-load the images
PIXI.loader.
add(["media/Player.png","media/enemys/Toxic.png","media/enemys/Stupid.png","media/enemys/Troll.png", "media/background.jpg", "media/enemys/Fxxk.png"]).
on("progress", e=> {console.log(`progress=${e.progress}`)}).
load(setup);

// Game State enum
const gameState = Object.freeze({
    StartScene: 0,
    GameScene: 1,
    ControlScene: 2,
    GameOverScene: 3
});

const enemyType = Object.freeze({
    Fxxk: 1,
    Stupid: 2,
    Toxic: 3,
    Troll: 4,
});

// Aliases
let stage;

// Field for local storage
const prefix = "Playersenses-";
let storedHighScore = localStorage.getItem(prefix + "highScore");
let highScore;

// Field for game variables
let enemysTextures = [];
let background;

let startScene;
let gameScene;
let controlsScene;
let player;
let timeLabel;
let fxxkSound, stupidSound, toxicSound, trollSound;
let hitSound, loseSound;
let gameOverScene;
let gameOverTimeLabel;
let highScoreLabel;
let dt;

// Game Scene variables
let divider = 4;
let division = (sceneWidth - 100) / divider;
let randomNum;

let circles = [];
let enemys = [];
let crawlAnimation;
let time = 0;
let timeToFire = 0;
let paused = true;
let currentScene;

/// Set up the scenes
function setup() {
	stage = app.stage;
	//Create the start scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    //Create the main game scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    //Create the controls scene
    controlsScene = new PIXI.Container();
    controlsScene.visible = false;
    stage.addChild(controlsScene); 

    //Create the gameOver scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
    
    // Load the background sprites
    background = new Background(600,400);
    gameScene.addChild(background);

    // Create labels for all 3 scenes
    createLabelsAndButtons();

    // Load the enemy sprites
    enemysTextures.push(PIXI.loader.resources["media/enemys/Fxxk.png"].texture);
    enemysTextures.push(PIXI.loader.resources["media/enemys/Stupid.png"].texture);
    enemysTextures.push(PIXI.loader.resources["media/enemys/Toxic.png"].texture);
    enemysTextures.push(PIXI.loader.resources["media/enemys/Troll.png"].texture);

    //Create player
    player = new Player();
    gameScene.addChild(player);

    // Load Sounds
    // FxxkSound, stupid, Toxic, Troll
    fxxkSound = new Howl({
        src: ['media/sound/fxxk.mp3']
    });
    toxicSound = new Howl({
        src: ['media/sound/toxic.mp3']
    });
    stupidSound = new Howl({
        src: ['media/sound/stupid.mp3']
    });
    trollSound = new Howl({
        src: ['media/sound/troll.mp3']
    });
    loseSound = new Howl({
        src: ['media/sound/lose.mp3']
    });
    // crawlAnimation = new PIXI.extras.AnimatedSprite(playerTextures);

    // Start update loop
    app.ticker.add(gameLoop);
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
    let howToPlay = new PIXI.Text("Tutorial");
    howToPlay.style = playStyle;
    howToPlay.x = 200;
    howToPlay.y = sceneHeight - 140;
    howToPlay.interactive = true;
    howToPlay.buttonMode = true;
    howToPlay.on("pointerup",viewControls); // viewControls is a function reference
    howToPlay.on('pointerover',e=>e.target.alpha = 0.7); 
    howToPlay.on('pointerout',e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(howToPlay);

    // Start game text
    let startButton = new PIXI.Text("Fight Those Troll");
    startButton.style = playStyle;
    startButton.x = 200;
    startButton.y = sceneHeight - 260;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup",startGame); // startGame is a function reference
    startButton.on('pointerover',e=>e.target.alpha = 0.7); 
    startButton.on('pointerout',e=>e.currentTarget.alpha = 1.0);
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
    let playAgainText = new PIXI.Text("Play Again");
    playAgainText.style = overStyle;
    playAgainText.x = sceneWidth / 4;
    playAgainText.y = sceneHeight - 175;
    playAgainText.interactive = true;
    playAgainText.buttonMode = true;
    playAgainText.on("pointerup",startGame); // startGame is a function reference
    playAgainText.on('pointerover',e=>e.target.alpha = 0.7); 
    playAgainText.on('pointerout',e=>e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainText);

    // Make quit text
    let quitText = new PIXI.Text("Quit");
    quitText.style = overStyle;
    quitText.x = sceneWidth / 4;
    quitText.y = sceneHeight - 100;
    quitText.interactive = true;
    quitText.buttonMode = true;
    quitText.on("pointerup",quitGame); // quitGame is a function reference
    quitText.on('pointerover',e=>e.target.alpha = 0.7); 
    quitText.on('pointerout',e=>e.currentTarget.alpha = 1.0);
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

    let sGoBack = new PIXI.Text("Back");
    sGoBack.style = playStyle;
    sGoBack.x = sceneWidth / 2 - 100;
    sGoBack.y = sceneHeight - 100;
    sGoBack.interactive = true;
    sGoBack.buttonMode = true;
    sGoBack.on("pointerup",fromControlsToStart); // fromControlsToStart is a function reference
    sGoBack.on('pointerover',e=>e.target.alpha = 0.7); 
    sGoBack.on('pointerout',e=>e.currentTarget.alpha = 1.0);
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
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    player.x = 400;
    player.y = 400;
    time = 0;
    timeToFire = 0;
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