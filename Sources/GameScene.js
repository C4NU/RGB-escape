class GameScene extends Phaser.Scene
{
  constructor()
  {
    super({key:"GameScene"});
  }

  init()
  {

  }

  preload()
  {
    this.load.image('Background', 'Resources/Background.png');

    this.load.spritesheet('Player@Idle@Red', 'Resources/Human@Idle@Red.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Idle@Green', 'Resources/Human@Idle@Green.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Idle@Blue', 'Resources/Human@Idle@Blue.png', { frameWidth: 64, frameHeight: 96 }, 8);

    this.load.spritesheet('Player@Run@Red', 'Resources/Human@Run@Red.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Run@Green', 'Resources/Human@Run@Green.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Run@Blue', 'Resources/Human@Run@Blue.png', { frameWidth: 64, frameHeight: 96 }, 8);

    this.load.spritesheet('Player@Jump@Red', 'Resources/Human@Jump@Red.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Jump@Green', 'Resources/Human@Jump@Green.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Jump@Blue', 'Resources/Human@Jump@Blue.png', { frameWidth: 64, frameHeight: 96 }, 8);

    this.load.image('Tiles', "Resources/Tiles/BOX.png");
    this.load.tilemapTiledJSON('Map', "Resources/Tiles/Stage 01.json");

    this.load.audio('JumpS', "Resources/Sounds/Player@Jump.wav");
  }

  create()
  {
    const playerOption =
    {
      playerMoveSpeed: 160,
      playerJumpSpeed: 250,
      playerLife: 3,
      jump: 1,
      playerCurrentColor: "Red"
    };

    const player = this.player;

    const input = this.input;
    const playerInputFlag = false;

    const keys = this.keys;

    const jumpSound = this.jumpSound;

    this.add.image(480, 320, 'Background');

    const map = this.make.tilemap({key: "Map"});

    const tileset = map.addTilesetImage("BOX", "Tiles");

    const worldLayer = map.createStaticLayer("World", tileset, 0,0);

    const startPos = map.findObject("SpawnPoint", obj => obj.name === "SpawnPoint");

    worldLayer.setCollisionBetween(0, 6);
    worldLayer.setCollisionByProperty({Collision: true});

    //var jumpSound = this.sound.add('JumpS');

    // 플레이어 이미지 설정
    var player = this.physics.add.sprite(startPos.x,
      startPos.y, 'Player');

      // 플레이어 바운딩 박스 사이즈 변경 및 sprite offset 세팅
      player.body.setSize(28, 69);
      player.body.offset.x = 18;
      player.body.offset.y = 24;

      this.anims.create(
        {
          key: 'Idle@Red',
          frames: this.anims.generateFrameNumbers('Player@Idle@Red', {start: 0, end: 7}),
          frameRate: 8,
          repeat: 1
        }
      );

      this.anims.create(
        {
          key: 'Idle@Green',
          frames: this.anims.generateFrameNumbers('Player@Idle@Green', {start: 0, end: 7}),
          frameRate: 8,
          repeat: 1
        }
      );

      this.anims.create(
        {
          key: 'Idle@Blue',
          frames: this.anims.generateFrameNumbers('Player@Idle@Blue', {start: 0, end: 7}),
          frameRate: 8,
          repeat: 1
        }
      );

      this.anims.create(
        {
          key: 'Run@Red',
          frames: this.anims.generateFrameNumbers('Player@Run@Red', {start: 0, end: 7}),
          frameRate: 8,
          repeat: 1
        }
      )

      this.anims.create(
        {
          key: 'Run@Green',
          frames: this.anims.generateFrameNumbers('Player@Run@Green', {start: 0, end: 7}),
          frameRate: 8,
          repeat: 1
        }
      )

      this.anims.create(
        {
          key: 'Run@Blue',
          frames: this.anims.generateFrameNumbers('Player@Run@Blue', {start: 0, end: 7}),
          frameRate: 8,
          repeat: 1
        }
      )

      this.anims.create(
        {
          key: 'Jump@Red',
          frames: this.anims.generateFrameNumbers('Player@Jump@Red', {start: 2, end: 2}),
          frameRate: 8,
          repeat: 1
        }
      )
      this.anims.create(
        {
          key: 'Jump@Green',
          frames: this.anims.generateFrameNumbers('Player@Jump@Green', {start: 2, end: 2}),
          frameRate: 8,
          repeat: 1
        }
      )
      this.anims.create(
        {
          key: 'Jump@Blue',
          frames: this.anims.generateFrameNumbers('Player@Jump@Blue', {start: 2, end: 2}),
          frameRate: 8,
          repeat: 1
        }
      )

      var input = this.input.keyboard.createCursorKeys();

      this.physics.add.collider(worldLayer,player);

      this.cameras.main.startFollow(player);

      const { LEFT, RIGHT, SPACE, Z, X, C } = Phaser.Input.Keyboard.KeyCodes;

      var keys = this.input.keyboard.addKeys({
        left: LEFT,
        right: RIGHT,
        space: SPACE,
        z: Z,
        x: X,
        c: C
      });

      player.anims.play('Idle@Red', true);
    }

    update()
    {
      if(playerOption.playerLife != 0)
      {
        PlayerColorChange();
        PlayerDetection(PlayerCollision());
        PlayerMovement();
        PlayerAnimation();
      }
      else
      {
        this.scene.restart();
        playerOption.playerLife = 3;
        playerOption.playerCurrentColor = "Red";

        player.anims.play("Idle@Red", true);
      }
    }

    PlayerMovement()
    {
      if(keys.left.isDown)
      {
        player.setVelocityX(-playerOption.playerMoveSpeed);
        player.setFlipX(true);
      }
      else if(keys.right.isDown)
      {
        player.setVelocityX(playerOption.playerMoveSpeed);
        player.setFlipX(false);
      }
      else
      {
        player.setVelocityX(0);
      }

      if(keys.space.isDown && player.body.onFloor())
      {
        jumpSound.play();
        player.setVelocityY(-playerOption.playerJumpSpeed);
      }
    }

    PlayerCollision()
    {
      var pointerTileX = map.worldToTileX(player.x);
      var pointerTileY = map.worldToTileY(player.y);

      var tile = map.getTileAt(pointerTileX, pointerTileY+1);

      if (tile)
      return tile.properties.Tilename;
    }

    PlayerDetection()
    {
      if(tile == playerOption.playerCurrentColor)
      {
        console.log("OK"); // 맞는 색상일때
      }
      else if(tile == null)
      {
        console.log("On Air");
      }
      else if(tile == "Black")
      {
        playerOption.playerLife = 0;
      }
      else
      {
        playerOption.playerLife--;
      }
    }

    PlayerColorChange()
    {
      if(keys.z.isDown)
      playerOption.playerCurrentColor = "Red";
      if(keys.x.isDown)
      playerOption.playerCurrentColor = "Blue";
      if(keys.c.isDown)
      playerOption.playerCurrentColor = "Green";
    }

    PlayerAnimation()
    {
      if (player.body.velocity.y !== 0)
      {
        if(playerOption.playerCurrentColor == "Red")
        player.anims.play('Jump@Red', true);
        if(playerOption.playerCurrentColor == "Blue")
        player.anims.play('Jump@Blue', true);
        if(playerOption.playerCurrentColor == "Green")
        player.anims.play('Jump@Green', true);
      }
      else if(player.body.velocity.x !== 0)
      {
        if(playerOption.playerCurrentColor == "Red")
        player.anims.play('Run@Red', true);
        if(playerOption.playerCurrentColor == "Blue")
        player.anims.play('Run@Blue', true);
        if(playerOption.playerCurrentColor == "Green")
        player.anims.play('Run@Green', true);
      }
      else
      {
        if(playerOption.playerCurrentColor == "Red")
        player.anims.play('Idle@Red', true);
        if(playerOption.playerCurrentColor == "Blue")
        player.anims.play('Idle@Blue', true);
        if(playerOption.playerCurrentColor == "Green")
        player.anims.play('Idle@Green', true);
      }
    }
  }

  export default GameScene;
