import PlayGrid from "@/objects/PlayGrid";
//import Mole from '@/objects/Mole';

export default class Demo extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: "Demo" });
  }

  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    //  TODO: Replace this content with really cool game code here :)
    this.grid = this.add.existing(new PlayGrid(this));
    this.visibleAnimation = {
      moleCounter: 0,
      lastVisibleSetMole: {},
      moleResetOn: 11
    }

    // this.aMole = this.add.existing(new Mole(this, 2, 2));
  }

  /**
   *  Called when a scene is updated. Updates to game logic, physics and game
   *  objects are handled here.
   *
   *  @protected
   *  @param {number} t Current internal clock time.
   *  @param {number} dt Time elapsed since last update.
   */
  updateMoles() {
    let moles = this.grid.gameGrid.getListOfCells();
    // moles.forEach(mole => {
    //   let coinToss = Math.round(Math.random());
    //   coinToss = !!parseInt(coinToss);
    //   mole.cellData.setVisible(coinToss);
    // });
    if (this.visibleAnimation.moleCounter > this.visibleAnimation.moleResetOn){
      this.visibleAnimation.moleCounter = 0;
    }
    let mole = moles[this.visibleAnimation.moleCounter];
    if (this.visibleAnimation.lastVisibleSetMole.cellData)
      this.visibleAnimation.lastVisibleSetMole.cellData.setVisible(true);
    
    mole.cellData.setVisible(false);
    this.visibleAnimation.lastVisibleSetMole = mole;
    this.visibleAnimation.moleCounter++;
  }

  update(time) {
    var vm = this;
    vm.lastTime = vm.lastTime || time;
    var intervalMilliSeconds = 250;
    if (time - vm.lastTime < intervalMilliSeconds) {
      return;
    }
    vm.lastTime = time;
    this.updateMoles();
  }
}
