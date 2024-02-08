let gridSpace = []; //grid for playing

let pieceOptions = ["I", "J", "L", "O", "S", "T", "Z"]; //pieces to choose from
let nextPieces = [];
let holdPiece = "";
  
let TimeElapsed = 0; //time for visual delays
let moveRate = 100; //speed at which this pieces move down automatically

let isPiecePlaced = true; //if a new piece needs to be spawned

let piece;
let prevType;

let playerSlide = 0; //velocity for horizontal movement
let playerDrop = 0; //velocity for downward movement

let h = 0;//temp variable for horizontal moving
let v = 0;//temp variable for vertical moving

let isAtBottom = false; //variable for tracking when a piece is sitting on a spot where it can be placed.

let canShift = true; //if a piece is allowed to move left or right

let pieceRot = 0; //rotation number of the piece
let prevpieceRot = 0; //tracks the last rotation to know when rotation changes
let numMoved = 0; //temp variable to help certain rotation cases

let score = 0; //user score
let lines = 0;
let level = 0;
let highscore = 0; //user highscoere

let scene = "menu"; //scene that the user is on

let canHold = true;

let mode = "CLASSIC";

let isMusicPlaying = false;

function preload() {
  logo = loadImage('images/tetris-logo.png')
  moveSound = loadSound('sounds/MovePiece2.wav')
  playSound = loadSound('sounds/enterSound.wav')
  returnSound = loadSound('sounds/returnSound.wav')
  lineSound = loadSound('sounds/lineClear.wav')
  tetrisSound = loadSound('sounds/tetrisClear.wav')
  Music = loadSound('sounds/Tetris.mp3')
  loseSound = loadSound('sounds/GameOver.wav')
  rotateSound = loadSound('sounds/rotate.mp3')
  placeSound = loadSound('sounds/placepiece.mp3')
}

function setup() {
  let sketch = createCanvas(800, 610);
  sketch.parent("mycanvas");

  rectMode(CENTER);
  textAlign(CENTER);
  imageMode(CENTER);

  Music.setVolume(0.4);
  moveSound.setVolume(0.4);
  rotateSound.setVolume(0.5);
}//end setup

class PIECE {
  constructor(type) {
    this.name = type;
    
    if (type == "I") {
      this.piece1x = 3;
      this.piece2x = 4;
      this.piece3x = 5;
      this.piece4x = 6;
      this.piece1y = 0;
      this.piece2y = 0;
      this.piece3y = 0;
      this.piece4y = 0;
    }

    else if (type == "J") {
      this.piece1x = 3;
      this.piece2x = 3;
      this.piece3x = 4;
      this.piece4x = 5;
      this.piece1y = 0;
      this.piece2y = 1;
      this.piece3y = 1;
      this.piece4y = 1;
    }

    else if (type == "L") {
      this.piece1x = 5;
      this.piece2x = 5;
      this.piece3x = 4;
      this.piece4x = 3;
      this.piece1y = 0;
      this.piece2y = 1;
      this.piece3y = 1;
      this.piece4y = 1;
    }

    else if (type == "O") {
      this.piece1x = 4;
      this.piece2x = 5;
      this.piece3x = 4;
      this.piece4x = 5;
      this.piece1y = 0;
      this.piece2y = 0;
      this.piece3y = 1;
      this.piece4y = 1;
    }

    else if (type == "S") {
      this.piece1x = 5;
      this.piece2x = 4;
      this.piece3x = 4;
      this.piece4x = 3;
      this.piece1y = 0;
      this.piece2y = 0;
      this.piece3y = 1;
      this.piece4y = 1;
    }

    else if (type == "T") {
      this.piece1x = 4;
      this.piece2x = 3;
      this.piece3x = 4;
      this.piece4x = 5;
      this.piece1y = 0;
      this.piece2y = 1;
      this.piece3y = 1;
      this.piece4y = 1;
    }

    else if (type == "Z") {
      this.piece1x = 3;
      this.piece2x = 4;
      this.piece3x = 4;
      this.piece4x = 5;
      this.piece1y = 0;
      this.piece2y = 0;
      this.piece3y = 1;
      this.piece4y = 1;
    }
  }

  autoMove() {
    gridSpace[this.piece1x][this.piece1y] = ""
    gridSpace[this.piece2x][this.piece2y] = ""
    gridSpace[this.piece3x][this.piece3y] = ""
    gridSpace[this.piece4x][this.piece4y] = ""
    this.piece1y++;
    this.piece2y++;
    this.piece3y++;
    this.piece4y++;
  }

  HorizontalMove(velocity) {
    gridSpace[this.piece1x][this.piece1y] = ""
    gridSpace[this.piece2x][this.piece2y] = ""
    gridSpace[this.piece3x][this.piece3y] = ""
    gridSpace[this.piece4x][this.piece4y] = ""
    this.piece1x += velocity;
    this.piece2x += velocity;
    this.piece3x += velocity;
    this.piece4x += velocity;
    moveSound.play();
  }

  DownMove(velocity) {
    gridSpace[this.piece1x][this.piece1y] = ""
    gridSpace[this.piece2x][this.piece2y] = ""
    gridSpace[this.piece3x][this.piece3y] = ""
    gridSpace[this.piece4x][this.piece4y] = ""
    this.piece1y += velocity;
    this.piece2y += velocity;
    this.piece3y += velocity;
    this.piece4y += velocity;
    moveSound.play();
    
    if(velocity>0){
      score+=1;
    }
  }

