let tileSize = 16;
let rows = 16;
let columns = 16;
let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * columns;
let context;
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;
let ship = {
  x : shipX,
  y : shipY,
  width : shipWidth,
  height : shipHeight
}
let name = "Anuj";
let shipImg;
let velocityX = tileSize;


// aliens

let alienArrey = [];
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRow = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocity = 1;


// bullet 
let bulletArrey = [];
let bulletVellocityY = -10;


//more 
let scroe = 0;
let gameOver = false;
let lastScore = localStorage.getItem("data");

window.onload = () => {
  board =  document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext('2d');
  
  shipImg = new Image();
  shipImg.src = "./ship.png";
  shipImg.onload = () =>{
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  }
  
  
  alienImg = new Image();
  alienImg.src =  "./alien.png";
  createAliens();
  
  
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shoot);
  
}


function update() {
  if (gameOver) {
    return;
  }
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);
  
  
  
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  
  for (var i = 0; i < alienArrey.length; i++) {
    let alien = alienArrey[i];
    if (alien.alive) {
      
      alien.x += alienVelocity;
      
      
      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocity *= -1;
        alien.x += alienVelocity*2;
        
        for (var j = 0; j < alienArrey.length; j++) {
          alienArrey[j].y += alienHeight;
        }
        
      }
      context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
      
      if (alien.y >= ship.y) {
gameOver = 'true';
      }
    }
  }
  
  for (var i = 0; i < bulletArrey.length; i++) {
   let bullet = bulletArrey[i];
   bullet.y += bulletVellocityY;
   context.fillStyle="white";
   context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
   
   
   
   for (var j = 0; j < alienArrey.length; j++) {
     let alien = alienArrey[j];
     if (!bullet.used && alien.alive && detectCollision(bullet, alien)  ) {
       bullet.used = true;
       alien.alive = false;
       alienCount--;
       scroe += 100;
       save();
     }
   }
  }
  
  while(bulletArrey.length > 0 && (bulletArrey[0].used || bulletArrey[0].y < 0))
  {
    bulletArrey.shift();
  }
  
  if (alienCount == "0") {
    alienColumns = Math.min(alienColumns + 1, columns/2 - 2);
    alienRow =  Math.min(alienRow + 1, rows - 4);
    alienVelocity += 0.2;
    alienArrey = [];
    bulletArrey = [];
    createAliens();
  }
  
  
  context.fillStyle = "white";
  context.font = "16px courier";
  context.fillText(scroe, 5, 20);
  
  
  context.fillStyle = "white";
  context.font = "16px courier";
  context.fillText(lastScore, 5, 35);
  
  
  
  context.fillStyle = "white";
  context.font = "16px courier";
  context.fillText(name, boardWidth/2 -15, boardHeight/2);
  
}


// button movement

function left() {
  if (gameOver) {
    return;
  }
  if (ship.x - velocityX >= 0) {
    ship.x -= velocityX;
  }
  
}
function right() {
  if (gameOver) {
    return;
  }
 if (ship.x + velocityX + ship.width <= board.width) {
    ship.x += velocityX;
  }
}

// for deckstop

function moveShip(e) {
  if (gameOver) {
    return;
  }
if (e.code == 'ArrowLeft' && ship.x - velocityX >= 0) {
  ship.x -= velocityX;
} else if (e.code == 'ArrowRight' && ship.x + velocityX + ship.width <= board.width) {
  ship.x += velocityX;
}
}


function createAliens() {
  if (gameOver) {
    return;
  }
  for (var c = 0; c < alienColumns; c++) {
  for (var r = 0; r < alienRow; r++) {
    let alien = {
      img : alienImg,
      x : alienX + c*alienWidth,
      y : alienY + r*alienHeight,
      width : alienWidth,
      height : alienHeight,
      alive : true
    }
    alienArrey.push(alien);
  }
  }
  alienCount = alienArrey.length;
}


function fire() {
  if (gameOver) {
    return;
  }
  let bullet = {
    x : ship.x + shipWidth*15/32,
    y : ship.y,
    width : tileSize/8,
    height : tileSize/2,
    used : false 
  }
  bulletArrey.push(bullet);
}


function shoot(e) {
  if (gameOver) {
    return;
  }
  if (e.code == "space") {
    let bullet = {
      x: ship.x + shipWidth * 15 / 32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false
    }
    bulletArrey.push(bullet);
  }
  }
  
  function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function save() {
  localStorage.setItem("data", scroe);
}




if (gameOver) {
  window.location.reload();
}