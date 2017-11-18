let isingoal = false;
let circles = [];
let positions = [];
let throwerror = function() {
  alert("Etwas ist schiefgelaufen oder bimst du 1 Hacker am been?");
}

function setup() {
  colorMode(RGB, 255, 255, 255, 1);
  createCanvas(1000, window.innerHeight);
  for(var i = 1; i <  height; i += 26) {
    circles.push(new Circle(i, 0, i));
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
  }
}

function Circle(id, x, y, goal = width) {
  this.id = id;
  this.x = x;
  this.y = y + 11;
  this.gl = goal;
  this.spd = random(0.1, 4);
  this.size = 20;
  this.accp = [];
  this.minacc = 0;
  this.maxacc = 0.2;
  this.maxacclength = width / 6;

  this.clr = function() {
    fill(map(this.y, 0, height, 0, 255), map(this.y, 0, height, 255, 0), map(this.y, 0, height, 255, 0));
  }

  this.update = function() {
    this.x += this.spd;
    for(var i = 0; i < this.accp.length; i++) {
      if(this.x >= this.accp[i].begin && this.x <= this.accp[i].end) {
        this.x += this.accp[i].acc;
      }
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

  this.addAccpoints(round(map(this.spd, 0.1, 4, 1, 6)));

  this.bars = function() {
    if(typeof this.accp[0] != "undefined") {
      for(var j = 0; j < this.accp.length; j++) {
        let a = this.accp[j];
        noStroke();
        fill(color(255, 0, 0, map(a.acc, 0, 0.2, 0, 1)));
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
  }
}

function compareNumbers(a, b) {
    return b.x - a.x;
}

function getPos() {
  let pos = [];
  for(var i = 0; i < circles.length; i++) {
    pos[circles[i].id]
  }
}
