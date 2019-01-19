("use strict");
/*eslint quotes: ["error", "double"]*/
/* global machina*/

export default class TimeOutBar extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene, x, y) {
    super(scene, 0, 0, "timeOutBar");

    var self = this;
    this.setPosition(x, y);
    this.setOrigin(0, 0);
    this.width = 600;
    this.maxTimeInMilliSec = 2000;
    this.onePercentOfMaxTime = this.maxTimeInMilliSec / 100; // as the current implementation of the timer does not support a variable time.
    this.maxTimeInMilliSec / 100;

    this.timeOutBarState = new machina.Fsm({
      initialize: function() {},
      namespace: "grid-state",
      initialState: "uninitialized",
      states: {
        uninitialized: {
          "*": function() {
            this.deferUntilTransition();
            this.transition("IDLE");
          }
        },
        IDLE: {
          _onEnter: function() {},
          RUNNING: "RUNNING",
          _onExit: function() {}
        },
        RUNNING: {
          _onEnter: function() {},
          GAMEOVER: "GAMEOVER",
          RESET: "RESET",
          _onExit: function() {}
        },
        GAMEOVER: {
          _onEnter: function() {
            this.emit("GAMEOVER");
          },
          _onExit: function() {}
        },
        RESET: {
          _onEnter: function() {
            this.setInitialTimeProperties(); // reset the time out bar properties
            this.handle("RUNNING");
          },
          RUNNING: "RUNNING",
          _onExit: function() {}
        }
      },
      go: function() {
        this.handle("RUNNING");
      },
      reset: function() {
        this.handle("RESET");
      },
      gameOver: function() {
        this.handle("GAMEOVER");
      }
    });

    this.timeOutBarState.on("GAMEOVER", function() {
      let gridState = scene.gameGrid.getGridState();
      gridState.gameOver();
      self.destroy();
    });

    // The timeoutbar should be invisble when the state is game oven

    this.timeOutBarState.setInitialTimeProperties = function() {
      self.maxTimeInMilliSec = 2500;
      self.initialTime = self.currentTime || 0;
    };
  }

  update(t) {
    //set percent bar
    self.currentTime = t;

    if (this.timeOutBarState.state !== "RUNNING") return;

    this.initialTime = this.initialTime || t;
    let elapsedTime = t - this.initialTime; // time since first run
    let percentElapsed = elapsedTime / this.onePercentOfMaxTime;
    let percentRemaining = 100 - percentElapsed;
    let fractureRemaining = percentRemaining / 100;
    this.displayWidth = this.width * fractureRemaining;
    if (this.displayWidth < 1) this.timeOutBarState.gameOver();
  }
}
