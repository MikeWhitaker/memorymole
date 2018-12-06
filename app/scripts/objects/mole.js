("use strict");
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
    var moleState = new machina.Fsm({
      initialize: function(options) {},
      namespace: "mole-state",
      initialState: "uninitialized",
      ActiveCountDown: 1000,
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
            this.transition("WAITINGINPUT");
          },
          _onExit: function() {}
        },
        WAITINGINPUT: {
          _onEnter: function() {
            this.emit("WAITINGINPUT");
          },
          ACTIVATED: "ACTIVATED"
        },
        ACTIVATED: {
          _onEnter: function() {
            this.emit("ACTIVATED"); // The triggered event needs to reduce the 'to hit' mole list
          },
          _onExit: function() {}
        },
        "GAME-OVER": {
          _onEnter: function() {
            this.emit("GAME-OVER", { status: "GAME-OVER" });
          },
          _onExit: function() {}
        }
      },
      clickMole: function() {
        this.handle("ACTIVATED");
      },
      go: function() {
        this.handle("DEACTIVATED");
      }
    });

    moleState.on("DEACTIVATED", function() {
    });

    moleState.on("WAITINGINPUT", function() {
      console.log("entered WAITINGINPUT");
      this.cellData.setTint(0x5f6d70);
    });

    moleState.on("ACTIVATED", function() {
      this.cellData.setTint();
    });
    moleState.on("GAME-OVER", function() {});

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
    moleState.cellData = this.cellData;

    this.cellData.on("pointerdown", function(pointer) {
      this.moleState.clickMole();
    });

    this.disableInteractive = function() {
      this.cellData.disableInteractive();
    };

    // done initilizing. 
    // Start the mole state machine.

    moleState.go(); //initialize the state machine
  }

  create() {}

  update() {}
}