  Rotate(num){
    gridSpace[this.piece1x][this.piece1y] = ""
    gridSpace[this.piece2x][this.piece2y] = ""
    gridSpace[this.piece3x][this.piece3y] = ""
    gridSpace[this.piece4x][this.piece4y] = ""
    
    if(this.name == "I"){
      rotateSound.play();
      if(num == 0){
        this.piece1x-=1
        this.piece1y-=2
        this.piece2y-=1
        this.piece3x+=1
        this.piece4x+=2
        this.piece4y+=1
      }
      else if(num == 1){
        this.piece1x+=2
        this.piece1y-=1
        this.piece2x+=1
        this.piece3y+=1
        this.piece4x-=1
        this.piece4y+=2
      }
      else if(num == 2){
        this.piece1x+=1
        this.piece1y+=2
        this.piece2y+=1
        this.piece3x-=1
        this.piece4x-=2
        this.piece4y-=1
      }
      else{
        this.piece1x-=2
        this.piece1y+=1
        this.piece2x-=1
        this.piece3y-=1
        this.piece4x+=1
        this.piece4y-=2
      }
    }
    else if(this.name == "J"){
      rotateSound.play();
      if(num == 0){
        this.piece1y-=2
        this.piece2x-=1
        this.piece2y-=1
        this.piece4x+=1
        this.piece4y+=1
      }
      else if(num == 1){
        this.piece1x+=2
        this.piece2x+=1
        this.piece2y-=1
        this.piece4x-=1
        this.piece4y+=1
      }
      else if(num == 2){
        this.piece1y+=2
        this.piece2x+=1
        this.piece2y+=1
        this.piece4x-=1
        this.piece4y-=1
      }
      else{
        this.piece1x-=2
        this.piece2x-=1
        this.piece2y+=1
        this.piece4x+=1
        this.piece4y-=1
      }
    }
    else if(this.name == "L"){
      rotateSound.play();
      if(num == 0){
        this.piece1x+=2
        this.piece2x+=1
        this.piece2y+=1
        this.piece4x-=1
        this.piece4y-=1
      }
      else if(num == 1){
        this.piece1y+=2
        this.piece2x-=1
        this.piece2y+=1
        this.piece4x+=1
        this.piece4y-=1
      }
      else if(num == 2){
        this.piece1x-=2
        this.piece2x-=1
        this.piece2y-=1
        this.piece4x+=1
        this.piece4y+=1
      }
      else{
        this.piece1y-=2
        this.piece2x+=1
        this.piece2y-=1
        this.piece4x-=1
        this.piece4y+=1
      }
    }
    else if(this.name == "O"){
      rotateSound.play();
      return;
    }
    else if(this.name == "S"){
      rotateSound.play();
      if(num == 0){
        this.piece1x+=2
        this.piece2x+=1
        this.piece2y-=1
        this.piece4x-=1
        this.piece4y-=1
      }
      else if(num == 1){
        this.piece1y+=2
        this.piece2x+=1
        this.piece2y+=1
        this.piece4x+=1
        this.piece4y-=1
      }
      else if(num == 2){
        this.piece1x-=2
        this.piece2x-=1
        this.piece2y+=1
        this.piece4x+=1
        this.piece4y+=1
      }
      else{
        this.piece1y-=2
        this.piece2x-=1
        this.piece2y-=1
        this.piece4x-=1
        this.piece4y+=1
      }
    }
    else if(this.name == "T"){
      rotateSound.play();
      if(num == 0){
        this.piece1x+=1
        this.piece1y-=1
        this.piece2x-=1
        this.piece2y-=1
        this.piece4x+=1
        this.piece4y+=1
      }
      else if(num == 1){
        this.piece1x+=1
        this.piece1y+=1
        this.piece2x+=1
        this.piece2y-=1
        this.piece4x-=1
        this.piece4y+=1
      }
      else if(num == 2){
        this.piece1x-=1
        this.piece1y+=1
        this.piece2x+=1
        this.piece2y+=1
        this.piece4x-=1
        this.piece4y-=1
      }
      else{
        this.piece1x-=1
        this.piece1y-=1
        this.piece2x-=1
        this.piece2y+=1
        this.piece4x+=1
        this.piece4y-=1
      }
    }
    else if(this.name == "Z"){
      rotateSound.play();
      if(num == 0){
        this.piece1y-=2
        this.piece2x+=1
        this.piece2y-=1
        this.piece4x+=1
        this.piece4y+=1
      }
      else if(num == 1){
        this.piece1x+=2
        this.piece2x+=1
        this.piece2y+=1
        this.piece4x-=1
        this.piece4y+=1
      }
      else if(num == 2){
        this.piece1y+=2
        this.piece2x-=1
        this.piece2y+=1
        this.piece4x-=1
        this.piece4y-=1
      }
      else{
        this.piece1x-=2
        this.piece2x-=1
        this.piece2y-=1
        this.piece4x+=1
        this.piece4y-=1
      }
    }
  }
  hardDrop(){
    while(!checkDCollision(this)){
      this.autoMove();
      score+=1;
    }
  }
} //end piece class

function draw() {
  
  if(scene == "game"){
    gameScene();
  }
  else if(scene == "end"){
    endScene();
  }
  else if(scene == "menu"){
    menuScene();
  }
  else if(scene == "tutorial"){
    tutorialScene();
  }
  else if(scene == "pause"){
    pauseScene();
  }
} //end draw

function menuScene(){
  Music.pause();
  isMusicPlaying = false;
  
  textAlign(CENTER)
  background(235)
  
  fill(150);
  noStroke();
  strokeWeight(2);
  rect(400, 306, 350, 600, 30)

  fill(50);
  stroke(0);
  strokeWeight(2);
  rect(400, 306, 320, 580, 5)
  
  image(logo, 400, 150, 300, 230)


  if(mouseX > 315 && mouseX < 485 && mouseY > 280 && mouseY < 340){
    fill(122, 255, 105);
    noStroke();
    rect(400, 310, 160, 50, 10);

    textSize(25);
    fill(0);
    strokeWeight(1)
    stroke(0)
    text("PLAY", 398, 315)

    textSize(11);
    noStroke();
    text(mode, 398, 330)
  }
  else{
    fill(42, 181, 51);
    noStroke();
    rect(400, 310, 160, 50, 10);
  
    noFill()
    stroke(0)
    strokeWeight(3);
    rect(400, 310, 170, 60, 10);
  
    textSize(24);
    fill(255);
    strokeWeight(1)
    stroke(255)
    text("PLAY", 398, 315)
  
    textSize(10);
    noStroke();
    text(mode, 398, 330)
  }

  if(mouseX > 315 && mouseX < 485 && mouseY > 370 && mouseY < 430){
    fill(210);
    noStroke();
    rect(400, 400, 160, 50, 10);

    textSize(21);
    fill(0);
    strokeWeight(1)
    stroke(0)
    text("MODE", 398, 405);
  }
  else{
    fill(150);
    noStroke();
    rect(400, 400, 160, 50, 10);

    noFill()
    stroke(0)
    strokeWeight(3);
    rect(400, 400, 170, 60, 10);

    textSize(20);
    fill(255);
    strokeWeight(1)
    stroke(255)
    text("MODE", 398, 405);
  }

  if(mouseX > 315 && mouseX < 485 && mouseY > 460 && mouseY < 520){
    fill(210);
    noStroke();
    rect(400, 490, 160, 50, 10);

    textSize(21);
    fill(0);
    strokeWeight(1)
    stroke(0)
    text("TUTORIAL", 398, 495);
  }
  else{
    fill(150);
    noStroke();
    rect(400, 490, 160, 50, 10);
  
    noFill()
    stroke(0)
    strokeWeight(3);
    rect(400, 490, 170, 60, 10);
  
    textSize(20);
    fill(255);
    strokeWeight(1)
    stroke(255)
    text("TUTORIAL", 398, 495);
  }
}

