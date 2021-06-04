var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
ctx.strokeStyle = "Black";
ctx.fillStyle= "pink";
ctx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);


var StartSprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
var audio;
var count = 0;
window.onload = function() {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  //Load and edit sprites
  var spiritOne = false;
  var  spiritTwo = false;
  var isComplete = () => {
    if(spiritOne === true && spiritTwo === true)
       {
         console.log("Runs");
         setTimeout(function(){
           makeMaze();
         }, 500);         
       }
  };
  startSprite = new Image();
 startSprite.src = "https://i.ibb.co/Yf0mdKJ/2.gif";
  startSprite.onload = function() {
     spiritOne = true;
    isComplete();
  };

//
  finishSprite = new Image();
  finishSprite.src = "https://i.ibb.co/MhNC04y/ca.gif";
  finishSprite.onload = function() {
     spiritTwo = true;
    isComplete();
  };
  
};


window.onresize = function() {
  let viewWidth = $("#view").width();
  let viewHeight = $("#view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  cellSize = mazeCanvas.width / difficulty;
  if (player != null) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
};
// Background music start as soon as player hits the start button
var count = 0;
function music(){
   audio = new Audio('../Media/gameSound.mpeg');
   audio.play();
}
//Stop music on end game
function stop() {
  audio.pause();
}

//Generate Random number
function rand(number) {
  return Math.floor(Math.random() * number);
}
// Shuffles the directions 
function shuffle(direction) {
    for (var i = direction.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = direction[i];
        direction[i] = direction[j];
        direction[j] = temp;
    }
    return direction;
}
//Function to display final scores
function displayVictoryMess(moves) {
  total_moves = moves;
  stop();
  score_selector_levels();
 
  document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
  toggleVisablity("Message-Container");   
}
// Function to set visibility of score
function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
}
//Function to create Maze
function Maze(Width, Height) {
  var maze;
  var width = Width;
  var height = Height;
  var startingCoordinate, endingCoordinate;
  var dirs = ["n", "s", "e", "w"];
  var modifyDirection = {
    n: {
      y: -1,
      x: 0,
      o: "s"
    },
    s: {
      y: 1,
      x: 0,
      o: "n"
    },
    e: {
      y: 0,
      x: 1,
      o: "w"
    },
    w: {
      y: 0,
      x: -1,
      o: "e"
    }
  };

  this.map = function() {
    return maze;
  };
  this.startingCoordinate = function() {
    return startingCoordinate;
  };
  this.endingCoordinate = function() {
    return endingCoordinate;
  };
//Function to create 2-D array
  function genMap() {
    maze = new Array(height);
    for (y = 0; y < height; y++) {
      maze[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        maze[y][x] = {
          n: false,
          s: false,
          e: false,
          w: false,
          visited: false,
          priorPos: null
        };
      }
    }
  }
//Function to set path of maze
  function defineMaze() {
    var maze_Complete = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var position = { x: 0, y: 0 };
    var numCells = width * height;
    while (!maze_Complete) {
      move = false;
      maze[position.x][position.y].visited = true;

      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 5));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = position.x + modifyDirection[direction].x;
        var ny = position.y + modifyDirection[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          //Check if the tile is already visited
          if (!maze[nx][ny].visited) {
            //Carve through walls from this tile to next
            maze[position.x][position.y][direction] = true;
            maze[nx][ny][modifyDirection[direction].o] = true;

            //Set Currentcell as next cells Prior visited
            maze[nx][ny].priorPos = position;
            //Update Cell position to newly visited location
            position = { x: nx, y: ny};
            cellsVisited++;
            //Recursively call this method on the next tile
            move = true;
            break;
          }
        }
      }

      if (!move) {
        //  If it failed to find a direction,
        //  move the current position back to the prior cell and Recall the method.
        position = maze[position.x][position.y].priorPos;
      }
      if (numCells == cellsVisited) {
        maze_Complete = true;
      }
    }
  }

//Funtion to set the coordinates of start and final sprites
  function defineStartEnd() {
    switch (rand(4)) {
      case 0:
        startingCoordinate = {
          x: 0,
          y: 0
        };
        endingCoordinate = {
          x: height - 1,
          y: width - 1
        };
        break;
      case 1:
        startingCoordinate = {
          x: 0,
          y: width - 1
        };
        endingCoordinate = {
          x: height - 1,
          y: 0
        };
        break;
      case 2:
        startingCoordinate = {
          x: height - 1,
          y: 0
        };
        endingCoordinate = {
          x: 0,
          y: width - 1
        };
        break;
      case 3:
        startingCoordinate = {
          x: height - 1,
          y: width - 1
        };
        endingCoordinate = {
          x: 0,
          y: 0
        };
        break;
    }
  }

