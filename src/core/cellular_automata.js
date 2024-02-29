// Generated by CoffeeScript 2.7.0
(function () {
  var ChainMap, evaluateTotalisticAutomaton, neighborsSum, NeighborColorMap;

  ({ ChainMap } = require("./chain_map.js"));
  ({ NeighborColorMap } = require("./neighbor_util.js"));

  colorDict = new NeighborColorMap();

  exports.neighborsSum = neighborsSum = function (
    cells,
    tiling,
    plus = function (x, y) {
      // Unsure if this is correct since it is no longer consistent with the others
      if (y > 0) {
        return x + y;
      } else {
        return x + y;
      }
    },
    plusInitial = 0
  ) {
    var sums;
    sums = new ChainMap();
    cells.forItems(function (cell, value) {
      var i, len, neighbor, ref;
      ref = tiling.moore(cell);
      console.log(`CELL: ${cell} (state ${value})`);
      console.log(`NEIGHBORS ${ref}`);
      for (i = 0, len = ref.length; i < len; i++) {
        neighbor = ref[i];
        console.log(`Neighbor: ${neighbor}`);
        colorDict.updateNeighborColorCounts(neighbor, value);
        colorDict.addStateOfNeighbors(neighbor, cell, value);
        sums.putAccumulate(neighbor, value, plus, plusInitial);
      }
      // console.log(colorDict.getNeighborColorCounts());
      colorDict.getStatesOfNeighbors();
      //don't forget the cell itself! It must also present, with zero (initial) neighbor sum
      if (sums.get(cell) === null) {
        return sums.put(cell, plusInitial);
      }
    });
    return sums;
  };

  exports.evaluateTotalisticAutomaton = evaluateTotalisticAutomaton = function (
    cells,
    tiling,
    nextStateFunc,
    plus,
    plusInitial
  ) {
    var newCells, sums;
    newCells = new ChainMap();
    sums = neighborsSum(cells, tiling, plus, plusInitial);
    sums.forItems(function (cell, neighSum) {
      var cellState, currentState, nextState, ref;
      cellState = (ref = cells.get(cell)) != null ? ref : 0;
      // Done to take note of the cell's current state
      currentState = cellState;
      if (cellState >= 1) {
        // Note that each state is represented by a number.
        // Thus the computation for the next state can be affected.
        // So we also make it equivalent to 1.
        // Doing it inside the plus function does not work for some reason
        cellState = cellState / cellState;
      }
      // console.log(`cell: ${cell}`);
      // console.log(`Highest Color Count ${colorDict.determineHighestColorCount(cell)}`);
      nextState = nextStateFunc(cellState, neighSum);
      if (nextState !== 0) {
        if (currentState === 0) {
          // console.log(colorDict.computeNewState(cell));
          // nextState = nextState * colorDict.determineHighestColorCount(cell);
          nextState = nextState * colorDict.computeNewState(cell);
        } else {
          nextState = nextState * currentState;
        }
        return newCells.put(cell, nextState);
      }
    });
    colorDict.emptyNeighborColorCounts();
    colorDict.emptyStatesOfNeighbors();
    return newCells;
  };
}).call(this);
