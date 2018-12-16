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
  }

  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    function setTargetMoles(moleArray, amountOfTargets) {
      //shuffle the array
      var shuffledArray = _.shuffle(moleArray);
      var targets = _(shuffledArray).take(amountOfTargets).value(); // This should be getting an variable ammount of moles instead of just two
      _.each(targets, function(target) {
        target.cellData.moleState.targetMole = true;
      });
    }
    
    this.grid = this.add.existing(new PlayGrid(this));
    var gridFSM = this.grid.gameGrid.getGridState();
    gridFSM.imageData = this.grid;
    gridFSM.scene = this.scene;
    gridFSM.go();
    this.moles = this.grid.gameGrid.getListOfCells();
    
    
    /* It would be cool if we could make the amount (lower than 12) random.
       It should be based on a level number (0 to 4) + 2 so it starts with 2 and go to 6
    */
    this.amountOfTargets = gameMoleLevel.level + 2; //Magic number
    

    setTargetMoles(this.moles, this.amountOfTargets);
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