if(count == 0){
  music();
  count++;
}else{
  stop();
  music();
}
  genMap();
  defineStartEnd();
  defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  var map = Maze.map();
  var cellSize = cellsize;
  var drawEndMethod;
  ctx.lineWidth = cellSize / 30;

  this.redrawMaze = function(size) {
    cellSize = size;
    ctx.lineWidth = cellSize / 50;
    drawMap();
    drawEndMethod();
  };

  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize;
    var y = yCord * cellSize;

    if (cell.n === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.s === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.e === false) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.w === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }

  function drawMap() {
    for (x = 0; x < map.length; x++) {
      for (y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }
//Display the default finish spirte if sprite not loaded on end coordinates
  function drawEndFlag() {
    var coord = Maze.endingCoordinate();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        colorSwap = !colorSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }
// Display the finish sprite on end coordinates
  function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 5;
    var coord = Maze.endingCoordinate();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }
//Function always clear the previous sprite on restarting the game
  function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }

  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = drawEndFlag;
  }
  clear();
  drawMap();
  drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, startSprite = null) {
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  drawSprite = drawSpriteCircle;
  if (startSprite != null) {
    drawSprite = drawSpriteImg;
  }
  var player = this;
  var map = maze.map();
  var cellCoords = {
    x: maze.startingCoordinate().x,
    y: maze.startingCoordinate().y
  };
  var cellSize = _cellsize;
  var halfCellSize = cellSize / 2;

  this.redrawPlayer = function(_cellsize) {
    cellSize = _cellsize;
    drawSpriteImg(cellCoords);
  };

// Draw the default start sprite if sprite is not loaded on starting coordinates
  function drawSpriteCircle(coord) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }
// Draw  start sprite on starting coordinates
  function drawSpriteImg(coord) {
    var left = cellSize / 50;
    var right = cellSize / 25;
    ctx.drawImage(
      startSprite,
      0,
      0,
      startSprite.width,
      startSprite.height,
      coord.x * cellSize + left,
      coord.y * cellSize + left,
      cellSize - right,
      cellSize - right
    );
    if (coord.x === maze.endingCoordinate().x && coord.y === maze.endingCoordinate().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }
//Function to revome the sprite
  function removeSprite(coord) {
    var left = cellSize / 50;
    var right = cellSize / 25;
    ctx.clearRect(
      coord.x * cellSize + left,
      coord.y * cellSize + left,
      cellSize - right,
      cellSize - right
    );
  }
//Function to check the direction for movements
  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
      case 37: // west
        if (cell.w == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x - 1,
            y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 38: // north
        if (cell.n == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y - 1
          };
          drawSprite(cellCoords);
        }
        break;
      case 39: // east
        if (cell.e == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x + 1,
            y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 40: // south
        if (cell.s == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x,
            y: cellCoords.y + 1
          };
          drawSprite(cellCoords);
        }
        break;
    }
  }

  this.bindKeyDown = function() {
    window.addEventListener("keydown", check );

    $("#view").swipe({
      swipe: function(direction) {
        switch (direction) {
          case "up": check({ keyCode: 38 });
                      break;
          case "down": check({ keyCode: 40 });
                       break;
          case "left": check({ keyCode: 37 });
                        break;
          case "right": check({ keyCode: 39 });
                         break;
        }
      },
      threshold: 0
    });
  };

  this.unbindKeyDown = function() {
    window.removeEventListener("keydown", check, false);
    $("#view").swipe("destroy");
  };

  drawSprite(maze.startingCoordinate());

  this.bindKeyDown();
}
//Entry point
function makeMaze() {
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
   var e = document.getElementById("diffSelect");
   difficulty = e.options[e.selectedIndex].value;
   cellSize = mazeCanvas.width / difficulty;
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, startSprite);
  if (document.getElementById("mazeContainer").style.opacity < "100") {
    document.getElementById("mazeContainer").style.opacity = "100";
  }
}
//------------------------------Database Methods-----------------------------------------------



var username = localStorage.getItem("username")  // fetching data stored in database

function score_update_easy(){

  firebase.database().ref("PlayerRecords/" + username).update({
    Easy:total_moves

  })
}

//functions to Update moves to the Database

function score_update_extreme(){

  firebase.database().ref("PlayerRecords/" + username).update({
    Extreme:total_moves

  })
}
function score_update_hard(){

  firebase.database().ref("PlayerRecords/" + username).update({
    Hard:total_moves

  })
}

//functions to Update moves to the Database

function score_update_medium(){

  firebase.database().ref("PlayerRecords/" + username).update({
    Medium:total_moves

  })
}

function score_selector_levels(){  //Setting score according to the Difficulty
 

   if(parseInt(difficulty)==10){
     score_update_easy()
   }
   else if(parseInt(difficulty)==15){
     score_update_medium()
   }
   else if(parseInt(difficulty)==20){
    score_update_hard()
  }
  else{
    score_update_extreme()
  }

}