function gameScene(){
  if(!isMusicPlaying){
    Music.loop();
    isMusicPlaying = true;
  }
  
  textAlign(CENTER)
  //Generate new piece after previous piece is placed
  if (isPiecePlaced) {
    checkCompletedLines();
    if(lines >= (level+1)*10){
      level++;
    }

    if(mode == "SHIFTING"){
      shiftPieces();
    }
    isPiecePlaced = false;
    pieceRot = 0
    prevpieceRot = 0
    piece = new PIECE(nextPieces[0]);
    nextPieces.splice(0,1);
    type = random(pieceOptions)
    while(type == prevType){
      type = random(pieceOptions)
    }
    nextPieces.push(type);
    prevType = type;
    canHold = true;
    populateGrid(piece);

  }

  background(235)

  grid();
  drawNext();
  drawScoreboard();
  drawHold();
  drawPause();
  
  //Automatic Piece Drop
  TimeElapsed++

  if (TimeElapsed > moveRate - 5*level) {
    if (!checkDCollision(piece)) {
      piece.autoMove();
      populateGrid(piece);
      TimeElapsed = 0;
    }
  }

  //Player control horizontal movement
  if (playerSlide == 1 && !checkRCollision(piece) && canShift) { //moving to the right
    h++
    if (h > 4) {
      piece.HorizontalMove(playerSlide)
      populateGrid(piece);
      h = 0
    }
  }

  else if (playerSlide == -1 && !checkLCollision(piece) && canShift) { //moving to the left
    h++
    if (h > 4) {
      piece.HorizontalMove(playerSlide)
      populateGrid(piece);
      h = 0
    }
  }

  //Player control vertical drop movement
  if (playerDrop != 0 && !checkDCollision(piece)) {
    isAtBottom = false;
    v++
    if (v > 5) {
      piece.DownMove(playerDrop)
      populateGrid(piece);
      v = 0
    }
  }

  //Player control for rotating the pieces
  if(prevpieceRot != pieceRot && !checkRotate(piece)){
    piece.Rotate(pieceRot);
    populateGrid(piece);
    prevpieceRot = pieceRot
  }

  else if(prevpieceRot != pieceRot && checkRotate(piece)){
    numMoved = 0;

    for(let i = 0; i < 2; i++){
      if(!checkRCollision(piece)){
        piece.HorizontalMove(1)
        numMoved++;
        if(!checkRotate(piece)){
          piece.Rotate(pieceRot);
          populateGrid(piece);
          prevpieceRot = pieceRot;
          break;
        }
      }
    }
    if(prevpieceRot != pieceRot){
      piece.HorizontalMove(numMoved*-1);
      numMoved = 0;

      for(let i = 0; i < 2; i++){
        if(!checkLCollision(piece)){
          piece.HorizontalMove(-1)
          numMoved++;
          if(!checkRotate(piece)){
            piece.Rotate(pieceRot);
            populateGrid(piece);
            prevpieceRot = pieceRot;
            break;
          }
        }
      }
      if(prevpieceRot != pieceRot){
        piece.HorizontalMove(numMoved);
      }
    }

    if(prevpieceRot != pieceRot && !checkUCollision(piece)){
      piece.DownMove(-1);
      numMoved = 0;

      for(let i = 0; i < 2; i++){
        if(!checkRCollision(piece)){
          piece.HorizontalMove(1)
          numMoved++;
          if(!checkRotate(piece)){
            piece.Rotate(pieceRot);
            populateGrid(piece);
            prevpieceRot = pieceRot;
            break;
          }
        }
      }
      if(prevpieceRot != pieceRot){
        piece.HorizontalMove(numMoved*-1);
        numMoved = 0;

        for(let i = 0; i < 2; i++){
          if(!checkLCollision(piece)){
            piece.HorizontalMove(-1)
            numMoved++;
            if(!checkRotate(piece)){
              piece.Rotate(pieceRot);
              populateGrid(piece);
              prevpieceRot = pieceRot;
              break;
            }
          }
        }
        if(prevpieceRot != pieceRot){
          piece.HorizontalMove(numMoved);
        }
      }

      if(prevpieceRot != pieceRot){
        piece.DownMove(1);
      }
    }

    if(prevpieceRot != pieceRot){
      if(pieceRot > 0){
        pieceRot-=1;
      }
      else{
        pieceRot=3
      }
    }
  }
  //Delay before current piece places
  if (checkDCollision(piece)) {
    resetToNextPiece();
  }

  if(isPiecePlaced){
    if(piece.piece1y == 0 || piece.piece2y == 0 || piece.piece3y == 0 || piece.piece4y == 0){
      if(score > highscore){
        highscore = score;
      }
      loseSound.play();
      scene = "end";
      return;
    }
  }
}

function pauseScene(){
  Music.pause();
  isMusicPlaying = false;
  textAlign(CENTER)
  background(235, 235, 235, 1)

  fill(100);
  stroke(0);
  strokeWeight(2);
  rect(400, 335, 300, 250, 15); 
  
  if(mouseX > 315 && mouseX < 485 && mouseY > 250 && mouseY < 310){
    fill(210);
    noStroke();
    rect(400, 290, 160, 50, 10);

    textSize(21);
    fill(0);
    strokeWeight(1)
    stroke(0)
    text("MAIN MENU", 398, 295);
  }
  else{
    fill(150);
    noStroke();
    rect(400, 290, 160, 50, 10);

    noFill()
    stroke(0)
    strokeWeight(3);
    rect(400, 290, 170, 60, 10);

    textSize(20);
    fill(255);
    strokeWeight(1)
    stroke(255)
    text("MAIN MENU", 398, 295);
  }

  if(mouseX > 315 && mouseX < 485 && mouseY > 360 && mouseY < 420){
    fill(210);
    noStroke();
    rect(400, 390, 160, 50, 10);

    textSize(21);
    fill(0);
    strokeWeight(1)
    stroke(0)
    text("RESUME", 398, 395);
  }
  else{
    fill(150);
    noStroke();
    rect(400, 390, 160, 50, 10);

    noFill()
    stroke(0)
    strokeWeight(3);
    rect(400, 390, 170, 60, 10);

    textSize(20);
    fill(255);
    strokeWeight(1)
    stroke(255)
    text("RESUME", 398, 395);
  }
}

