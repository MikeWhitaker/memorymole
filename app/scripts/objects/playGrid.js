import Mole from './Mole';

export default class PlayGrid extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene) {
    super(scene, 0, 0, 'PlayGrid');

    debugger;
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
        };

      dimensions = new Dimensions(ySize, xSize);

      return {
        getDimensions: getDimensions,
        getGridArray: getGridArray,
        getListOfCells: getListOfCells,
        setGridArray: setGridArray
      };
    };
 
    var Row = function(xSize, yCurrentRow) {
      var row = [];
      var gameGrid = vm.gameGrid.getListOfCells();
      for (let i = 0; i < xSize; i++) {
        // pop a reference to the cell in a list as well for convenience
        //this.aMole = this.add.existing(new Mole(this));
        var mole = scene.add.existing(new Mole(scene, i, yCurrentRow));
      
        gameGrid.push(mole);
      }

      var getRow = function() {
        return row;
      };

      return {
        getRow: getRow
      };
    };
    
    function activate() {
      var columnAmount = 3;
      var rowAmount = 4; // total of 12 cells

      vm.gameGrid = new Grid(columnAmount, rowAmount);
      var gridArray = vm.gameGrid.getGridArray();
      for (let i = 0; i < rowAmount; i++) {
        var row = new Row(columnAmount, i);
        gridArray.push(row);
      }
    }
    activate();
  }

  /**
   *  Increment the angle smoothly.
   */
  update() {
    // Get called from main.js update
    // this.angle += 0.1;
  }
}
