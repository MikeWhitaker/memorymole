("use strict");
/*eslint quotes: ["error", "double"]*/
/* global _ */
/* global machina*/

export default class MoleSecondScene extends Phaser.GameObjects.Sprite {
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
    var moleState = new machina.Fsm({
      initialize: function() {},
      namespace: "mole-state",
      initialState: "uninitialized",
      ActiveCountDown: 1500,
      delayActiveCountDown: 500,
      states: {
        uninitialized: {
          "*": function() {
            this.deferUntilTransition();
            this.transition("DEACTIVATED");
          }
        },
        DEACTIVATED: {
          _onEnter: function() {
            this.emit("DEACTIVATED");
            if (this.targetMole) {
              debugger;
              this.timer = setTimeout(
                function() {
                  this.handle("ACTIVEPATTERN");
                }.bind(this),
                this.delayActiveCountDown * this.targetMoleOrder
              );
            } else {
              this.transition("DISABLEDINPUT");
            }
          },
          ACTIVEPATTERN: "ACTIVEPATTERN",
          _onExit: function() {}
        },
        ACTIVEPATTERN: {
          _onEnter: function() {
            this.emit("ACTIVEPATTERN");
            this.timer = setTimeout(
              function() {
                this.handle("timeout");
              }.bind(this),
              this.ActiveCountDown
            );
          },
          timeout: "WAITINGINPUT",
          _onExit: function() {}
        },
        DISABLEDINPUT: {
          _onEnter: function() {
            this.emit("DISABLEDINPUT");
            this.timer = setTimeout(
              function() {
                this.handle("timeout");
              }.bind(this),
              this.ActiveCountDown
            );
          },
          timeout: "WAITINGINPUT"
        },
        WAITINGINPUT: {
          _onEnter: function() {
            this.emit("WAITINGINPUT");
          },
          ACTIVATED: "ACTIVATED",
          GAMEOVER_DISABLED: "GAMEOVER_DISABLED"
        },
        ACTIVATED: {
          _onEnter: function() {
            if (!this.targetMole) {
              this.handle("GAMEOVER"); // this also needs to be altered to get the correct mole
            }
            this.emit("ACTIVATED"); // The triggered event needs to reduce the "to hit" mole list
          },
          GAMEOVER: "GAMEOVER",
          _onExit: function() {}
        },
        GAMEOVER: {
          _onEnter: function() {
            this.emit("GAMEOVER", { status: "GAMEOVER" });
            this.handle("GAMEOVER_DISABLED");
          },
          _onExit: function() {}
        },
        GAMEOVER_DISABLED: {
          _onEnter: function() {
          },
          _onExit: function() {}
        }
      },
      clickMole: function() {
        this.handle("ACTIVATED");
      },
      disable: function() {
        this.handle("GAMEOVER_DISABLED");
      },
      go: function() {
        this.handle("DEACTIVATED");
      }
    });

    moleState.on("DEACTIVATED", function() {});

    moleState.on("ACTIVEPATTERN", function() {
      this.cellData.setTint();
    });

    moleState.on("DISABLEDINPUT", function() {
      this.cellData.setTint(0x5f6d70);
    });

    moleState.on("WAITINGINPUT", function() {
      if (scene.timeOutBar) {
        scene.timeOutBar.timeOutBarState.go(); // This should not be needed because it the fsm in constructed in the ctor. Should move it to the create method.
      }

      this.cellData.setTint(0x5f6d70);
    });

    moleState.on("ACTIVATED", function() {
      this.cellData.setTint();
      this.targetMole = false;
      let moles = scene.gameGrid.getListOfCells();
      var validTargetMoles = _(moles).find(
        s => s.cellData.moleState.targetMole === true
      );
      if (!validTargetMoles) {
        let gridState = scene.gameGrid.getGridState();
        gridState.winRound();
      }
    });
    moleState.on("GAMEOVER", function() {
      let gridState = scene.gameGrid.getGridState();
      gridState.gameOver();
    });

    this.tileWidth = 196.6;
    this.tileHight = 222.5;
    this.gridPosX = gridX;
    this.gridPosY = gridY;
    this.gridPixelPosX = this.tileWidth * gridX + this.tileWidth / 2 + 10;
    this.gridPixelPosY = this.tileHight * gridY + this.tileHight / 2 + 10;
    this.scene = scene;
    this.orgTint;

    this.setOrigin(0.5, 0.5);
    this.setPosition(this.gridPixelPosX, this.gridPixelPosY);
    this.cellData = this.scene.add
      .image(this.gridPixelPosX, this.gridPixelPosY, "moleIcon")
      .setInteractive();

    this.cellData.depth = 1;
    this.cellData.moleState = moleState;
    moleState.targetMole = this.targetMole;
    moleState.cellData = this.cellData;

    this.cellData.on("pointerdown", function() {
      this.moleState.clickMole();
    });

    this.disableInteractive = function() {
      this.cellData.disableInteractive();
    };
  }

  create() {}

  update() {}
}
