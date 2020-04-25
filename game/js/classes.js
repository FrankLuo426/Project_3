class Player extends PIXI.Sprite {
    constructor(x = 0, y = 0, speed = 100) {
        super(PIXI.loader.resources["media/Player.png"].texture);
        this.anchor.set(0.5, 0.5); // position, scaling, rotating etc are now from center of sprite
        this.scale.set(0.5);
        this.speed = speed;
        this.x = x;
        this.y = y;
    }
}

class Enemy extends PIXI.Sprite {
    constructor(x = 0, y = 0, speed = 500, enemyType = 1) {
        super(enemysTextures[enemyType - 1]);
        this.anchor.set(0.5, 0.5);
        this.scale.set(0.3);
        this.x = x;
        this.y = y;
        //variables
        this.fwd = {
            x: 0,
            y: -1
        };
        this.speed = speed;
        this.isAlive = true;
    }

    move(dt = 1 / 60) {
        this.x += this.fwd.x * this.speed * dt;
        this.y -= this.fwd.y * this.speed * dt;
    }
}