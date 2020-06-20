import Phaser from "phaser";

export default class Player
{
  var playerOption =
  {
    playerGravity: 200,
    playerMoveSpeed: 160,
    playerJumpSpeed: 250,
    jump: 1
  };

  var input;
  var playerInputFlag = false;

  function preload()
  {
    this.load.spritesheet('Player@Idle@Left', 'Resources/Human@Idle@Left.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Idle@Right', 'Resources/Human@Idle@Right.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Run@Left', 'Resources/Human@Run@Left.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Run@Right', 'Resources/Human@Run@Right.png', { frameWidth: 64, frameHeight: 96 }, 8);
    this.load.spritesheet('Player@Jump', 'Resources/Human@Run@Right.png', { frameWidth: 64, frameHeight: 96 }, 8);
  }

  function create()
  {
    this.anims.create(
      {
        key: 'Idle',
        frames: this.anims.generateFrameNumbers('Player@Idle', {start: 0, end: 7}),
        frameRate: 8,
        repeat: 1
      }
    );

    this.anims.create(
      {
        key: 'Run',
        frames: this.anims.generateFrameNumbers('Player@Run', {start: 0, end: 7}),
        frameRate: 8,
        repeat: 1
      }
    )

    this.anims.create(
      {
        key: 'Jump',
        frames: this.anims.generateFrameNumbers('Player@Jump', {start: 0, end: 7}),
        frameRate: 8,
        repeat: 1
      }
    )

  }

  function update()
  {
    PlayerMovement();
  }

  function PlayerMovement()
  {
    if(input.left.isDown)
    {
      player.setVelocityX(-playerOption.playerMoveSpeed);
      playerInputFlag = true;
      player.anims.play('Run@Left', true);
    }
    else if(input.right.isDown)
    {
      player.setVelocityX(playerOption.playerMoveSpeed);
      playerInputFlag = false;
      player.anims.play('Run@Right', true);
    }

    else if(input.space.isDown && player.body.onFloor())
    {
      player.setVelocityY(-playerOption.playerJumpSpeed);
      player.anims.play('Jump', true);
    }
    else
    {
      player.setVelocityX(0);

      if(playerInputFlag)
      player.anims.play('Idle@Left', true);
      if(!playerInputFlag)
      {
        player.anims.play('Idle@Right', true);
      }
    }
  }