function tutorialScene(){
  Music.pause();
  isMusicPlaying = false;
  background(235)

  textSize(22)
  strokeWeight(1)
  textAlign(LEFT);
  fill(0);
  
  stroke(204, 12, 12)
  text("UP ARROW" , 200, 100)
  stroke(242, 140, 31)
  text("LEFT ARROW", 200, 160)
  stroke(212, 205, 4)
  text("RIGHT ARROW", 200, 220)
  stroke(12, 204, 89)
  text("DOWN ARROW", 200, 280)
  stroke(31, 66, 242)
  text("SPACE BAR", 200, 340)
  stroke(175, 31, 242)
  text("C", 200, 400)

  stroke(0)
  text("-  Rotate Piece" , 400, 100)
  text("-  Shift Piece Left", 400, 160)
  text("-  Shift Piece Right", 400, 220)
  text("-  Soft Drop Piece", 400, 280)
  text("-  Hard Drop Piece", 400, 340)
  text("-  Hold Piece", 400, 400)

  textAlign(CENTER)
  if(mouseX > 315 && mouseX < 485 && mouseY > 460 && mouseY < 520){
    fill(210);
    noStroke();
    rect(400, 490, 160, 50, 10);

    textSize(21);
    fill(0);
    strokeWeight(1)
    stroke(0)
    text("RETURN", 398, 495);
  }
  else{
    fill(150);
    noStroke();
    rect(400, 490, 160, 50, 10);

    noFill()
    stroke(0)
    strokeWeight(3);
    rect(400, 490, 170, 60, 10);

    textSize(20);
    fill(255);
    strokeWeight(1)
    stroke(255)
    text("RETURN", 398, 495);
  }
}

function endScene(){
  Music.pause();
  isMusicPlaying = false;
  textAlign(CENTER)
  background(235, 235, 235, 1)

  fill(100);
  stroke(0);
  strokeWeight(2);
  rect(400, 330, 300, 450, 15); 

  
  if(mouseX > 315 && mouseX < 485 && mouseY > 460 && mouseY < 520){
    fill(210);
    noStroke();
    rect(400, 490, 160, 50, 10);

    textSize(21);
    fill(0);
    strokeWeight(1)
    stroke(0)
    text("RETURN", 398, 495);
  }
  else{
    fill(150);
    noStroke();
    rect(400, 490, 160, 50, 10);

    noFill()
    stroke(0)
    strokeWeight(3);
    rect(400, 490, 170, 60, 10);

    textSize(20);
    fill(255);
    strokeWeight(1)
    stroke(255)
    text("RETURN", 398, 495);
  }
  
  textSize(40);
  fill(255);
  stroke(255);
  strokeWeight(2);
  text("GAME OVER", 400, 200);

  textSize(30);
  stroke(1);
  text("Score: " + score, 400, 330);
  text("Highscore: " + highscore, 400, 390)  
}

function grid() { //printing out the entire grid

  gridSpace[piece.piece1x][piece.piece1y] = "";
  gridSpace[piece.piece2x][piece.piece2y] = "";
  gridSpace[piece.piece3x][piece.piece3y] = "";
  gridSpace[piece.piece4x][piece.piece4y] = "";
  
  let y1 = piece.piece1y;
  let y2 = piece.piece2y;
  let y3 = piece.piece3y;
  let y4 = piece.piece4y;

  while(gridSpace[piece.piece1x][y1+1] == "" && gridSpace[piece.piece2x][y2+1] == "" && gridSpace[piece.piece3x][y3+1] == "" && gridSpace[piece.piece4x][y4+1] == ""){
    y1++;
    y2++;
    y3++;
    y4++;
  }
  populateGrid(piece);
 
  //Draw Grid
  fill(150);
  noStroke();
  strokeWeight(2);
  rect(397, 306, 300, 578, 30)

  fill(50);
  stroke(0);
  strokeWeight(2);
  rect(397, 306, 272, 550, 5)

  noStroke();
  
  for (let x = 0; x < 10; x++) {
    for (let y = 1; y < 21; y++) {
      if (gridSpace[x][y] == "") {
        if(x == piece.piece1x && y == y1){
          strokeWeight(2);
          if(piece.name == "I"){
            stroke(31, 214, 242)
          }
          else if(piece.name == "J"){
            stroke(31, 66, 242)
          }
          else if(piece.name == "L"){
            stroke(242, 140, 31)
          }
          else if(piece.name == "O"){
            stroke(212, 205, 4)
          }
          else if(piece.name == "S"){
            stroke(12, 204, 89)
          }
          else if(piece.name == "T"){
            stroke(175, 31, 242)
          }
          else if(piece.name == "Z"){
            stroke(204, 12, 12)
          }
        }   
        else if(x == piece.piece2x && y == y2){
          strokeWeight(2);
          if(piece.name == "I"){
            stroke(31, 214, 242)
          }
          else if(piece.name == "J"){
            stroke(31, 66, 242)
          }
          else if(piece.name == "L"){
            stroke(242, 140, 31)
          }
          else if(piece.name == "O"){
            stroke(212, 205, 4)
          }
          else if(piece.name == "S"){
            stroke(12, 204, 89)
          }
          else if(piece.name == "T"){
            stroke(175, 31, 242)
          }
          else if(piece.name == "Z"){
            stroke(204, 12, 12)
          }
        }   
        else if(x == piece.piece3x && y == y3){
          strokeWeight(2);
          if(piece.name == "I"){
            stroke(31, 214, 242)
          }
          else if(piece.name == "J"){
            stroke(31, 66, 242)
          }
          else if(piece.name == "L"){
            stroke(242, 140, 31)
          }
          else if(piece.name == "O"){
            stroke(212, 205, 4)
          }
          else if(piece.name == "S"){
            stroke(12, 204, 89)
          }
          else if(piece.name == "T"){
            stroke(175, 31, 242)
          }
          else if(piece.name == "Z"){
            stroke(204, 12, 12)
          }
        }   
        else if(x == piece.piece4x && y == y4){
          strokeWeight(2);
          if(piece.name == "I"){
            stroke(31, 214, 242)
          }
          else if(piece.name == "J"){
            stroke(31, 66, 242)
          }
          else if(piece.name == "L"){
            stroke(242, 140, 31)
          }
          else if(piece.name == "O"){
            stroke(212, 205, 4)
          }
          else if(piece.name == "S"){
            stroke(12, 204, 89)
          }
          else if(piece.name == "T"){
            stroke(175, 31, 242)
          }
          else if(piece.name == "Z"){
            stroke(204, 12, 12)
          }
        }   
        fill(0)
      }
      else if (gridSpace[x][y] == "I") {
        fill(31, 214, 242)
      }
      else if (gridSpace[x][y] == "J") {
        fill(31, 66, 242)
      }
      else if (gridSpace[x][y] == "L") {
        fill(242, 140, 31)
      }
      else if (gridSpace[x][y] == "O") {
        fill(212, 205, 4)
      }
      else if (gridSpace[x][y] == "S") {
        fill(12, 204, 89)
      }
      else if (gridSpace[x][y] == "T") {
        fill(175, 31, 242)
      }
      else if (gridSpace[x][y] == "Z") {
        fill(204, 12, 12)
      }
      rect(x * 26 + 280, (y - 1) * 27 + 50, 25, 25, 2);
      noStroke();
    }
  }
}

