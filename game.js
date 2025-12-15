const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;

function preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("ground", "assets/tiles.png");
}

function create() {
    const ground = this.physics.add.staticGroup();

    for (let x = 0; x < config.width; x += 64) {
        ground.create(x, config.height - 32, "ground");
    }

    player = this.physics.add.sprite(100, 100, "player");
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, ground);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}

this.input.on("pointerdown", pointer => {
    if (pointer.x < config.width / 2) {
        player.setVelocityX(-200);
    } else {
        player.setVelocityX(200);
    }
});