var q = [];
var win = false;
var s;
var nameRecorded = false;
var showGuides = false;
var numSquares = 8;

function setup() {
  if(windowWidth > windowHeight * 1.3) {
    createCanvas(windowWidth, windowHeight);
  } else {
    createCanvas(windowHeight * 1.3, windowHeight);
  }
  var search = int(location.search.substring(1));
  console.log(search);
  if(search > 1 && search < 20) numSquares = search;
  s = height/numSquares;
  noStroke();
}

function draw() {
  background(0);
  for(var i = 0; i < numSquares; i++) {
    for(var j = 0; j < numSquares; j++) {
      if((i+j)%2 == 0) {
        fill(255);
        rect(i * s, j * s, s, s);
      }
    }
  }

  if(showGuides) {
    fill(255, 0, 0);
    var guideDiameter = s/15;
    for(i in q) {
      for(var j = 0; j < numSquares; j++) {
        ellipse(s/2+j*s, s/2+q[i].row*s, guideDiameter);
        ellipse(s/2+q[i].col*s, s/2+j*s, guideDiameter);
        ellipse(s/2+(q[i].col+j)*s, s/2+(q[i].row+j)*s, guideDiameter);
        ellipse(s/2+(q[i].col-j)*s, s/2+(q[i].row+j)*s, guideDiameter);
        ellipse(s/2+(q[i].col+j)*s, s/2+(q[i].row-j)*s, guideDiameter);
        ellipse(s/2+(q[i].col-j)*s, s/2+(q[i].row-j)*s, guideDiameter);
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
    ellipse(s/2 + q[i].col*s, s/2 + q[i].row*s, s/2);
  }

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Try to put down " + numSquares + " queens so that none of them can take any of the others.", height + 10, 50, width-height-20);
  textSize(48);
  text("Remaining: " + (numSquares - q.length), height + 10, height/2, width-height-20);
  textSize(16);
  text("(Press escape to toggle guides)", height + 10, height-150, width-height-20);
  
  check();
}

function keyPressed() {
  if(keyCode == 27) {
   showGuides = !showGuides; 
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
      if(q.length < numSquares) {
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
  if(q.length == numSquares) {
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
      size: numSquares,
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
  s = height/numSquares;
}

function permutate(arr) {
  if(arr.length == 1) return [arr];
  var perms = [];

  for(i in arr) {
    var first = arr[i];
    var temp = arr.slice();
    temp.splice(i, 1);
    temp = permutate(temp);
    for(j in temp) {
      temp[j].unshift(first);
      perms.push(temp[j]);
    }
  }
  return perms;
}
