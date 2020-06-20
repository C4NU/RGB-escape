class TitleScene extends Phaser.Scene
{
    constructor()
    {
      super({key:"TitleScene"});
    }

    preload()
    {
      this.load.image('TitleImage', './Resources/Title.png');

      debug.log("load complete");

      this.input.mouse.disableContextMenu();

      this.input.on('pointerDown', function (pointer)
      {
            if (pointer.leftButtonDown())
            {
              game.scene.start('InGame', ingameScene);
              game.scene.remove('Title', titleScene);
            }
        }, this);
    }

    create()
    {
        this.add.image(480, 320, 'TitleImage');
    }
}

export default TitleScene;
