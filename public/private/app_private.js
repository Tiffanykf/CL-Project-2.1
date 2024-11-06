console.log("now listening at private!");

//Initialize and connect socket
let socket = io('/private');

//Listen for confirmation of connection
socket.on('connect', () => {
  console.log("Connected");
});

 //Listen for an event named 'message-share' from the server
//  socket.on('message-share', (data) => {
//   drawEllipse(data);
// });

//global variables
// let myRed, myGreen, myBlue;
let myDiameter = 10;
let duke2 = document.querySelector('#audio')
let drop = document.querySelector('#audio2')
let pauseTimeout;
let timer = 0;
let code;
let passwords = [
  "a3d7k", "p2x8j", "l9m5n", "z8r4y", "q1w6p",
  "t7b3v", "u9k2d", "m5p4j", "x3c7b", "e2r9q",
  "y8f5w", "d6l2z", "n1p7k", "v3h9y", "s5j2d",
  "k7u8p", "a9m6n", "t4r2b", "y3x7q", "l1z5v",
  "p8f4n", "q9j3w", "r2k7y", "d5h1z", "s4n8v",
  "u3m9b", "k6x2q", "j8r4d", "l2t5n", "m7y1p"
];

let circles = [];

function setup(){
    createCanvas(windowWidth, windowHeight);
    noStroke();
    randomSeed(99);

        // //Generate random fill values
        // myRed = random(150,255);
        // myGreen = random(100,230)
        // myBlue = random(170,255);
    
        // //Generate random ellipse size
        // myDiameter = 10;

        mazePath();
}

function draw(){
  background(220);
  drawCircles();
  touchCircles();

      // Listen for positive events
      socket.on('positiveEvent', ({ user1, user2 }) => {
        console.log(`Positive event detected between users ${user1} and ${user2}`);
        // Play the audio if it's not already playing
        if (duke2.paused) {
        duke2.play();
        }

         // Clear any existing timeout to prevent premature pausing
        clearTimeout(pauseTimeout);

        // Set a timeout to pause the audio after 3 seconds if no new event is received
        pauseTimeout = setTimeout(() => {
        duke2.pause();
        }, 500); // 500 milliseconds = .5 second
      });

        //Listen for midpoint data
        socket.on('midpoint', function(midpoint) {
          // console.log(midpoint);
          drawPos(midpoint);
        });
}

function mouseMoved() {
  //Grab mouse position

let mouseData = {
    x: mouseX,
    y: mouseY
  }

  //Send mouse data object to the server
  socket.emit('message', mouseData);
}

//Expects an object with x and y properties
function drawPos(pos) {
  fill(255, 255, 0);
  noStroke();
  circle(pos.x, pos.y, 50);
}

// function drawEllipse(obj) {
//   fill(255,255,0);
//   // noStroke();
//   ellipse(obj.x, obj.y, obj.d, obj.d);
// }

function touchCircles() {
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];

    // Skip any circles with undefined properties
    if (circle.x === undefined || circle.y === undefined || circle.rad === undefined) {
      console.log(`Skipping circle ${i} due to missing properties.`);
      continue;
    }

    let d = dist(mouseX, mouseY, circle.x, circle.y);
    if (d <= circle.rad) {
      // Circle is touched, perform an action
      circle.r = random(150, 255);
      circle.g = random(100, 230);
      circle.b = random(170, 255);
      drop.play();
      // console.log(`Circle ${i} touched!`);
    }
  }
}

function mazePath() {
  let protection = 0;

  while (circles.length < windowWidth/6 && protection < 10000) {
    // Combined limit check
    let circle = {
      x: random(windowWidth),
      y: random(windowHeight),
      rad: random(10, 35),

      r: random(150, 255),
      g: random(100, 230),
      b: random(170, 255),
      a: random(30, 180)
    };

    let overlapping = false;

    for (let j = 0; j < circles.length; j++) {
      let other = circles[j];
      let d = dist(circle.x, circle.y, other.x, other.y);
      if (d < circle.rad + other.rad) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      circles.push(circle);
    }

    protection++;
  }
}

function drawCircles() {
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i]; // Access each circle in the array
    fill(circle.r, circle.g, circle.b); // Use each circle's color
    ellipse(circle.x, circle.y, circle.rad * 2, circle.rad * 2);
  }
}

    // Generate a random index from 0 to the length of the passwords array
    let indexPos = Math.floor(Math.random() * passwords.length);
    code = passwords[indexPos];

  //Input room name
let roomName = window.prompt("Enter room with code: " + code);
console.log(roomName);

//Check if a name was entered
if (roomName){
    //Emit a msg to join the room
    socket.emit('room', {"room": roomName});
}
else {
    alert("Please refresh and enter a room name");
}


// //Listen for an event named 'message-share' from the server
// socket.on('message-share', (data) => {
//     console.log(data);
  
//   });