//Timer
let time = 5;
const count = document.querySelector("#countdownTimer");
function updateTimer() {
  count.innerHTML = time;
  time--;
}

//audio
var audio = new Audio("aa_hit.wav");
audio.volume = 0.2;
var audio2 = new Audio("scorelevelup.wav");
audio2.volume = 0.2;
var audio3 = new Audio("gg.wav");
audio3.volume = 0.2;
var audio4 = new Audio("aa_click.wav");
audio4.volume = 0.2;
var audio5 = new Audio("aa_bgmusic.wav");
audio5.volume = 0.2;
audio5.loop = true;

//setting up canvas variables
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

//setting up constants
var particles_array = [];
var particle_enemy_array = [];
var mana_array = [];
var collision_particle_array = [];

const max_star_height = canvas.height - 500;
const min_star_height = 0;
const enemy_particle_max_height = -100;
const enemy_particle_min_height = 0;
const mana_max_height = -100;
const mana_min_height = 0;

let score = 0;
let highscore = score;
let selectedButton = 0;
let checkScore1000 = false;
let checkScore500 = false;
let hue = 0;
let selectedColor = "#5FCDD9";
let runTruth = false;


const mouse = {
  x: undefined,
  y: undefined,
  size: undefined,
}

//mainscreen elements
const startGameBtn = document.querySelector("#startGameBtn");  //the start button that leads to the game
const modalEl = document.querySelector("#modalEl");  //the big div that holds all the other elements in the main screen
const aboutBtn = document.querySelector("#aboutBtn")  //about button that works with the modal down below
const aboutModalEl = document.querySelector("#aboutModalEl");
const optionsBtn = document.querySelector("#optionsBtn"); //options button that works with the modal below
const optionsModalEl = document.querySelector("#optionsModalEl");
const backBtn = document.querySelector("#backBtn"); //Created two buttons in order to get the back functionality working for both options and about
const backBtn2 = document.querySelector("#backBtn2");
const scoreEl = document.querySelector("#scoreEl"); //changes the score element when you get the mana
const bigScoreEl = document.querySelector("#bigScoreEl"); //updating the big modal when you die
const musicBtn = document.querySelector("#musicBtn");
const scoreElEl = document.querySelector("#scoreElEl")

const trailBoolButton = document.querySelector("#constellationEff");
var boolTrail = false;

const unicornBoolButton = document.querySelector("#unicornEff");
var unicornBool = false;

function trailBoolChange() {
  audio4.play();
  if (checkScore1000) {
    boolTrail = !boolTrail;
    if (boolTrail == true) {
      trailBoolButton.innerHTML = "Equipped";
    } else if(boolTrail == false) {
      trailBoolButton.innerHTML = "Equip";  
    }
  }
}

function unicornBoolChange() {
  audio4.play();
  if (checkScore500) {
    unicornBool = !unicornBool;
    if(unicornBool == true) {
      unicornBoolButton.innerHTML = "Equipped";
    } else if(unicornBool == false) {
      unicornBoolButton.innerHTML = "Equip";
    }
  }
  selectedColor = "#5FCDD9";
}

trailBoolButton.addEventListener("click", trailBoolChange);
unicornBoolButton.addEventListener("click", unicornBoolChange)

// event listeners
addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
})

canvas.addEventListener("click", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
  for(let i = 0; i < 10; i++) {
    particles_array.push(new Particle());
  }
})

canvas.addEventListener("mousemove", function(event) {  //whenever the mouse moves, we update the mouse location and call the draw function
  mouse.x = event.x;  
  mouse.y = event.y;  
  for (let i = 0; i < 1; i++) {  
      particles_array.push(new Particle());

  }
})

//particle class that manages the trail and the click explosion as well as the collision (for now)
class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 15 + 1;
    mouse.size = this.size;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.size > 0.2) {
      this.size -= 0.2;
    }
  }

  draw() {
    c.save();
    c.shadowColor = selectedColor;
    c.shadowBlur = 30;
    c.fillStyle = selectedColor;  
    c.beginPath(); 
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);  
    c.fill();
    c.restore();
  }
}

//class that shows the particles when the player is touching the mana and increasing the score
class ParticleCollision {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.size > 0.2) {
      this.size -= 0.2;
    }
  }
  draw() {
    c.save();
    c.shadowColor = "#8B6FF7";
    c.shadowBlur = 30;
    c.fillStyle = "#8B6FF7";
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    c.fill();
    c.restore();

  }
}

//creates enemies which are the red balls in the game
class EnemyParticles {
  constructor() { 
    this.x = Math.random() * canvas.width;
    this.y = Math.floor(Math.random() * (enemy_particle_max_height - enemy_particle_min_height + 1)) + enemy_particle_min_height;
    this.size = Math.floor(Math.random() * (20 - 10)) + 10;
    this.speedX = Math.random() * 3 - 1.5;   
    this.speedY = Math.random() * 5;   
}

update() {  //this creates a 2d vector for movement in canvas
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y - this.size > canvas.height + 10 || this.x - this.size > canvas.width || this.x - this.size < -50) {
      this.x = Math.random() * canvas.width;
      this.y = Math.floor(Math.random() * (enemy_particle_max_height - enemy_particle_min_height + 1)) + enemy_particle_min_height;
      this.size = Math.floor(Math.random() * (20 - 10)) + 10;
      this.speedX = Math.random() * 3 - 1.5;   
      this.speedY = Math.random() * 5;   
    }
}

