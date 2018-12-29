("use strict");
/* global _ */
/* global gameMoleLevel */
/*eslint quotes: ["error", "double"]*/

import PlayGrid from "@/objects/PlayGrid";
import TimeOutBar from "@/objects/TimeOutBar";


export default class SecondScene extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: "SecondScene" });
    this.initialTime = 0;
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
      var targets = _(shuffledArray)
        .take(amountOfTargets)
        .value();
      for (let i = 0; i < amountOfTargets; i++){
        let target = targets[i];
        target.cellData.moleState.targetMole = true;
        target.cellData.moleState.targetMoleOrder = i;
      }
    }

    this.grid = this.add.existing(new PlayGrid(this));
    var gridFSM = this.grid.gameGrid.getGridState();
    gridFSM.imageData = this.grid;
    gridFSM.scene = this.scene;
    gridFSM.go();
    this.moles = this.grid.gameGrid.getListOfCells();
    
    this.amountOfTargets = gameMoleLevel.level + 2; //Magic number

    //set percent bar 
    this.timeOutBar = this.add.existing(new TimeOutBar(this, 0, 895));

    setTargetMoles(this.moles, this.amountOfTargets);
    //_(this.moles).each(s => s.cellData.moleState.go());
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
  update(t) {
    this.timeOutBar.update(t);

    
    
  }
}
