
/**
 * 
 * @Author: Jerard Joseph Buencamino
 * @Company: Leekie Enterprises
 * @2019
 * @FilePath: /?/class-roadmap
 * @Version: 1.0.0
 * @Created: Monday, 04 November 2019
 * @Changes: -
 * @Desc: Class/ Prototype to generate roadmap
 * 
 */

/**
 * HOW TO USE
 * var road = new roadmap();
 * road.generateRoadmap(win); // return all generated roadmap;
 * road.generateRoadmap(win, 'bead'); // return specific roadmap 
 *		NOTE: it will not process other roadmap so need generate if you're going to call
 * road.getRoadmap('bead'); // get roadmap after generating so no need to process the logic again
 * road.getResult(); // get total result for TGR, DRG, TIE
 *
 * DATA SAMPLE INPUT
 * var win = ['TGR','TIE','TIE','TGR','TGR','DRG','DRG','DRG',
 *		  	  'DRG','DRG','DRG','DRG','TGR','TGR','TGR','TGR',
 *		  	  'DRG','TGR','TIE','TIE','DRG']
 * DATA SAMPLE OUTPUT
 * var out = [{win:'TGR', tie:0},{win:'DRG', tie:2},{win:'TGR', tie:0},{win:'DRG', tie:0},
 *		  	  {win:'DRG', tie:0},{win:'TGR', tie:0},{win:'DRG', tie:2},{win:'TGR', tie:0},
 *		  	  {win:'TGR', tie:0},{win:'TIE', tie:0},{win:'TIE', tie:0},{win:'TGR', tie:0}]
 */

/**
 * @Function: Constructor
 */
function roadmap() {
  this.reset();
}


/*
 * @Function: reset
 * @Description: reset all information in roadmap
 */
roadmap.prototype.reset = function () {
  this._roundId = 0;
  this._cell = {
    dummy: [], bead: [], big: [], bigeye: [], small: [], cockroach: []
  }
  this._road = {
    dummy: [], bead: [], big: [], bigeye: [], small: [], cockroach: []
  }
  this._set = {
    "dummy": { x: 0, y: 0, prev: null, skip: 0, startmap: false },
    "bead": { x: 0, y: 0, skip: 0, startmap: false },
    "big": { x: 0, y: 0, xs: 0, ys: 0, prev: null, skip: 0, startmap: false },
    "bigeye": { x: 0, y: 0, xs: 0, ys: 0, prev: null, skip: 1, startmap: false },
    "small": { x: 0, y: 0, xs: 0, ys: 0, prev: null, skip: 2, startmap: false },
    "cockroach": { x: 0, y: 0, xs: 0, ys: 0, prev: null, skip: 3, startmap: false }
  }
  this._count = {
    'DRG': 0,
    'TGR': 0,
    'TIE': 0
  }
}

/*
 * @Function: setProperty
 * @Description: set property in the class
 * @Param: {String} property name
 * @Param: {Any: [String, Number, Boolean]} property value
 */
roadmap.prototype.setProperty = function (name, value) {
  this['_' + name] = value;
}

/*
 * @Function: getProperty
 * @Description: get the value of specific property name set in the class
 * @Param: {String} property name
 */
roadmap.prototype.getProperty = function (name) {
  return this['_' + name];
}

/*
 * @Function: checkCell
 * @Description: INTERNAL FUNCTION: use to check if cell is occupied in specific roadmap
 * @Param: {String} map name
 * @Param: {String} cell location
 */
roadmap.prototype.checkCell = function (map, cell) {
  return this._cell[map].indexOf(cell);
}

/*
 * @Function: pushCell
 * @Description: INTERNAL FUNCTION: use to push the location in specific roadmap
 * @Param: {String} map name
 * @Param: {String} cell location
 */
roadmap.prototype.pushCell = function (map, cell) {
  return this._cell[map].push(cell);
}

/*
 * @Function: fillArray
 * @Description: INTERNAL FUNCTION: use to push data in the array
 * @Param: {Object} ary
 * @Param: {Number} idx
 * @Param: {Object} data
 */
roadmap.prototype.fillArray = function (ary, idx, data) {

  for (var i = 0; i < idx; i++) {
    if (!ary[i]) ary.push({})
  }
  ary.splice(idx, 1, data);
}

/*
 * @Function: generateDummy
 * @Description: use to generate dummy data for ['bigeye', 'small', 'cockroach']
 * @Param: {Array} win
 */
roadmap.prototype.generateDummy = function (win) {

  var road = this._road['dummy'];
  var set = this._set['dummy'];
  set.x = -1;
  for (var idx in win) {
    if (!road[set.x]) road[set.x] = [];
    if (win[idx] != 'TIE') {
      if (win[idx] != set.prev) {
        set.x++; set.y = 0;
      } else {
        set.y++;
      }
      if (!road[set.x]) road[set.x] = [];
      this.fillArray(road[set.x], set.y, { 'win': win[idx], 'tie': 0 })
      set.prev = win[idx];
    }
  }
}

/*
 * @Function: countResult
 * @Description: use to count [ DRG, TGR, TIE ] result
 * @Param: {String} result
 */
roadmap.prototype.countResult = function (result) {
  this._count[result]++;
}

/*
 * @Function: generateBead
 * @Description: use to generate bead roadmap
 * @Param: {Array} win
 */
roadmap.prototype.generateBead = function (win) {

  var bead = this._road['bead'];
  var set = this._set['bead'];
  for (var idx in win) {
    if (!bead[set.x]) bead[set.x] = [];
    this.fillArray(bead[set.x], set.y, { 'win': win[idx], 'tie': 0 });
    set.y++; if (set.y == 6) { set.y = 0; set.x++; }
  }
}