function drawNext(){

  //Box Around NEXT PIECES
  fill(150);
  noStroke();
  strokeWeight(2);
  rect(650, 210, 170, 295, 30);

  fill(100);
  stroke(0);
  strokeWeight(2);
  rect(650, 210, 140, 270, 5);  

  fill(50);
  noStroke();
  strokeWeight(2);
  rect(650, 230, 120, 215, 5);  

  textSize(18);
  fill(255);
  stroke(255);
  strokeWeight(0.5);
  text("NEXT", 650, 110)

  noStroke();

  for(let i = 0; i < 3; i++){
    if(nextPieces[i] == "I"){
      fill(31, 214, 242)

      rect(611, i*70 + 165, 25, 25, 2);
      rect(637, i*70 + 165, 25, 25, 2);
      rect(663, i*70 + 165, 25, 25, 2);
      rect(689, i*70 + 165, 25, 25, 2);
    }
    if(nextPieces[i] == "J"){
      fill(31, 66, 242)

      rect(623, i*70 + 150, 25, 25, 2);
      rect(623, i*70 + 176, 25, 25, 2);
      rect(649, i*70 + 176, 25, 25, 2);
      rect(675, i*70 + 176, 25, 25, 2);
    }
    if(nextPieces[i] == "L"){
      fill(242, 140, 31)

      rect(675, i*70 + 150, 25, 25, 2);
      rect(623, i*70 + 176, 25, 25, 2);
      rect(649, i*70 + 176, 25, 25, 2);
      rect(675, i*70 + 176, 25, 25, 2);
    }
    if(nextPieces[i] == "O"){
      fill(212, 205, 4)

      rect(637, i*70 + 150, 25, 25, 2);
      rect(663, i*70 + 150, 25, 25, 2);
      rect(637, i*70 + 176, 25, 25, 2);
      rect(663, i*70 + 176, 25, 25, 2);
    }
    if(nextPieces[i] == "S"){
      fill(12, 204, 89)

      rect(675, i*70 + 150, 25, 25, 2);
      rect(649, i*70 + 150, 25, 25, 2);
      rect(649, i*70 + 176, 25, 25, 2);
      rect(623, i*70 + 176, 25, 25, 2);

    }
    if(nextPieces[i] == "T"){
      fill(175, 31, 242)
      rect(649, i*70 + 150, 25, 25, 2);
      rect(623, i*70 + 176, 25, 25, 2);
      rect(649, i*70 + 176, 25, 25, 2);
      rect(675, i*70 + 176, 25, 25, 2);
    }
    if(nextPieces[i] == "Z"){
      fill(204, 12, 12)

      rect(623, i*70 + 150, 25, 25, 2);
      rect(649, i*70 + 150, 25, 25, 2);
      rect(649, i*70 + 176, 25, 25, 2);
      rect(675, i*70 + 176, 25, 25, 2);
    }
  }
}

function drawScoreboard(){
  //Box for SCORE
  fill(150);
  noStroke();
  strokeWeight(2);
  rect(145, 440, 170, 250, 30);

  fill(100);
  stroke(0);
  strokeWeight(2);
  rect(145, 440, 140, 220, 5);  

  fill(50);
  noStroke();
  rect(145, 380, 120, 34, 5);  
  rect(145, 450, 120, 34, 5);  
  rect(145, 520, 120, 34, 5);  

  fill(255);
  stroke(255);
  strokeWeight(0.5);
  text("SCORE", 145, 355)
  text("LEVEL", 145, 425)
  text("LINES", 145, 495)

  noStroke()
  text(score, 145, 385)
  text(level, 145, 455)
  text(lines, 145, 525)
  
}

function drawHold(){
  
  //Box for SCORE
  fill(150);
  noStroke();
  strokeWeight(2);
  rect(145, 150, 170, 170, 30);

  fill(100);
  stroke(0);
  strokeWeight(2);
  rect(145, 150, 140, 140, 5);  

  fill(50);
  noStroke();
  rect(145, 170, 120, 80, 5);  

  textSize(18);
  fill(255);
  stroke(255);
  strokeWeight(0.5);
  text("HOLD", 145, 110)

  noStroke();

  if(holdPiece == "I"){
    fill(31, 214, 242)

    rect(106, 170, 25, 25, 2);
    rect(132, 170, 25, 25, 2);
    rect(158, 170, 25, 25, 2);
    rect(184, 170, 25, 25, 2);
  }
  if(holdPiece == "J"){
    fill(31, 66, 242)

    rect(119, 156, 25, 25, 2);
    rect(119, 182, 25, 25, 2);
    rect(145, 182, 25, 25, 2);
    rect(171, 182, 25, 25, 2);
  }
  if(holdPiece == "L"){
    fill(242, 140, 31)

    rect(171, 156, 25, 25, 2);
    rect(119, 182, 25, 25, 2);
    rect(145, 182, 25, 25, 2);
    rect(171, 182, 25, 25, 2);
  }
  if(holdPiece == "O"){
    fill(212, 205, 4)

    rect(132, 156, 25, 25, 2);
    rect(158, 156, 25, 25, 2);
    rect(132, 182, 25, 25, 2);
    rect(158, 182, 25, 25, 2);
  }
  if(holdPiece == "S"){
    fill(12, 204, 89)

    rect(171, 156, 25, 25, 2);
    rect(145, 156, 25, 25, 2);
    rect(145, 182, 25, 25, 2);
    rect(119, 182, 25, 25, 2);

  }
  if(holdPiece == "T"){
    fill(175, 31, 242)
    rect(145, 156, 25, 25, 2);
    rect(119, 182, 25, 25, 2);
    rect(145, 182, 25, 25, 2);
    rect(171, 182, 25, 25, 2);
  }
  if(holdPiece == "Z"){
    fill(204, 12, 12)

    rect(119, 156, 25, 25, 2);
    rect(145, 156, 25, 25, 2);
    rect(145, 182, 25, 25, 2);
    rect(171, 182, 25, 25, 2);
  }
}

