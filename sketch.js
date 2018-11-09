var q = [];
var win = false;
var s;
var nameRecorded = false;
var showGuides = false;

function setup() {
  if(windowWidth > windowHeight * 1.3) {
    createCanvas(windowWidth, windowHeight);
  } else {
    createCanvas(windowHeight * 1.3, windowHeight);
  }
  s = height/8;
  noStroke();
}

function draw() {
  background(0);
  for(var i = 0; i < 8; i++) {
    for(var j = 0; j < 8; j++) {
      if((i+j)%2 == 0) {
        fill(255);
        rect(i * s, j * s, s, s);
      }
    }
  }

  if(showGuides) {
    fill(255, 0, 0);
    var guideDiameter = 8;
    for(i in q) {
      for(var j = 0; j < 8; j++) {
        ellipse(50+j*s, 50+q[i].row*s, guideDiameter);
        ellipse(50+q[i].col*s, 50+j*s, guideDiameter);
        ellipse(50+(q[i].col+j)*s, 50+(q[i].row+j)*s, guideDiameter);
        ellipse(50+(q[i].col-j)*s, 50+(q[i].row+j)*s, guideDiameter);
        ellipse(50+(q[i].col+j)*s, 50+(q[i].row-j)*s, guideDiameter);
        ellipse(50+(q[i].col-j)*s, 50+(q[i].row-j)*s, guideDiameter);
      }
    }
  }

  fill(240);
  rect(height, 0, width-height, height);

  fill(255);
  for(i in q) {
    if(!q[i].bad) {
      if((q[i].row + q[i].col)%2 == 1)
        fill(255);
      else
        fill(0);
    } else {
      fill(255, 0, 0);
    }
    ellipse(50 + q[i].col*s, 50 + q[i].row*s, 50, 50);
  }

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Try to put down eight queens so that none of them can take any of the others.", height + 10, 50, width-height-20);
  textSize(48);
  text("Remaining: " + (8 - q.length), height + 10, height/2, width-height-20);
  textSize(16);
  text("(Press escape to toggle guides)", height + 10, height-150, width-height-20);
  
  check();
}

function keyPressed() {
  if(keyCode == 27) {
   showGuides = !showGuides;; 
  }
}

function mousePressed() {
  if(mouseX <= height && !nameRecorded) {
    var col = floor(mouseX/s);
    var row = floor(mouseY/s);
    click = {
      row: row,
      col: col
    };
    var index = -1;
    for(i in q) {
      if(q[i].row == click.row && q[i].col == click.col) {
        // console.log("remove");
        index = i;
      }
    }
    if(index == -1) {
      if(q.length < 8) {
        q.push(click);
      }
    } else {
      q.splice(index, 1);
    }
  }
}

function check() {
  for(i in q) {
    q[i].bad = false;
  }
  if(q.length == 8) {
    win = true;
  }
  for(i in q) {
    for(var j = int(i)+1; j < q.length; j++) {
      // console.log(i, j);
      if(q[i].row == q[j].row || q[i].col == q[j].col || abs((q[i].row-q[j].row)/(q[i].col-q[j].col)) == 1) {
        q[i].bad = true;
        q[j].bad = true;
        win = false;
      }
    }
  }

  if(win && !nameRecorded) {
    var name = prompt("You win! Enter your name:");
    var config = {
      apiKey: "AIzaSyAj1T7nQhY028tbH9aUqafx9z_XR2bdOS0",
      authDomain: "queens-3c7bd.firebaseapp.com",
      databaseURL: "https://queens-3c7bd.firebaseio.com",
      projectId: "queens-3c7bd",
      storageBucket: "queens-3c7bd.appspot.com",
      messagingSenderId: "198932447009"
    };
    firebase.initializeApp(config);
    var game = {
      name: name,
      queens: q,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    firebase.database().ref('wins/').push(game);
    nameRecorded = true;
  }
}

function windowResized() {
  if(windowWidth > windowHeight * 1.3) {
    resizeCanvas(windowWidth, windowHeight);
  } else {
    resizeCanvas(windowHeight * 1.3, windowHeight);
  }
  s = height/8;
}
