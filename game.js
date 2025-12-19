const TILE = 48;
const WORLD_WIDTH = 40;
const WORLD_HEIGHT = 20;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, cursors, space;
let blocks;
let inventory = { dirt: 0, stone: 0 };

function preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("dirt", "assets/dirt.png");
    this.load.image("stone", "assets/stone.png");
    this.load.image("bedrock", "assets/bedrock.png");
    this.load.image("grass", "assets/grass.png");
}

function create() {
    blocks = this.physics.add.staticGroup();

    // ===== МИР =====
    for (let y = 0; y < WORLD_HEIGHT; y++) {
        for (let x = 0; x < WORLD_WIDTH; x++) {
            let type = null;

            if (y === 5) type = "grass";
            else if (y > 5 && y < WORLD_HEIGHT - 2) type = "dirt";
            else if (y >= WORLD_HEIGHT - 2) type = "bedrock";

            if (type) {
                const block = blocks.create(
                    x * TILE,
                    y * TILE,
                    type
                ).setOrigin(0);

                block.type = type;
                block.refreshBody();
            }
        }
    }

    // ===== ИГРОК =====
    player = this.physics.add.sprite(200, 100, "player");
    player.setScale(0.6);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, blocks);

    cursors = this.input.keyboard.createCursorKeys();
    space = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // ===== ЛОМАНИЕ =====
    this.input.on("pointerdown", pointer => {
        const x = Math.floor(pointer.worldX / TILE) * TILE;
        const y = Math.floor(pointer.worldY / TILE) * TILE;

        blocks.children.iterate(block => {
            if (block.x === x && block.y === y) {
                if (block.type !== "bedrock") {
                    inventory[block.type]++;
                    block.destroy();
                }
            }
        });
    });

    // ===== СТРОЙКА ПКМ =====
    this.input.on("pointerup", pointer => {
        if (pointer.rightButtonDown()) {
            if (inventory.dirt > 0) {
                const x = Math.floor(pointer.worldX / TILE) * TILE;
                const y = Math.floor(pointer.worldY / TILE) * TILE;

                const newBlock = blocks.create(x, y, "dirt").setOrigin(0);
                newBlock.type = "dirt";
                newBlock.refreshBody();
                inventory.dirt--;
            }
        }
    });
}

function update() {
    // ДВИЖЕНИЕ
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    // ПРЫЖОК НА ПРОБЕЛ
    if (Phaser.Input.Keyboard.JustDown(space) && player.body.blocked.down) {
        player.setVelocityY(-450);
    }
}