/*
 * @Function: generateBig
 * @Description: use to generate big roadmap
 * @Param: {Array} win
 */
roadmap.prototype.generateBig = function (win) {

  var big = this._road['big'];
  var set = this._set['big'];
  for (var idx in win) {
    this.countResult(win[idx]);
    if (!big[set.x]) big[set.x] = [];
    if (win[idx] == 'TIE') {	// TIE
      if (big[set.x][set.y]) {
        big[set.x][set.y].tie = big[set.x][set.y].tie + 1;
      } else {
        this.fillArray(big[set.x], set.y, { 'win': null, 'tie': 1 })
      }
    } else {
      if (big[set.x][set.y] && big[set.x][set.y].win == null) {
        if (this.checkCell('big', set.x + ',' + set.y) == -1) {
          big[set.x][set.y].win = win[idx];
          this.pushCell('big', set.x + ',' + set.y);
        }
        set.prev = win[idx];
      } else {
        this.roadPlotting('big', win[idx])
      }

    }
  }
}

/*
 * @Function: generateHardRoadmap
 * @Description: use to generate ['bigeye', 'small', 'cockroach'] roadmap
 * @Param: {String} win
 */
roadmap.prototype.generateHardRoadmap = function (win, map) {
  var dummy = this._road['dummy'];
  this.generateDummy(win);
  for (var col in dummy) {
    for (var row in dummy[col]) {

      if ((col == 1 && row == 1) || (col == 2 && row == 0)) this._set['bigeye'].startmap = true;
      if ((col == 2 && row == 1) || (col == 3 && row == 0)) this._set['small'].startmap = true;
      if ((col == 3 && row == 1) || (col == 4 && row == 0)) this._set['cockroach'].startmap = true;

      if ((!map || map == 'bigeye') && this._set['bigeye'].startmap) { // big eye
        this.hardRoad('bigeye', col, row);
      }
      if ((!map || map == 'small') && this._set['small'].startmap) { // small
        this.hardRoad('small', col, row);
      }
      if ((!map || map == 'cockroach') && this._set['cockroach'].startmap) { // cockroach
        this.hardRoad('cockroach', col, row);
      }
    }
  }
}

/*
 * @Function: hardRoad
 * @Description: INTERNAL FUNCTION: use for the main logic of ['bigeye', 'small', 'cockroach'] roadmap
 * @Param: {String} map
 * @Param: {Number} col
 * @Param: {Number} row
 */
roadmap.prototype.hardRoad = function (map, col, row) {

  var dummy = this._road['dummy'];
  var set = this._set[map];
  var value = null;
  if (dummy[col][row]) {
    if (row == 0) {
      var col1 = dummy[col - 1].length
      var col2 = dummy[col - 1 - set.skip].length
      if (col1 && col2 && col1 == col2) value = 'DRG'; // RED
      else if (col1 == undefined && col2 == undefined) value = 'DRG'; // RED
      else value = 'TGR'; // BLUE
    } else {
      var row1 = dummy[col - set.skip][row]
      var row2 = dummy[col - set.skip][row - 1]
      if (row1 && row2 && row1.win == row2.win) value = 'DRG'; // RED
      else if (row1 == undefined && row2 == undefined) value = 'DRG'; // RED
      else value = 'TGR';	// BLUE		
    }
    this.roadPlotting(map, value);
  }
}

/*
 * @Function: roadPlotting
 * @Description: INTERNAL FUNCTION: use to plot data in specific roadmap
 * @Param: {String} map
 * @Param: {String} value
 */
roadmap.prototype.roadPlotting = function (map, value) {

  var road = this._road[map];
  var set = this._set[map];
  if (set.prev) {
    if (value != set.prev) {
      set.xs++;
      set.ys = 0;
      set.x = set.xs;
      set.y = set.ys;
    } else {
      set.y++;
      if (set.y == 6) {
        set.x++;
        set.y--;
      }
    }

    if (this.checkCell(map, set.x + ',' + set.y) != -1) {
      set.x++;
      set.y--;
    }

  }
  if (!road[set.x]) road[set.x] = [];
  this.fillArray(road[set.x], set.y, { 'win': value, 'tie': 0 })
  this.pushCell(map, set.x + ',' + set.y);

  set.prev = value;
}

/*
 * @Function: generateRoadmap
 * @Description: use to generate roadmap
 * @Param: {Object} win
 * @Param: {String} map
 * @return {Object} this
 */
roadmap.prototype.generateRoadmap = function (win, map) {
  this.reset();
  if (map) {
    if (map == 'bead') {
      this.generateBead(win);
    } else if (map == 'big') {
      this.generateBig(win);
    } else {
      this.generateHardRoadmap(win, map);
    }
    var obj = {};
    obj[map] = this.getRoadmap(map);
    return obj;
  } else {
    this.generateBead(win);
    this.generateBig(win);
    this.generateHardRoadmap(win);
    return this.getAllRoadmap();
  }
}

/*
 * @Function: getAllRoadmap
 * @Description: call to get all roadmap that already generated
 * @Param: {String} map
 * @return {Object} this._roadmap
 */
roadmap.prototype.getAllRoadmap = function (map) {
  return {
    bead: this._road.bead,
    big: this._road.big,
    bigeye: this._road.bigeye,
    small: this._road.small,
    cockroach: this._road.cockroach,
  };
}

/*
 * @Function: getRoadmap
 * @Description: call to get specific roadmap that already generated
 * @Param: {String} map
 * @return {Object} this._roadmap[map]
 */
roadmap.prototype.getRoadmap = function (map) {
  return this._road[map];
}

/*
 * @Function: getResult
 * @Description: get total DRG, TRG, TIE result
 * @return {Object} this._count;
 */
roadmap.prototype.getResult = function () {
  return this._count;
}

export default roadmap;