function drawPause(){

  if(mouseX > 700 && mouseX < 760 && mouseY > 520 && mouseY < 580){
    fill(180);
    noStroke();
    rect(730, 550, 50, 50, 10);

    fill(0);
    noStroke();
    rect(722, 550, 8, 30, 2);
    rect(738, 550, 8, 30, 2);
  }
  else{
    fill(150);
    noStroke();
    rect(730, 550, 50, 50, 10);
  
    fill(255);
    noStroke();
    rect(722, 550, 7, 30, 2);
    rect(738, 550, 7, 30, 2);
    
    noFill()
    stroke(0)
    strokeWeight(3);
    rect(730, 550, 60, 60, 10);
  }
}

function shiftPieces(){
  gridSpace.unshift(gridSpace[9]);
  gridSpace.pop();
}

function resetToNextPiece() {
  if (!isAtBottom) {
    TimeElapsed = 0;
    isAtBottom = true;
  }

  else if (TimeElapsed > 50 && !canShift) {
    placeSound.play();
    TimeElapsed = 0;
    isAtBottom = false;
    isPiecePlaced = true;
    canShift = true;
    pieceRot = 0;
  }

  if (TimeElapsed > 50 && canShift) {
    canShift = false;
    //TimeElapsed = 0
  }
}

function populateGrid(p) { //Function draws the piece at a location on the grid
  gridSpace[p.piece1x][p.piece1y] = p.name;
  gridSpace[p.piece2x][p.piece2y] = p.name;
  gridSpace[p.piece3x][p.piece3y] = p.name;
  gridSpace[p.piece4x][p.piece4y] = p.name;
}

function checkCompletedLines(){
  let completedLines = 0;
  
  for(let y = 1; y < 21; y++){
    let numPieces = 0;
    
    for(let x = 0; x < 10; x++){
      if(gridSpace[x][y] != ""){
        numPieces++;
      }
    }
    if(numPieces == 10){
      completedLines++;
      
      for(let i = 0; i < 10; i++){
        gridSpace[i].splice(y, 1)
        gridSpace[i].splice(0, 0, "")
      }
    }
  }

  if(completedLines == 1){
    score+=40 * (level+1);
    lines+=1;
    lineSound.play();
  }
  else if(completedLines == 2){
    score+=100 * (level+1);
    lines+=2;
    lineSound.play();
  }
  else if(completedLines == 3){
    score+=300 * (level+1);
    lines+=3;
    lineSound.play();
  }
  else if(completedLines == 4){
    score+=1200 * (level+1);
    lines+=4;
    tetrisSound.play();
  }
}

function checkDCollision(p) { //checks if a block will hit another block if moving down
  gridSpace[p.piece1x][p.piece1y] = "";
  gridSpace[p.piece2x][p.piece2y] = "";
  gridSpace[p.piece3x][p.piece3y] = "";
  gridSpace[p.piece4x][p.piece4y] = "";

  if (p.piece1y == 20 || p.piece2y == 20 || p.piece3y == 20 || p.piece4y == 20) {
    populateGrid(p);
    return true;
  }

  else if (gridSpace[p.piece1x][p.piece1y + 1] == "" && gridSpace[p.piece2x][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y + 1] == "" && gridSpace[p.piece4x][p.piece4y + 1] == "") {
    populateGrid(p);
    return false;
  }

  else {
    populateGrid(p);
    return true;
  }
}

function checkUCollision(p) {
  gridSpace[p.piece1x][p.piece1y] = "";
  gridSpace[p.piece2x][p.piece2y] = "";
  gridSpace[p.piece3x][p.piece3y] = "";
  gridSpace[p.piece4x][p.piece4y] = "";

  if (p.piece1y == 0 || p.piece2y == 0 || p.piece3y == 0 || p.piece4y == 0) {
    populateGrid(p);
    return true;
  }

  else if (gridSpace[p.piece1x][p.piece1y - 1] == "" && gridSpace[p.piece2x][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y - 1] == "" && gridSpace[p.piece4x][p.piece4y - 1] == "") {
    populateGrid(p);
    return false;
  }

  else {
    populateGrid(p);
    return true;
  }
}

function checkRCollision(p) { //checks if the user will hit another block if it moves left
  gridSpace[p.piece1x][p.piece1y] = "";
  gridSpace[p.piece2x][p.piece2y] = "";
  gridSpace[p.piece3x][p.piece3y] = "";
  gridSpace[p.piece4x][p.piece4y] = "";

  if (p.piece1x == 9 || p.piece2x == 9 || p.piece3x == 9 || p.piece4x == 9) {
    return true;
  }

  else if (gridSpace[p.piece1x + 1][p.piece1y] == "" && gridSpace[p.piece2x + 1][p.piece2y] == "" && gridSpace[p.piece3x + 1][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y] == "") {
    populateGrid(p);
    return false;
  }

  else {
    populateGrid(p);
    return true;
  }
}

function checkLCollision(p) { //checks if the user will hit another block if it moves right
  gridSpace[p.piece1x][p.piece1y] = "";
  gridSpace[p.piece2x][p.piece2y] = "";
  gridSpace[p.piece3x][p.piece3y] = "";
  gridSpace[p.piece4x][p.piece4y] = "";

  if (p.piece1x == 0 || p.piece2x == 0 || p.piece3x == 0 || p.piece4x == 0) {
    return true;
  }

  else if (gridSpace[p.piece1x - 1][p.piece1y] == "" && gridSpace[p.piece2x - 1][p.piece2y] == "" && gridSpace[p.piece3x - 1][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y] == "") {
    populateGrid(p);
    return false;
  }

  else {
    populateGrid(p);
    return true;
  }
}