draw() {
    c.save();
    c.shadowColor = "red"
    c.shadowBlur = 30
    c.fillStyle = "red";  
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);   
    c.fill();
    c.restore();
  }
}

//manaparticles that create the purple elements in the game
class manaParticles {
  constructor() { 
    this.x = Math.random() * canvas.width;
    this.y = Math.floor(Math.random() * (mana_max_height - mana_min_height + 1)) + mana_min_height;
    this.size = Math.floor(Math.random() * (20 - 10)) + 10;
    this.speedX = Math.random() * 3 - 1.5;   
    this.speedY = Math.floor(Math.random() * (10 - 5 + 1)) + 5;   
}

update() {  //this creates a 2d vector for movement in canvas
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y - this.size > canvas.height + 10 || this.x - this.size > canvas.width || this.x - this.size < -50) {
      this.x = Math.random() * canvas.width;
      this.y = Math.floor(Math.random() * (mana_max_height - mana_min_height + 1)) + mana_min_height;
      this.size = Math.floor(Math.random() * (20 - 10)) + 10;
      this.speedX = Math.random() * 3 - 1.5;  
      this.speedY = Math.floor(Math.random() * (10 - 5 + 1)) + 5;   
    }
}

draw() {
    c.save();
    c.shadowColor = "#8B6FF7"
    c.shadowBlur = 30
    c.fillStyle = "#8B6FF7";
    c.beginPath(); 
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);   //x, y, radius, start angle, ending angle
    c.fill();
    c.restore();
  }
}

//functions that create and handle as well as calculate collisions
function createEnemyParticles() {
  for (let i = 0; i < 20; i++) {
    particle_enemy_array.push(new EnemyParticles());
  }
}

function createManaParticles() {
  for (let i = 0; i < 1; i++) {
    mana_array.push(new manaParticles());
  }
}

function handleParticles(particles_array, boolTrail, unicornBool) {
  for(let i = 0; i < particles_array.length; i++) {
    particles_array[i].update();
    particles_array[i].draw();
    if (boolTrail == true) {
      for (let j = i; j < particles_array.length; j++) {   //constellation effect: we compare all the particles together and add lines if they are close
          const dx = particles_array[i].x - particles_array[j].x;   //bottom of triangle
          const dy = particles_array[i].y - particles_array[j].y;   //height of triangle
          const distance = Math.sqrt(dx * dx + dy * dy);  //hypotenuse
          if (distance < 100) {   //if they are close, create a line
              c.beginPath();
              c.strokeStyle = "white";
              c.lineWidth = 1;
              c.moveTo(particles_array[i].x, particles_array[i].y)
              c.lineTo(particles_array[j].x, particles_array[j].y)
              c.stroke();
          }
      }
    } 
    if(unicornBool == true) {
      selectedColor = 'hsl(' + hue + ', 100%, 50%)';
    }
    if (particles_array[i].size <= 0.3) {
      particles_array.splice(i,1);
      i--;
    }
  }
}

function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function handleEnemyParticles() {
  for (let i  = 0; i < particle_enemy_array.length; i++) {
    particle_enemy_array[i].update();
    particle_enemy_array[i].draw();
    //two lines below are used for testing
    //console.log(mouse.x, mouse.y, particle_enemy_array[i].x, particle_enemy_array[i].y);
    //console.log(getDistance(mouse.x, mouse.y, particle_enemy_array[i].x, particle_enemy_array[i].y));
    if (getDistance(mouse.x, mouse.y, particle_enemy_array[i].x, particle_enemy_array[i].y) < mouse.size + particle_enemy_array[i].size) {
      runTruth = false;
      time = 5;
      audio3.play();
      count.style.display = "none";
      scoreElEl.style.display = "none";
      modalEl.style.display = "flex"; //this brings back the gameover screen after you die
      bigScoreEl.innerHTML = highscore; //this updates the score on the modal
      particles_array = [];
      particle_enemy_array = [];
      mana_array = [];
    }

  }
}

function handleManaParticles() {
  for (let i  = 0; i < mana_array.length; i++) {
    mana_array[i].update();
    mana_array[i].draw();
    //console.log(mouse.x, mouse.y, particle_enemy_array[i].x, particle_enemy_array[i].y);
    //console.log(getDistance(mouse.x, mouse.y, particle_enemy_array[i].x, particle_enemy_array[i].y));
    if (getDistance(mouse.x, mouse.y, mana_array[i].x, mana_array[i].y) < mouse.size + mana_array[i].size) {
      for(let i = 0; i < 3; i++) {
        audio.play();
        collision_particle_array.push(new ParticleCollision());
      }
      time = 5;
      score += 10; //this line and the line below is when the score changes
      if (highscore < score) {
        highscore = score;
      }
      if(score == 5000){
        audio2.play();
        checkScore500 = true;
      }
      if(score == 10000){
        audio2.play();
        checkScore1000 = true;
      }
      scoreEl.innerHTML = "&nbsp" + score;
    }
  }
}

