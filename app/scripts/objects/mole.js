export default class Mole extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene, gridX, gridY) {
    super(scene, 0, 0, "moleIcon");

    // 600 x gives 200 per mole
    // 900 y gives 225 per mole
    this.gridPosX = gridX;
    this.gridPosY = gridY;
    this.gridPixelPosX = 200 * gridX;
    this.gridPixelPosY = 255 * gridY;
    this.scene = scene;
 
    this.setOrigin(0.5);
    this.setPosition(this.gridPixelPosX, this.gridPixelPosY);
    this.cellData = this.scene.add.image(
      this.gridPixelPosX,
      this.gridPixelPosY,
      'moleIcon'
    );
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    // Get called from main.js update
    // this.angle += 0.1;
  }
}
