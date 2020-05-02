//Enable strict mode
"use strict";

// The actual game loop that runs when game plays
function startSceneLoop() {
    if (currentScene == gameState.StartScene) {
        app.ticker.add(() => {
            // Enter to start
            if (keys[keyboard.ENTER]) {
                startGame();
            } else if (keys[keyboard.c]) {
                viewControls();
            }
        });
    }
}

function gameLoop() {
    if (currentScene == gameState.GameScene) {

        if (roundToPointFive(time) == timeToFire) {

            enemyDrops();
            timeToFire += 0.5;
        }

        // #1 - Calculate "delta time"
        dt = 1 / app.ticker.FPS;
        if (dt > 1 / 12) dt = 1 / 12;
        increaseTimeBy(dt);

        // #2 - Move player
        let newX = player.x;
        let newY = player.y;
        let amt = player.speed * dt;

        let w2 = player.width / 2;
        let h2 = player.height / 2;

        // Animation Loop
        if (keys[keyboard.d]) {
            newX += amt;
        } else if (keys[keyboard.a]) {
            newX -= amt;
        }

        if (keys[keyboard.s]) {
            newY += amt;
        } else if (keys[keyboard.w]) {
            newY -= amt;
        }
        player.x = clamp(newX, 0 + w2, sceneWidth - w2);
        player.y = clamp(newY, 0 + h2, sceneHeight - h2);

        // crawl(crawlAnimation);

        // Move enemys
        for (let b of enemys) {
            b.move(dt);
        }

        // Collisions between enemys and player
        for (let b of enemys) {
            if (rectsIntersect(b, player)) {
                //hitSound.play();
                end();
                return;
            }
        }

        //get rid of dead enemys
        enemys = enemys.filter(b => b.isAlive);
    }
}

function enemyDrops() {

    randomNum = Math.floor(Math.random() * divider) + 1;

    let spawnX = division * randomNum;
    let spawnY = 0;

    switch (randomNum) {
        case enemyType.Fxxk:
            let fxxk = new Enemy(spawnX, spawnY, 300, enemyType.Fxxk);
            enemys.push(fxxk);
            gameScene.addChild(fxxk);
            fxxkSound.play();
            break;

        case enemyType.Stupid:
            let stupid = new Enemy(spawnX, spawnY, 300, enemyType.Stupid);
            enemys.push(stupid);
            gameScene.addChild(stupid);
            stupidSound.play();
            break;

        case enemyType.Toxic:
            let toxic = new Enemy(spawnX, spawnY, 300, enemyType.Toxic);
            enemys.push(toxic);
            gameScene.addChild(toxic);
            toxicSound.play();
            break;

        case enemyType.Troll:
            let troll = new Enemy(spawnX, spawnY, 300, enemyType.Troll);
            enemys.push(troll);
            gameScene.addChild(troll);
            trollSound.play();
            break;
    }
}

// Sprite sheet animation
function crawl(crawlAnimation) {
    gameScene.addChild(crawlAnimation);
    crawlAnimation.animationSpeed = 5 * dt;
    crawlAnimation.loop = false;
    crawlAnimation.onComplete = e => gameScene.removeChild(crawlAnimation);
    gameScene.addChild(crawlAnimation);
    crawlAnimation.play();
}

function gameOverLoop() {
    if (currentScene == gameState.GameOverScene) {
        app.ticker.add(() => {
            // R to restart
            if (keys[keyboard.r]) {
                startGame();
            }

            // Q to return to the start scene
            if (keys[keyboard.q]) {
                quitGame();
            }
        });
    }
}

function controlsLoop() {
    if (currentScene == gameState.ControlScene) {
        app.ticker.add(() => {
            // C to go back to start scene
            if (keys[keyboard.q]) {
                fromControlsToStart();
            }
        });
    }
}