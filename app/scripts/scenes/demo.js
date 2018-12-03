import PlayGrid from '@/objects/PlayGrid';
//import Mole from '@/objects/Mole';

export default class Demo extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: 'Demo' });
    var moles = {};
  }

  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    
    this.grid = this.add.existing(new PlayGrid(this));
    this.moles = this.grid.gameGrid.getListOfCells();
    this.moles.forEach(mole => {
      mole.create();
      mole.moleState.goDemo();
    });

    this.visibleAnimation = {
      moleCounter: 0,
      lastVisibleSetMole: {},
      moleResetOn: 11
    };

    var sceneClickedHandler = function () { // needs to be loaded in first as it is not hoisted.
      this.scene.start('Main');
    };

    this.input.on('pointerdown', sceneClickedHandler, this); //Adds the event listener for the on click of the scene.
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
    if (this.visibleAnimation.moleCounter > this.visibleAnimation.moleResetOn){
      this.visibleAnimation.moleCounter = 0;
    }
    let mole = this.moles[this.visibleAnimation.moleCounter];
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
