import PlayGrid from '@/objects/PlayGrid';
//import Mole from '@/objects/Mole';

export default class Main extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({key: 'Main'});
    // so I feel that this is the place that should have the state machine.
    // I need to examine the state machine javascript in a separate project.
    var amountOfTargets = 3;
  }

  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    debugger;
    function setTargetMoles(gridArray) {
      //shuffle the array
      var shuffledArray = _.shuffle(gridArray);
      
      var targets = _.slice(shuffledArray, 0, 1); // This should be getting an variable ammount of moles instead of just two
      _.each(targets, function(target) {
        target.targetMole = true;
      });
    }
    
    this.grid = this.add.existing(new PlayGrid(this));
    this.moles = this.grid.gameGrid.getListOfCells();
    
    setTargetMoles(this.moles);
    _(this.moles).each(s => s.cellData.moleState.go());
  }

  /**
   *  Called when a scene is updated. Updates to game logic, physics and game
   *  objects are handled here.
   *
   *  @protected
   *  @param {number} t Current internal clock time.
   *  @param {number} dt Time elapsed since last update.
   */
  update(/* t, dt */) {
    // this.logo.update();
  }
}
