export default class TimeOutBar extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene, x, y) {
    super(scene, 0, 0, "timeOutBar");

    this.setPosition(x, y);
    this.setOrigin(0, 0);
    this.width = 600;
    this.maxTimeInMilliSec = 2500;
    this.onePercentOfMaxTime = this.maxTimeInMilliSec / 100;
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
          _onExit: function() {}
        }
      },
      go: function() {
        this.handle("RUNNING");
      }
    });
  }

  update(t) {
    //set percent bar
    if (this.timeOutBarState.state === 'RUNNING') {
      this.initialTime = this.initialTime || t;

      let elapsedTime = t - this.initialTime; // time since first run
      let percentElapsed = elapsedTime / this.onePercentOfMaxTime;
      let percentRemaining = 100 - percentElapsed;
      let fractureRemaining = percentRemaining / 100;
      this.displayWidth = this.width * fractureRemaining;
    }
  }
}
