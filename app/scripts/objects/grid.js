export default class Grid extends Phaser.GameObjects.Sprite {
  /**
   *  A simple prefab (extended game object class), displaying a spinning
   *  Phaser 3 logo.
   *
   *  @extends Phaser.GameObjects.Sprite
   */
  constructor(scene) {
    super(scene, 0, 0, 'playGrid');

    const x = scene.cameras.main.width / 2;
    const y = scene.cameras.main.height / 2;

    this.setPosition(x, y);
    this.setOrigin(0.5);
    this.grid = {};
    
  }

  create() {
    var grid = function(xSize, ySize) {
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
    }();
  
    var point = function(col, row) {
      var x = col,
        y = row,
        getCoOrdinates = function() {
          return {
            x: x,
            y: y
          };
        };
  
      return {
        getCoOrdinates: getCoOrdinates
      };
    };
  
    var Row = function(xSize, yCurrentRow) {
      var row = [];
      var gameGrid = vm.gameGrid.getListOfCells();
      for (let i = 0; i < xSize; i++) {
        var aCell = new Cell(yCurrentRow, i);
        // one in five should generate a living cell.
        // others should be dead but still present.
        let rnd = Math.random() * 10;
        if (rnd < 0.8) {
          row.push(aCell);
          aCell.live();
        } else {
          aCell.die();
          row.push(aCell);
        }
        // pop a reference to the cell in a list as well for convenience
        gameGrid.push(aCell);
      }
  
      var getRow = function() {
        return row;
      };
  
      return {
        getRow: getRow
      };
    };
  }
  

  /**
   *  Increment the angle smoothly.
   */
  update() {
    // Get called from main.js update
    // this.angle += 0.1;
  }
}
