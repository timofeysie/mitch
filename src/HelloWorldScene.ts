import Phaser, { Scene } from "phaser";

const GROUND_KEY = "ground";

export default class HelloWorldScene extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup | undefined;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars?: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private bombs?: Phaser.Physics.Arcade.Group;
  private gameOver?: boolean;

  constructor() {
    super("hello-world");
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image(GROUND_KEY, "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet("dude", "assets/mitch_walk-7-b.png", {
      frameWidth: 66,
      frameHeight: 95,
    });
  }

  createPlatforms(scene: Scene) {
    const platforms = this.physics.add.staticGroup();
    const ground = platforms.create(
      400,
      568,
      GROUND_KEY
    ) as Phaser.Physics.Arcade.Sprite;
    ground.setScale(2).refreshBody();

    platforms.create(600, 400, GROUND_KEY);
    platforms.create(50, 250, GROUND_KEY);
    platforms.create(750, 220, GROUND_KEY);
    return platforms;
  }

  createPlayer(scene: Scene, platforms: Phaser.Physics.Arcade.StaticGroup) {
    const player = this.physics.add.sprite(100, 450, "dude");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 7, end: 13 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 6 }],
      frameRate: 10,
    });

    const cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms);
    return { player, cursors };
  }

  create() {
    this.add.image(400, 300, "sky");

    const platforms = this.createPlatforms(this);
    const { player, cursors } = this.createPlayer(this, platforms);
    this.player = player;
    this.cursors = cursors;

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child: any) => {
      const c = child as Phaser.Physics.Arcade.Image;
      c.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(this.stars, platforms);
    this.physics.add.overlap(
      player,
      this.stars,
      this.handleCollectStar,
      undefined,
      this
    );

    this.scoreText = this.add.text(16, 16, "점수: 0", {
      fontSize: "32px",
      color: "#000",
    });

    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, platforms);
    this.physics.add.collider(
      player,
      this.bombs,
      this.handleHitBomb,
      undefined,
      this
    );

    const particles = this.add.particles("red");

    const emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    const logo = this.physics.add.image(400, 100, "bomb");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
    this.physics.add.collider(logo, platforms);
    this.physics.add.collider(
      player,
      logo,
      this.handleHitBomb,
      undefined,
      this
    );

    emitter.startFollow(logo);
  }

  private handleHitBomb(
    player: Phaser.GameObjects.GameObject,
    b: Phaser.GameObjects.GameObject
  ) {
    this.physics.pause();
    this.player?.setTint(0xff0000);
    this.player?.anims.play("turn");
    this.gameOver = true;
  }

  private handleCollectStar(
    player: Phaser.GameObjects.GameObject,
    s: Phaser.GameObjects.GameObject
  ) {
    const star = s as Phaser.Physics.Arcade.Image;
    star.disableBody(true, true);
    this.score += 10;
    this.scoreText?.setText("점수: " + this.score);
    if (this.stars?.countActive(true) === 0) {
      this.stars.children.iterate((c) => {
        const child = c as Phaser.Physics.Arcade.Image;
        child.enableBody(true, child.x, 0, true, true);
      });
      if (this.player) {
        const x =
          this.player?.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);
        const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(
          x,
          16,
          "bomb"
        );
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        const particles = this.add.particles("red");

        const emitter = particles.createEmitter({
          speed: 100,
          scale: { start: 1, end: 0 },
          blendMode: "ADD",
        });
        emitter.startFollow(bomb);
      }
    }
  }

  update() {
    if (this.cursors?.left?.isDown) {
      this.player?.setVelocityX(-160);
      this.player?.anims.play("left", true);
    } else if (this.cursors?.right?.isDown) {
      this.player?.setVelocityX(160);
      this.player?.anims.play("right", true);
    } else {
      this.player?.setVelocityX(0);
      this.player?.anims.play("turn");
    }
    if (this.cursors?.up?.isDown && this.player?.body.touching.down) {
      this.player?.setVelocityY(-330);
    }
  }
}
