let isingoal = false;
let circles = [];
let events = [];
let positions = [];
let throwerror = function() {
  alert("Etwas ist schiefgelaufen oder bimst du 1 Hacker am been?");
}

function setup() {
  colorMode(RGB, 255, 255, 255, 1);
  createCanvas(1000, window.innerHeight);
  let x = 0;
  for(var i = 1; i <  height; i += 26) {
    circles.push(new Circle(x, 0, i));
    x++;
  }
}

function draw() {
  if(!isingoal) {
    background(255);
    for(var i = 0; i < circles.length; i++) {
      circles[i].bars();
      circles[i].update();
      circles[i].show();
      !isingoal ? isingoal = circles[i].goal() : console.log("Somebody is already in Finish");
    }
    circles.sort(compareNumbers);
    for(var i = 0; i < circles.length; i++) {
      circles[i].placement(i);
    }
    getPos();
    addEvents();
    //writeEvents();
    writePos();
  }
}

function Circle(id, x, y, goal = width) {
  this.id = id;
  this.x = x;
  this.y = y + 11;
  this.gl = goal;
  this.minspd = 1;
  this.maxspd = 2;
  this.spd = random(this.minspd, this.maxspd);
  this.size = 20;
  this.accp = [];
  this.minacc = 0.1;
  this.maxacc = 1;
  this.minaccp = 1;
  this.maxaccp = 10;
  this.maxacclength = width / (this.maxaccp / 2);
  this.currentacc = 0;
  this.insideboost = false;
  this.slowp = [];
  this.minslow = 0.1;
  this.maxslow = 1;
  this.minslowp = 1;
  this.maxslowp = 2;
  this.maxslowlength = width / (this.maxslowp / 2);
  this.currentslow = 0;
  this.insideslow = false;

  this.clr = function() {
    fill(map(this.y, 0, height, 0, 255), map(this.y, 0, height, 255, 0), map(this.y, 0, height, 255, 0));
  }

  this.update = function() {
    this.x += this.spd;
    this.insideboost = false;
    for(var i = 0; i < this.accp.length; i++) {
      if(this.x >= this.accp[i].begin && this.x <= this.accp[i].end) {
        this.insideboost = true;
        this.currentacc = this.accp[i].acc;
        break;
      }
    }
    for(var i = 0; i < this.slowp.length; i++) {
      if(this.x >= this.slowp[i].begin && this.x <= this.slowp[i].end) {
        this.insideslow = true;
        this.currentslow = this.slowp[i].slow;
        break;
      }
    }

    if(this.currentacc != 0 && this.insideboost) {
      this.x += this.currentacc;
    } else {
      this.currentacc = 0;
    }
    if(this.currentslow != 0 && this.insideslow) {
      this.x -= this.currentslow
    } else {
      this.currentslow = 0;
    }
  }

  this.show = function() {
    this.clr();
    ellipse(this.x, this.y, this.size, this.size);
  }

  this.goal = function() {
    return (this.x > this.gl);
  }

  this.addAccpoints = function(times) {
    let i = 0;
    while(i < times) {
      let begin;
      if(typeof this.accp[this.accp.length - 1] != "undefined") {
        begin = random(this.accp[this.accp.length - 1].end, width);
      } else {
        begin = 0;
      }
      let end = random(begin, begin + this.maxacclength);
      this.accp[this.accp.length] = {
        begin: begin,
        end: end,
        acc: random(this.minacc, this.maxacc)
      }
      i++;
    }
  }

  this.addAccpoints(round(map(this.spd, this.minspd, this.maxspd, this.minaccp, this.maxaccp)));

  this.addslowpoints = function(times) {
    let i = 0;
    while(i < times) {
      let begin;
      if(typeof this.slowp[this.slowp.length - 1] != "undefined") {
        begin = random(this.slowp[this.slowp.length - 1].end, width);
      } else {
        begin = 0;
      }
      let end = random(begin, begin + this.maxslowlength);
      this.slowp[this.slowp.length] = {
        begin: begin,
        end: end,
        slow: random(this.minslow, this.maxslow)
      }
      i++;
    }
  }

  this.addslowpoints(round(map(this.spd, this.minspd, this.maxspd, this.minslowp, this.maxslowp)));

  this.bars = function() {
    if(typeof this.accp[0] != "undefined") {
      for(var j = 0; j < this.accp.length; j++) {
        let a = this.accp[j];
        noStroke();
        fill(color(255, 0, 0, map(a.acc, this.minacc, this.maxacc, 0, 1)));
        rect(a.begin, this.y - 13, a.end - a.begin, 26);
        stroke(0);
      }
    } else {
      throwerror;
    }
    if(typeof this.slowp[0] != "undefined") {
      for(var j = 0; j < this.slowp.length; j++) {
        let a = this.slowp[j];
        noStroke();
        fill(color(0, 255, 0, map(a.slow, this.minslow, this.maxslow, 0, 1)));
        rect(a.begin, this.y - 13, a.end - a.begin, 26);
        stroke(0);
      }
    } else {
      throwerror;
    }
  }

  this.placement = function(i) {
    fill(0);
    textAlign(CENTER,CENTER);
    textSize(14);
    text(i + 1, this.x, this.y);
    text(this.id, this.size / 2, this.y);
    line(0, this.y + 13, width, this.y + 13);
  }
}

function compareNumbers(a, b) {
    return b.x - a.x;
}

function getPos() {
  let pos = [];
  for(var i = 0; i < circles.length; i++) {
    pos[circles[i].id] = i + 1;
  }
  positions.push(pos);
}

function addEvents() {
  if(positions.length > 1) {
    for(var i = 0; i < positions[positions.length - 1].length; i++) {
      let oldP = positions[positions.length - 2][i];
      let newP = positions[positions.length - 1][i];
      if(oldP == newP) {
        continue;
      } else if(oldP > newP) {
        if(oldP - newP == 1) {
          events.push("The ellipse with the id (" + i + ") has lost a place.");
        } else {
          events.push("The ellipse with the id (" + i + ") has lost " + (oldP - newP) + " places.");
        }
      } else if(oldP < newP) {
        if(newP - oldP == 1) {
          events.push("The ellipse with the id (" + i + ") has won a place.");
        } else {
          events.push("The ellipse with the id (" + i + ") has won " + (newP - oldP) + " places.");
        }
      }
      removeEvents(10);
    }
  }
}

function removeEvents(max) {
  if(events.length > max) {
    events.splice(0, 1);
  }
}

function writeEvents() {
  let html = "";
  for(var i = 0; i < events.length; i++) {
    html += events[i] + "<br />";
  }
  document.getElementById("events").innerHTML = html;
}

function writePos() {
  let html = "<table><tr><th>place</th><th>id</th><th>current speed</th></tr>";
  for(var i = 0; i < circles.length; i++) {
    html += "<tr><th>" + (i + 1) + ".</th><th>" + circles[i].id + "</th><th>" + Math.round((circles[i].spd + circles[i].currentacc) * 100) / 100 + "</th></tr>";
  }
  html += "</table>";
  document.getElementById("table").innerHTML = html;
}
