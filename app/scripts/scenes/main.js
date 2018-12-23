("use strict");
/* global _ */
/* global gameMoleLevel */

import PlayGrid from "@/objects/PlayGrid";
//import Mole from '@/objects/Mole';

export default class Main extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({ key: "Main" });
    // so I feel that this is the place that should have the state machine.
    // I need to examine the state machine javascript in a separate project.
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
        .value(); // This should be getting an variable ammount of moles instead of just two
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

    //set percent bar 
    this.timeOutBar = this.add.image(0, 895, "timeOutBar");
    this.timeOutBar.Width = 600;
    this.timeOutBar.hundredPercentWidth = 600;
    this.timeOutBar.setOrigin(0,0);
    this.timeOutBar.maxTimeInMilliSec = 4000;
    this.timeOutBar.onePercentOfMaxTime = this.timeOutBar.maxTimeInMilliSec / 100;

  
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
  update(t) {
    this.initialTime = this.initialTime || t;
    var elapsedTime = t - this.initialTime; // time since first run
    var percentElapsed = elapsedTime / this.timeOutBar.onePercentOfMaxTime;
    var percentRemaining = 100 - percentElapsed;
    var fractureRemaining = percentRemaining / 100;
    this.timeOutBar.displayWidth = this.timeOutBar.hundredPercentWidth * fractureRemaining;
    if (elapsedTime > 3000) {
      debugger;
    }
  }
}