function checkRotate(p){
  gridSpace[p.piece1x][p.piece1y] = "";
  gridSpace[p.piece2x][p.piece2y] = "";
  gridSpace[p.piece3x][p.piece3y] = "";
  gridSpace[p.piece4x][p.piece4y] = "";

  if(p.name == "I"){
    if(pieceRot == 0){
      if(p.piece1x - 1 >= 0 && p.piece1y - 2 >= 0 && p.piece2y - 1 >= 0 && p.piece3x + 1 <= 9 && p.piece4x + 2 <= 9 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x-1][p.piece1y-2] == "" && gridSpace[p.piece2x][p.piece2y-1] == "" && gridSpace[p.piece3x+1][p.piece3y] == "" && gridSpace[p.piece4x+2][p.piece4y+1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 1){
      if(p.piece1x + 2 <= 9 && p.piece1y - 1 >= 0 && p.piece2x + 1 <= 9 && p.piece3y + 1 <= 20 && p.piece4x - 1 >= 0 && p.piece4y + 2 <= 20){
        if(gridSpace[p.piece1x + 2][p.piece1y - 1] == "" && gridSpace[p.piece2x + 1][p.piece2y] == "" && gridSpace[p.piece3x][p.piece3y + 1] == "" && gridSpace[p.piece4x - 1][p.piece4y + 2] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 2){
      if(p.piece1x + 1 <= 9 && p.piece1y + 2 <= 20 && p.piece2y + 1 <= 20 && p.piece3x - 1 >= 0 && p.piece4x - 2 >= 0 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x + 1][p.piece1y + 2] == "" && gridSpace[p.piece2x][p.piece2y + 1] == "" && gridSpace[p.piece3x - 1][p.piece3y] == "" && gridSpace[p.piece4x - 2][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 3){
      if(p.piece1x - 2 >= 0 && p.piece1y + 1 <= 20 && p.piece2x - 1 >= 0 && p.piece3y - 1 >= 0 && p.piece4x + 1 <= 9 && p.piece4y - 2 >= 0){
        if(gridSpace[p.piece1x - 2][p.piece1y + 1] == "" && gridSpace[p.piece2x - 1][p.piece2y] == "" && gridSpace[p.piece3x][p.piece3y - 1] == "" && gridSpace[p.piece4x + 1][p.piece4y - 2] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
  }
  else if(p.name == "J"){
    if(pieceRot == 0){
      if(p.piece1y - 2 >= 0 && p.piece2x - 1 >= 0 && p.piece2y - 1 >= 0 && p.piece4x + 1 <= 9 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x][p.piece1y - 2] == "" && gridSpace[p.piece2x - 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 1){
      if(p.piece1x + 2 <= 9 && p.piece2x + 1 <= 9 && p.piece2y - 1 >= 0 && p.piece4x - 1 >= 0 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x + 2][p.piece1y] == "" && gridSpace[p.piece2x + 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 2){
      if(p.piece1y + 2 <= 20 && p.piece2x + 1 <= 9 && p.piece2y + 1 <= 20 && p.piece4x - 1 >= 0 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x][p.piece1y + 2] == "" && gridSpace[p.piece2x + 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 3){
      if(p.piece1x - 2 >= 0 && p.piece2x - 1 >= 0 && p.piece2y + 1 <= 20 && p.piece4x + 1 <= 9 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x - 2][p.piece1y] == "" && gridSpace[p.piece2x - 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
  }
  else if(p.name == "L"){
    if(pieceRot == 0){
      if(p.piece1x + 2 <= 9 && p.piece2x + 1 <= 9 && p.piece2y + 1 <= 20 && p.piece4x - 1 >= 0 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x + 2][p.piece1y] == "" && gridSpace[p.piece2x + 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 1){
      if(p.piece1y + 2 <= 20 && p.piece2x - 1 >= 0 && p.piece2y + 1 <= 20 && p.piece4x + 1 <= 9 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x][p.piece1y + 2] == "" && gridSpace[p.piece2x - 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 2){
      if(p.piece1x - 2 >= 0 && p.piece2x - 1 >= 0 && p.piece2y - 1 >= 0 && p.piece4x + 1 <= 9 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x - 2][p.piece1y] == "" && gridSpace[p.piece2x - 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 3){
      if(p.piece1y - 2 >= 0 && p.piece2x + 1 <= 9 && p.piece2y - 1 >= 0 && p.piece4x - 1 >= 0 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x][p.piece1y - 2] == "" && gridSpace[p.piece2x + 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
  }
  else if(p.name == "O"){
    populateGrid(p);
    return false;
  }
  else if(p.name == "S"){
    if(pieceRot == 0){
      if(p.piece1x + 2 <= 9 && p.piece2x + 1 <= 9 && p.piece2y - 1 >= 0 && p.piece4x - 1 >= 0 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x + 2][p.piece1y] == "" && gridSpace[p.piece2x + 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 1){
      if(p.piece1y + 2 <= 20 && p.piece2x + 1 <= 9 && p.piece2y + 1 <= 20 && p.piece4x + 1 <= 9 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x][p.piece1y + 2] == "" && gridSpace[p.piece2x + 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 2){
      if(p.piece1x - 2 >= 0 && p.piece2x - 1 >= 0 && p.piece2y + 1 <= 20 && p.piece4x + 1 <= 9 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x - 2][p.piece1y] == "" && gridSpace[p.piece2x - 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 3){
      if(p.piece1y - 2 >= 0 && p.piece2x - 1 >= 0 && p.piece2y - 1 >= 0 && p.piece4x - 1 >= 0 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x][p.piece1y - 2] == "" && gridSpace[p.piece2x - 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
  }
  else if(p.name == "T"){
    if(pieceRot == 0){
      if(p.piece1x + 1 <= 9 && p.piece1y - 1 >= 0 && p.piece2x - 1 >= 0 && p.piece2y - 1 >= 0 && p.piece4x + 1 <= 9 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x + 1][p.piece1y - 1] == "" && gridSpace[p.piece2x - 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 1){
      if(p.piece1x + 1 <= 9 && p.piece1y + 1 <= 20 && p.piece2x + 1 <= 9 && p.piece2y - 1 >= 0 && p.piece4x - 1 >= 0 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x + 1][p.piece1y + 1] == "" && gridSpace[p.piece2x + 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 2){
      if(p.piece1x - 1 >= 0 && p.piece1y + 1 <= 20 && p.piece2x + 1 <= 9 && p.piece2y + 1 <= 20 && p.piece4x - 1 >= 0 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x - 1][p.piece1y + 1] == "" && gridSpace[p.piece2x + 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 3){
      if(p.piece1x - 1 >= 0 && p.piece1y - 1 >= 0 && p.piece2x - 1 >= 0 && p.piece2y + 1 <= 20 && p.piece4x + 1 <= 9 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x - 1][p.piece1y - 1] == "" && gridSpace[p.piece2x - 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
  }
  else if(p.name == "Z"){
    if(pieceRot == 0){
      if(p.piece1y - 2 >= 0 && p.piece2x + 1 <= 9 && p.piece2y - 1 >= 0 && p.piece4x + 1 <= 9 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x][p.piece1y - 2] == "" && gridSpace[p.piece2x + 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 1){
      if(p.piece1x + 2 <= 9 && p.piece2x + 1 <= 9 && p.piece2y + 1 <= 20 && p.piece4x - 1 >= 0 && p.piece4y + 1 <= 20){
        if(gridSpace[p.piece1x + 2][p.piece1y] == "" && gridSpace[p.piece2x + 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y + 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 2){
      if(p.piece1y + 2 <= 20 && p.piece2x - 1 >= 0 && p.piece2y + 1 <= 20 && p.piece4x - 1 >= 0 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x][p.piece1y + 2] == "" && gridSpace[p.piece2x - 1][p.piece2y + 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x - 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
    else if(pieceRot == 3){
      if(p.piece1x - 2 >= 0 && p.piece2x - 1 >= 0 && p.piece2y - 1 >= 0 && p.piece4x + 1 <= 9 && p.piece4y - 1 >= 0){
        if(gridSpace[p.piece1x - 2][p.piece1y] == "" && gridSpace[p.piece2x - 1][p.piece2y - 1] == "" && gridSpace[p.piece3x][p.piece3y] == "" && gridSpace[p.piece4x + 1][p.piece4y - 1] == ""){
          populateGrid(p);
          return false;
        }
        else{
          populateGrid(p);
          return true;
        }
      }
      else{
        populateGrid(p);
        return true;
      }
    }
  }
}

function keyPressed() { //user input for movement ingame
  if(scene == "game"){
    if (keyCode === LEFT_ARROW) {
      playerSlide = -1;
    }
    else if (keyCode === RIGHT_ARROW) {
      playerSlide = 1;
    }
    else if (keyCode === DOWN_ARROW) {
      playerDrop = 1;
    }
    else if (keyCode === UP_ARROW) {
      if(pieceRot == 3){
        pieceRot = 0;
      }
      else{
        pieceRot++;
      }
    }
    else if(key === " "){
      piece.hardDrop();
      populateGrid(piece);
      placeSound.play();
      isPiecePlaced = true;
      if(piece.piece1y == 0 || piece.piece2y == 0 || piece.piece3y == 0 || piece.piece4y == 0){
        if(score > highscore){
          highscore = score;
        }
        loseSound.play();
        scene = "end";
      }
    }
    else if((key === "c" || key === "C") && canHold){
      gridSpace[piece.piece1x][piece.piece1y] = "";
      gridSpace[piece.piece2x][piece.piece2y] = "";
      gridSpace[piece.piece3x][piece.piece3y] = "";
      gridSpace[piece.piece4x][piece.piece4y] = "";

      if(holdPiece == ""){
        holdPiece = piece.name
        isPiecePlaced = false;
        pieceRot = 0
        prevpieceRot = 0
        piece = new PIECE(nextPieces[0]);
        populateGrid(piece);

        nextPieces.splice(0,1);
        type = random(pieceOptions)
        while(type == prevType){
          type = random(pieceOptions)
        }
        nextPieces.push(type);
        prevType = type;
        canHold = false;
      }
      else{
        let temp = holdPiece;
        holdPiece = piece.name
        TimeElapsed = 0;
        isAtBottom = false;
        canShift = true;
        pieceRot = 0;
        prevpieceRot = 0;
        piece = new PIECE(temp);
        populateGrid(piece);
        canHold = false;
      }
    }
  }
}

function keyReleased() { //user input for movement ingame
  if (keyCode === LEFT_ARROW) {
    playerSlide = 0;
  }
  else if (keyCode === RIGHT_ARROW) {
    playerSlide = 0;
  }
  else if (keyCode === DOWN_ARROW) {
    playerDrop = 0;
  }
}

function mousePressed() {
  if(scene == "menu"){
    if(mouseX > 315 && mouseX < 485 && mouseY > 280 && mouseY < 340){
      gridSpace = []; //grid for playing

      pieceOptions = ["I", "J", "L", "O", "S", "T", "Z"]; //pieces to choose from
      nextPieces = [];
      holdPiece = "";

      TimeElapsed = 0; //time for visual delays
      moveRate = 100; //speed at which this pieces move down automatically

      isPiecePlaced = true; //if a new piece needs to be spawned

      piece;
      prevType;

      playerSlide = 0; //velocity for horizontal movement
      playerDrop = 0; //velocity for downward movement

      h = 0;//temp variable for horizontal moving
      v = 0;//temp variable for vertical moving

      isAtBottom = false; //variable for tracking when a piece is sitting on a spot where it can be placed.

      canShift = true; //if a piece is allowed to move left or right

      pieceRot = 0; //rotation number of the piece
      prevpieceRot = 0; //tracks the last rotation to know when rotation changes
      numMoved = 0; //temp variable to help certain rotation cases

      score = 0; //user score
      lines = 0;
      level = 0;

      canHold = true;

      //Populate 2D grid with empty boxes
      for (let x = 0; x < 10; x++) {
        gridSpace[x] = [];
        for (let y = 0; y < 21; y++) {
          gridSpace[x][y] = "";
        }
      }

      //Populate Next Pieces Array
      for(let i = 0; i < 3; i++){
        type = random(pieceOptions)
        while(type == prevType){
          type = random(pieceOptions)
        }
        nextPieces.push(type);
        prevType = type;
      }
      playSound.play();
      scene = "game"
    }
    else if(mouseX > 315 && mouseX < 485 && mouseY > 370 && mouseY < 430){
      playSound.play();
      if(mode == "CLASSIC"){
        mode = "SHIFTING";
      }
      else{
        mode = "CLASSIC";
      }
    }
    else if(mouseX > 315 && mouseX < 485 && mouseY > 460 && mouseY < 520){
      scene = "tutorial"
      playSound.play();
    }
  }
  else if(scene == "tutorial"){
    if(mouseX > 315 && mouseX < 485 && mouseY > 460 && mouseY < 520){
      scene = "menu"
      returnSound.play();
    }
  }
  else if(scene == "end"){
    if(mouseX > 315 && mouseX < 485 && mouseY > 460 && mouseY < 520){
      scene = "menu"
      returnSound.play();
    }
  }
  else if(scene == "game"){
    if(mouseX > 700 && mouseX < 760 && mouseY > 520 && mouseY < 580){
      scene = "pause"
      playSound.play();
    }
  }
  else if(scene == "pause"){
    if(mouseX > 315 && mouseX < 485 && mouseY > 250 && mouseY < 310){
      scene = "menu"
      returnSound.play();
    }
    else if(mouseX > 315 && mouseX < 485 && mouseY > 360 && mouseY < 420){
      scene = "game"
      returnSound.play();
    }
  }
}