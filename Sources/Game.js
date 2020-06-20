/*import TitleScene from "./TitleScene.js";
import GameScene from "./GameScene.js";*/

var titleScene = new Phaser.Scene("Title");

var levelSelectScene = new Phaser.Scene("SelectLevel");

var gameScene = new Phaser.Scene("Game");
var gameSceneHard = new Phaser.Scene("Game@Hard");

let gameOption =
{
  type: Phaser.AUTO,
  width: 640,
  height: 480,

  physics:
  {
      default: "arcade",
      arcade: {
        //debug: true,
        gravity: {y: 400}
      }
  },
};

var playerOption =
{
  playerGravity: 400,
  playerMoveSpeed: 160,
  playerJumpSpeed: 285,
  playerLife: 3,
  jump: 1,
  playerCurrentColor: "Red"
};

var player;

var input;
var playerInputFlag = false;

var collideDebugText;

var worldLayer;

var keys;
var colorKeys;

var jumpSound;
var backgroundSound;

var map;

var flag = false;

titleScene.preload = function()
{
  this.load.image('TitleImage', 'Resources/Title@Background.png');

  this.input.mouse.disableContextMenu();

  this.input.on('pointerdown', function (pointer)
  {
      if (pointer.leftButtonDown() && (pointer.x >= 410 && pointer.x <= 580) && (pointer.y >= 310 && pointer.y <= 350))
      {
        game.scene.start('SelectLevel', levelSelectScene);
        game.scene.remove('Title', titleScene);
      }
  }, this);
}

titleScene.create = function()
{
  this.add.image(0, 0, 'TitleImage').setOrigin(0,0);
}

levelSelectScene.preload = function()
{
  this.load.image('Background', 'Resources/LevelSelect@Background.png');

  this.input.mouse.disableContextMenu();

  this.input.on('pointerdown', function (pointer)
  {
      if (pointer.leftButtonDown())
      {
        if(pointer.x >= 130 && pointer.x <= 510 && pointer.y>= 99 && pointer.y<= 190)
        {
          game.scene.start('Game', gameScene);
          game.scene.remove('SelectLevel', levelSelectScene);
        }
      }

      if (pointer.leftButtonDown())
      {
        if(pointer.x >= 130 && pointer.x <= 510 && pointer.y>= 290&& pointer.y<= 390)
        {
          console.log(pointer.y);
          game.scene.start('Game@Hard', gameSceneHard);
          game.scene.remove('SelectLevel', levelSelectScene);
        }
      }
  }, this);
}

levelSelectScene.create = function()
{
  this.add.image(0, 0, 'Background').setOrigin(0,0);
}

gameScene.preload = function()
{
  this.load.image('Game@Background', 'Resources/Game@Background.png');

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
  this.load.audio('BGM', "Resources/Sounds/Background.mp3");
}

