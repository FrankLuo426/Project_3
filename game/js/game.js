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
            // let level = Math.round(timeToFire / 15.0);
            // for (let i = 0; i < level; level++) {
            //     enemyDrops();
            // }
            enemyDrops();
            timeToFire += 0.5;
        }

        // if (paused) return; // keep this commented out for now
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
        app.ticker.add(() => {
            // #2 - Check Keys
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

            player.update(newX, newY);
        });

        // crawl(crawlAnimation);

        // Move enemys
        for (let b of enemys) {
            b.move(dt);
        }

        // Collisions between enemys and player
        for (let b of enemys) {
            if (rectsIntersect(b, player)) {
                //hitSound.play();
                gameScene.removeChild(b);
                gameScene.removeChild(player);
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

    let spawnX = division * randomNum + 125;
    let spawnY = 135;

    switch (randomNum) {
        case enemyType.Fxxk:
            console.log(randomNum);
            let fxxk = new Enemy(spawnX, spawnY, 500, enemyType.Fxxk);
            enemys.push(fxxk);
            gameScene.addChild(fxxk);
        break;

        case enemyType.Stupid:
            let stupid = new Enemy(spawnX, spawnY, 500, enemyType.Stupid);
            enemys.push(stupid);
            gameScene.addChild(stupid);
        break;

        case enemyType.Toxic:
            let toxic = new Enemy(spawnX, spawnY, 500, enemyType.Toxic);
            enemys.push(toxic);
            gameScene.addChild(toxic);
        break;

        case enemyType.Troll:
            let troll = new Enemy(spawnX, spawnY, 500, enemyType.Troll);
            enemys.push(troll);
            gameScene.addChild(troll);
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