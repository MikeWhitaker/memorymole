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
            this.transition("WAITING-INPUT");
          },
          _onExit: function() {}
        },
        "ACTIVE-PATTERN": {
          _onEnter: function() {
            this.timer = setTimeout(
              function() {
                this.handle("timeout");
              }.bind(this),
              this.ActiveCountDown
            );
            this.emit("ACTIVE-PATTERN");
          },
          timeout: "WAITING-INPUT",
          _onExit: function() {
            clearTimeout(this.timer);
          }
        },
        "WAITING-INPUT": {
          _onEnter: function() {
            this.emit("WAITING-INPUT");
          },
          ACTIVATED: "ACTIVATED",
          _onExit: function() {
            clearTimeout(this.timer);
          }
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

    moleState.go(); //initialize the state machine

    moleState.on("DEACTIVATED", function() {});

    moleState.on("ACTIVE-PATTERN", function() {
      // if it has been selected as part of the target moles then light it up for a specified time
      this.cellData.setTint();
    });
    moleState.on("WAITING-INPUT", function() {
      debugger;
      this.cellData.setTint(0x5f6d70);
    });
    moleState.on("GAME-OVER", function() {});
    moleState.on("ACTIVATED", function() {
      // need to define a variable for turned-off color.
      debugger;
      this.cellData.setTint(0x5f6d70);
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
  }

  create() {}

  update() {}
}
