("use strict");
/*eslint quotes: ["error", "double"]*/
/*eslint no-global-assign: "off"*/
/*eslint no-unused-vars: "off"*/
/* global gameMoleLevel */
/* global machina*/

import Mole from "./Mole";
import MoleSecondScene from "./MoleSecondScene";


export default class PlayGrid extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene, winRoundScene) {
    super(scene, 0, 0, "playGrid");

    this.winRoundScene = winRoundScene || "Main"; //Default to the Main scene
    const x = scene.cameras.main.width / 2;
    const y = scene.cameras.main.height / 2;

    this.setPosition(x, y);
    this.setOrigin(0.5);
    this.grid = {};

    var vm = this;

    var Grid = function(xSize, ySize) {
      //initialize the grid.
      var gridArray = [];
      var dimensions = null;
      var listOfCells = [];

      var gridState = new machina.Fsm({
        initialize: function() {},
        namespace: "grid-state",
        initialState: "uninitialized",
        gameOverCountDown: 4000,
        startNewGameTimer: 3000,
        startNewRoundTimer: 1500,
        states: {
          uninitialized: {
            "*": function() {
              this.deferUntilTransition();
              this.transition("NORMAL");
            }
          },
          NORMAL: {
            _onEnter: function() {
              this.emit("NORMAL");
              this.timer = setTimeout(
                function() {
                  this.handle("GAMEOVER");
                }.bind(this),
                this.gameOverCountDown
              );
            },
            GAMEOVER: "GAMEOVER",
            WINROUND: "WINROUND",
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
            timeout: "WAITINGINPUT"
          },
          GAMEOVER: {
            _onEnter: function() {
              this.emit("GAMEOVER", { status: "GAMEOVER" });
              this.timer = setTimeout(
                function() {
                  this.handle("timeout");
                }.bind(this),
                this.startNewGameTimer
              );
            },
            timeout: function() {
              this.scene.start("Demo");
            },
            _onExit: function() {}
          },
          WINROUND: {
            _onEnter: function() {
              this.emit("WINROUND", { status: "WINROUND" });
              this.timer = setTimeout(
                function() {
                  this.handle("timeout");
                }.bind(this),
                this.startNewRoundTimer
              );
            },
            timeout: function() {
              this.scene.start(this.winRoundScene);
            },
            _onExit: function() {}
          }
        },
        go: function() {
          this.handle("DEACTIVATED");
        },
        gameOver: function() {
          this.handle("GAMEOVER");
        },
        winRound: function() {
          this.handle("WINROUND");
        }
      });

      gridState.on("NORMAL", function() {
        //normal might not be a great name for this state as it is not explicit
        this.imageData.setTint();
      });

      gridState.on("WINROUND", function() {
        this.imageData.setTint(0x00ff00);
        let moles = vm.gameGrid.getListOfCells();
        moles.forEach(mole => {
          mole.cellData.moleState.disable();
        });

        if (gameMoleLevel.round > 0) {
          if (gameMoleLevel.level < 4) {
            gameMoleLevel.level++;
            gameMoleLevel.round = 0;
          }
        } else {
          gameMoleLevel.round++;
        }
      });

      gridState.on("GAMEOVER", function() {
        let moles = vm.gameGrid.getListOfCells();
        moles.forEach(mole => {
          mole.cellData.moleState.disable();
        });

        this.imageData.setTint(0xff0000);
        gameMoleLevel = {
          level: 0,
          round: 0
        };
      });

      var Dimensions = function(row, col) {
          var x = col;
          var y = row;
          return {
            colSize: x,
            rowSize: y
          };
        },
        getGridArray = function() {
          return gridArray;
        },
        setGridArray = function(anArray) {
          gridArray = anArray;
        },
        getDimensions = function() {
          return dimensions;
        },
        getListOfCells = function() {
          return listOfCells;
        },
        getGridState = function() {
          return gridState;
        };

      dimensions = new Dimensions(ySize, xSize);

      return {
        getDimensions: getDimensions,
        getGridArray: getGridArray,
        getListOfCells: getListOfCells,
        setGridArray: setGridArray,
        getGridState: getGridState
      };
    };

    var Row = function(xSize, yCurrentRow) {
      var row = [];
      var gameGrid = vm.gameGrid.getListOfCells();

      for (let i = 0; i < xSize; i++) {
        // pop a reference to the cell in a list as well for convenience
        //switch this.
        let sceneName = scene.constructor.name;
        switch (sceneName) {
          case "SecondScene":
            var mole = scene.add.existing(new MoleSecondScene(scene, i, yCurrentRow));
            break;
          default:
            var mole = scene.add.existing(new Mole(scene, i, yCurrentRow));
            break;
        }

        gameGrid.push(mole);
      }
      vm.gameGrid.setGridArray(gameGrid);

      var getRow = function() {
        return row;
      };

      return {
        getRow: getRow
      };
    };

    function activate() {
      var columnAmount = 3;
      var rowAmount = 4; // total of 12 cells, its ok te define here as the size of the grid wont change.

      vm.gameGrid = new Grid(columnAmount, rowAmount);
      scene.gameGrid = vm.gameGrid;
      var gridArray = vm.gameGrid.getGridArray();
      for (let i = 0; i < rowAmount; i++) {
        var row = new Row(columnAmount, i);
      }
    }
    activate();
  }

  update() {}
}