function handleParticlesCollision() {
  for(let i = 0; i < collision_particle_array.length; i++) {
    collision_particle_array[i].update();
    collision_particle_array[i].draw();
    if (collision_particle_array[i].size <= 0.3) {
      collision_particle_array.splice(i,1);
      i--;
    }
  }
}

function handleTime() {
  if (time < 0) {
    runTruth = false;
    audio3.play();
    time = 5;
    count.style.display = "none";
    scoreElEl.style.display = "none";
    modalEl.style.display = "flex"; //this brings back the gameover screen after you die
    bigScoreEl.innerHTML = highscore; //this updates the score on the modal
    particles_array = [];
    particle_enemy_array = [];
    mana_array = [];
  }
}

//function object that creates the background
function Star(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
}

Star.prototype.draw = function() {
  c.save();
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
  c.shadowColor = this.color;
  c.shadowBlur = 20;
  c.fillStyle = this.color;
  c.fill();
  c.closePath();
  c.restore();
}


function createMountainRange(mountainAmount, height, color) {
    for (let i  = 0; i < mountainAmount; i++) {
      const mountainwidth = canvas.width / mountainAmount;
      c.beginPath();
      c.moveTo(i * mountainwidth, canvas.height);
      c.lineTo(i * mountainwidth + mountainwidth + 325, canvas.height);
      c.lineTo(i * mountainwidth + mountainwidth / 2, canvas.height - height);
      c.lineTo(i * mountainwidth - 325, canvas.height);
      c.fillStyle = color;
      c.fill();
      c.closePath();
    }
}

// Implementation of the background of the game from bottom to top
const backgroundgradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundgradient.addColorStop(0, "#171e26");
backgroundgradient.addColorStop(1, "#3f586b");
let backgroundstars;
const groundHeight = 50;

//init function for creating the stars
function init() {
  backgroundstars = [];
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.floor(Math.random() * (max_star_height - min_star_height + 1)) + min_star_height;  //algorithm to get value between two numbers
    const radius = Math.random() * 3;
    backgroundstars.push(new Star(x, y, radius, "white"));
  }
}

// Animation Loop that handles all of the handling particles, background, and animation frame
function animate() {
  if (!runTruth) {
    time = 5;
  }
  c.fillStyle = backgroundgradient;
  c.fillRect(0, 0, canvas.width, canvas.height);
  backgroundstars.forEach(backgroundstar => {
    backgroundstar.draw();
  }); 
  createMountainRange(1, canvas.height - 50, "#384551");
  createMountainRange(2, canvas.height - 100, "#2B3843");
  createMountainRange(3, canvas.height - 300, "#26333e");
  handleParticles(particles_array, boolTrail, unicornBool);
  handleManaParticles();
  handleEnemyParticles();
  handleParticlesCollision()
  handleTime();
  c.fillStyle = "#182028";
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
  hue++;
  requestAnimationFrame(animate);
}

//mainscreen event listener that runs everything right after the start button is pressed
startGameBtn.addEventListener("click", function(event) {
  runTruth = true;
  audio5.play();
  count.style.display = "flex";
  scoreElEl.style.display = "flex";
  time = 5;
  audio4.play();
  score = 0;
  scoreEl.innerHTML = "&nbsp" + score;
  bigScoreEl.innerHTML = score;
  particles_array = [];
  particle_enemy_array = [];
  mana_array = [];
  createEnemyParticles();
  createManaParticles();
  modalEl.style.display = "none";
})

aboutBtn.addEventListener("click", function(event) {
  audio4.play();
  modalEl.style.display = "none";
  aboutModalEl.style.display = "flex";
  selectedButton = 1;
})

musicBtn.addEventListener("click", function(event) {
  audio4.play();
  if(audio5.volume == 0.2) {
    audio5.volume = 0;
  } else if (audio5.volume == 0) {
    audio5.volume = 0.2;
  }
  
})

optionsBtn.addEventListener("click", function(event) {
  audio4.play();
  modalEl.style.display = "none";
  optionsModalEl.style.display = "flex";
  selectedButton = 2;
})


backBtn.addEventListener("click", function(event) {
  audio4.play();
  modalEl.style.display = "flex";
  aboutModalEl.style.display = "none";
})

backBtn2.addEventListener("click", function(event) {
  audio4.play();
  modalEl.style.display = "flex";
  optionsModalEl.style.display = "none";
})

//do not put this in the eventlistener above as it causes the game to run faster and faster haha
count.style.display = "none";
scoreElEl.style.display = "none";
setInterval(updateTimer, 1000);
init();
animate();

//TASKS
//refactor code 