gameScene.create = function ()
{
  this.add.image(640, 480, 'Game@Background').setOrigin(0,0);

  map = this.make.tilemap({key: "Map"});

  const tileset = map.addTilesetImage("BOX", "Tiles");

  worldLayer = map.createStaticLayer("World", tileset, 0,0);

  const startPos = map.findObject("SpawnPoint", obj => obj.name === "SpawnPoint");

  worldLayer.setCollisionBetween(0, 6);
  worldLayer.setCollisionByProperty({Collision: true});

  jumpSound = this.sound.add('JumpS');
  backgroundSound = this.sound.add('BGM');
  // 플레이어 이미지 설정
  player = this.physics.add.sprite(startPos.x,
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

  input = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(worldLayer,player);

  this.cameras.main.startFollow(player);

  const { LEFT, RIGHT, SPACE, Z, X, C } = Phaser.Input.Keyboard.KeyCodes;

  keys = this.input.keyboard.addKeys({
  left: LEFT,
  right: RIGHT,
  space: SPACE,
  z: Z,
  x: X,
  c: C
  });

  player.anims.play('Idle@Red', true);

  backgroundSound.play();
}

gameScene.update = function()
{
  if(playerOption.playerLife != 0)
  {
    gameScene.PlayerColorChange();
    gameScene.PlayerDetection(gameScene.PlayerCollision());
    gameScene.PlayerMovement();
    gameScene.PlayerAnimation();
  }
  else
  {
    this.scene.restart();
    playerOption.playerLife = 3;
    playerOption.playerCurrentColor = "Red";

    player.anims.play("Idle@Red", true);
  }
  //DebugLog();
}

gameScene.PlayerMovement = function()
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

gameScene.PlayerCollision = function()
{
  var pointerTileX = map.worldToTileX(player.x);
  var pointerTileY = map.worldToTileY(player.y);

  var tile = map.getTileAt(pointerTileX, pointerTileY+1);

  if (tile)
      return tile.properties.Tilename;
}

gameScene.PlayerDetection = function(tile)
{
  if(tile == playerOption.playerCurrentColor)
  {
    //console.log("OK"); // 맞는 색상일때
  }
  else if(tile == null)
  {
    //console.log("On Air");
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

gameScene.PlayerColorChange = function()
{
    if(keys.z.isDown)
      playerOption.playerCurrentColor = "Red";
    if(keys.x.isDown)
      playerOption.playerCurrentColor = "Blue";
    if(keys.c.isDown)
      playerOption.playerCurrentColor = "Green";
}

gameScene.PlayerAnimation = function()
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

gameSceneHard.preload = function()
{
  this.load.image('Game@Background', 'Resources/Game@Background.png');

  this.load.spritesheet('Player@Idle@Red', 'Resources/Human@Idle@Red.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Idle@Green', 'Resources/Human@Idle@Green.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Idle@Blue', 'Resources/Human@Idle@Blue.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Idle@Magenta', 'Resources/Human@Idle@Magenta.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Idle@Cyan', 'Resources/Human@Idle@Cyan.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Idle@Yellow', 'Resources/Human@Idle@Yellow.png', { frameWidth: 64, frameHeight: 96 }, 8);

  this.load.spritesheet('Player@Run@Red', 'Resources/Human@Run@Red.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Run@Green', 'Resources/Human@Run@Green.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Run@Blue', 'Resources/Human@Run@Blue.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Run@Magenta', 'Resources/Human@Run@Magenta.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Run@Cyan', 'Resources/Human@Run@Cyan.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Run@Yellow', 'Resources/Human@Run@Yellow.png', { frameWidth: 64, frameHeight: 96 }, 8);

  this.load.spritesheet('Player@Jump@Red', 'Resources/Human@Jump@Red.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Jump@Green', 'Resources/Human@Jump@Green.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Jump@Blue', 'Resources/Human@Jump@Blue.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Jump@Magenta', 'Resources/Human@Jump@Magenta.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Jump@Cyan', 'Resources/Human@Jump@Cyan.png', { frameWidth: 64, frameHeight: 96 }, 8);
  this.load.spritesheet('Player@Jump@Yellow', 'Resources/Human@Jump@Yellow.png', { frameWidth: 64, frameHeight: 96 }, 8);

  this.load.image('Tiles', "Resources/Tiles/BOX.png");
  this.load.tilemapTiledJSON('Map', "Resources/Tiles/Stage 01_Hard.json");

  this.load.audio('JumpS', "Resources/Sounds/Player@Jump.wav");
  this.load.audio('BGM', "Resources/Sounds/Background.mp3");

}

gameSceneHard.create = function ()
{
  this.add.image(640, 480, 'Game@Background').setOrigin(0,0);

  map = this.make.tilemap({key: "Map"});

  const tileset = map.addTilesetImage("BOX", "Tiles");

  worldLayer = map.createStaticLayer("World", tileset, 0,0);

  const startPos = map.findObject("SpawnPoint", obj => obj.name === "SpawnPoint");

  worldLayer.setCollisionBetween(0, 6);
  worldLayer.setCollisionByProperty({Collision: true});

  jumpSound = this.sound.add('JumpS');
  backgroundSound = this.sound.add('BGM');

  // 플레이어 이미지 설정
  player = this.physics.add.sprite(startPos.x,
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
      key: 'Idle@Magenta',
      frames: this.anims.generateFrameNumbers('Player@Idle@Magenta', {start: 0, end: 7}),
      frameRate: 8,
      repeat: 1
    }
  );

  this.anims.create(
    {
      key: 'Idle@Cyan',
      frames: this.anims.generateFrameNumbers('Player@Idle@Cyan', {start: 0, end: 7}),
      frameRate: 8,
      repeat: 1
    }
  );

  this.anims.create(
    {
      key: 'Idle@Yellow',
      frames: this.anims.generateFrameNumbers('Player@Idle@Yellow', {start: 0, end: 7}),
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
      key: 'Run@Magenta',
      frames: this.anims.generateFrameNumbers('Player@Run@Magenta', {start: 0, end: 7}),
      frameRate: 8,
      repeat: 1
    }
  );

  this.anims.create(
    {
      key: 'Run@Cyan',
      frames: this.anims.generateFrameNumbers('Player@Run@Cyan', {start: 0, end: 7}),
      frameRate: 8,
      repeat: 1
    }
  );

  this.anims.create(
    {
      key: 'Run@Yellow',
      frames: this.anims.generateFrameNumbers('Player@Run@Yellow', {start: 0, end: 7}),
      frameRate: 8,
      repeat: 1
    }
  );

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

  this.anims.create(
    {
      key: 'Jump@Magenta',
      frames: this.anims.generateFrameNumbers('Player@Jump@Magenta', {start: 2, end: 2}),
      frameRate: 8,
      repeat: 1
    }
  );

  this.anims.create(
    {
      key: 'Jump@Cyan',
      frames: this.anims.generateFrameNumbers('Player@Jump@Cyan', {start: 2, end: 2}),
      frameRate: 8,
      repeat: 1
    }
  );

  this.anims.create(
    {
      key: 'Jump@Yellow',
      frames: this.anims.generateFrameNumbers('Player@Jump@Yellow', {start: 2, end: 2}),
      frameRate: 8,
      repeat: 1
    }
  );

  input = this.input.keyboard.createCursorKeys();

  this.physics.add.collider(worldLayer,player);

  this.cameras.main.startFollow(player);

  const { LEFT, RIGHT, SPACE} = Phaser.Input.Keyboard.KeyCodes;

  keys = this.input.keyboard.addKeys({
  left: LEFT,
  right: RIGHT,
  space: SPACE
  });

  const {Z, X, C, A, S, D} = Phaser.Input.Keyboard.KeyCodes;

  colorKeys = this.input.keyboard.addKeys(
    {
      z: Z,
      x: X,
      c: C,
      a: A,
      s: S,
      d: D
    }
  );

  player.anims.play('Idle@Red', true);

  backgroundSound.play();
}

gameSceneHard.update = function()
{
  if(playerOption.playerLife != 0)
  {
    gameSceneHard.PlayerColorChange();
    gameSceneHard.PlayerDetection(gameSceneHard.PlayerCollision());
    gameSceneHard.PlayerMovement();
    gameSceneHard.PlayerAnimation();
  }
  else
  {
    this.scene.restart();
    playerOption.playerLife = 3;
    playerOption.playerCurrentColor = "Red";

    player.anims.play("Idle@Red", true);
  }
  console.log(playerOption.playerCurrentColor);
}

gameSceneHard.PlayerMovement = function()
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

gameSceneHard.PlayerCollision = function()
{
  var pointerTileX = map.worldToTileX(player.x);
  var pointerTileY = map.worldToTileY(player.y);

  var tile = map.getTileAt(pointerTileX, pointerTileY+1);

  if (tile)
      return tile.properties.Tilename;
}

gameSceneHard.PlayerDetection = function(tile)
{
  if(tile == playerOption.playerCurrentColor)
  {
    //console.log("OK"); // 맞는 색상일때
  }
  else if(tile == null)
  {
    //console.log("On Air");
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

gameSceneHard.PlayerColorChange = function()
{
    if(colorKeys.z.isDown)
        playerOption.playerCurrentColor = "Red";
    if(colorKeys.x.isDown)
        playerOption.playerCurrentColor = "Blue";
    if(colorKeys.c.isDown)
        playerOption.playerCurrentColor = "Green";
    if(colorKeys.a.isDown)
        playerOption.playerCurrentColor = "Magenta";
    if(colorKeys.s.isDown)
        playerOption.playerCurrentColor = "Cyan";
    if(colorKeys.d.isDown)
        playerOption.playerCurrentColor = "Yellow";
}

gameSceneHard.PlayerAnimation = function()
{
      if (player.body.velocity.y !== 0)
      {
        if(playerOption.playerCurrentColor == "Red")
          player.anims.play('Jump@Red', true);
        if(playerOption.playerCurrentColor == "Blue")
          player.anims.play('Jump@Blue', true);
        if(playerOption.playerCurrentColor == "Green")
          player.anims.play('Jump@Green', true);
        if(playerOption.playerCurrentColor == "Magenta")
          player.anims.play('Jump@Magenta', true);
        if(playerOption.playerCurrentColor == "Cyan")
          player.anims.play('Jump@Cyan', true);
        if(playerOption.playerCurrentColor == "Yellow")
          player.anims.play('Jump@Yellow', true);
      }
      else if(player.body.velocity.x !== 0)
      {
      if(playerOption.playerCurrentColor == "Red")
        player.anims.play('Run@Red', true);
      if(playerOption.playerCurrentColor == "Blue")
        player.anims.play('Run@Blue', true);
      if(playerOption.playerCurrentColor == "Green")
        player.anims.play('Run@Green', true);
        if(playerOption.playerCurrentColor == "Magenta")
          player.anims.play('Run@Magenta', true);
        if(playerOption.playerCurrentColor == "Cyan")
          player.anims.play('Run@Cyan', true);
        if(playerOption.playerCurrentColor == "Yellow")
          player.anims.play('Run@Yellow', true);
      }
      else
      {
        if(playerOption.playerCurrentColor == "Red")
          player.anims.play('Idle@Red', true);
        if(playerOption.playerCurrentColor == "Blue")
          player.anims.play('Idle@Blue', true);
        if(playerOption.playerCurrentColor == "Green")
          player.anims.play('Idle@Green', true);
        if(playerOption.playerCurrentColor == "Magenta")
            player.anims.play('Idle@Magenta', true);
        if(playerOption.playerCurrentColor == "Cyan")
            player.anims.play('Idle@Cyan', true);
        if(playerOption.playerCurrentColor == "Yellow")
            player.anims.play('Idle@Yellow', true);
      }
}

var game = new Phaser.Game(gameOption);

game.scene.add('Title', titleScene);
game.scene.add('SelectLevel', levelSelectScene);
game.scene.add('Game', gameScene);
game.scene.add('Game@Hard', gameSceneHard);

game.scene.start('Title');
