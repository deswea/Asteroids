import Ship from './ship';
import Asteroid from './asteroid';
import Bullets from './bullets';
// Game Class
export default class Game{
  constructor(){
      this.input = {
        direction: ''
      }
      //Canvas Creation
      this.canvas = document.createElement('canvas');
      this.canvas.width = 800;
      this.canvas.height = 600;
      this.canvas.setAttribute('style', "position: absolute; left: 50%; margin-left: -400px;")
      this.ctx = this.canvas.getContext('2d');
      document.body.appendChild(this.canvas);

      //Create Asteroids
      this.asteroids = [];
      this.amount = 9;
      for(var i = 0; i < this.amount ; i++){
        this.asteroid = new Asteroid(this.canvas.width, this.canvas.height, 0, 0, 0, 0, 'bigAsteroid');
        this.asteroids.push(this.asteroid);
      }


      //Create Ship
      this.ship = new Ship(this.canvas.width, this.canvas.height);

      //Create Bullets
      this.bullets = [];
      this.handleKeyUp = this.handleKeyUp.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.shot = false;
      this.round = 1;

      //game sounds
      var shipSound = document.createElement('audio');
      shipSound.id = 'shipSound';
      shipSound.type = 'audio/wav';
      shipSound.src = 'playdeath.wav';
      document.body.appendChild(shipSound);

      var bulletSound = document.createElement('audio')
      bulletSound.id = 'bulletSound';
      bulletSound.type = 'audio/wav';
      bulletSound.src = 'fire.wav';
      document.body.appendChild(bulletSound);

      this.score = 0;
      this.gameover = false;
      this.shipHealth = 3;
      this.update = this.update.bind(this);
      this.render = this.render.bind(this);
      this.shipDead = this.shipDead.bind(this);
      this.nextRound = this.nextRound.bind(this);
      this.gameOver = this.gameOver.bind(this);
      this.loop = this.loop.bind(this);
      this.shipHit = this.shipHit.bind(this);
      this.bulletAstCollision = this.bulletAstCollision.bind(this);
      this.asteroidCollision = this.asteroidCollision.bind(this);
      window.onkeydown = (event) => this.handleKeyDown(event);
      window.onkeyup = (event) => this.handleKeyUp(event);
      setInterval(this.loop, 10);
    }

    //renders the objects to the Canvas

    render(){
      //Clears the canvas
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);

      //renders the ship
      this.ship.render(this.ctx);

      //renders the Bullets
      var numBullets = this.bullets.length;
      for(var i =0; i < numBullets; i++){
        if(this.bullets[i].hit){
          continue;
      }
      this.bullets[i].render(this.ctx);
    }

      var numAsteroids = this.asteroids.length;
      for(var j = 0; j < numAsteroids; j++){
        if(this.asteroids[j].health < 1){
          continue;
        }
        this.asteroids[j].render(this.ctx);
      }

      this.drawScore();
      this.drawControls();

    }

    update(){
      this.shipHit();
      this.asteroidCollision();
      this.bulletAstCollision();
      this.nextRoundCheck();
    }


      //Ship Key Press Event Handler
      handleKeyDown(event){
        event.preventDefault();
        switch(event.key){
          case "w":
          case 'ArrowUp' :
          this.input.direction = 'forward'
          break;
          case "a":
          case "ArrowLeft":
          this.input.direction = "turnLeft";
          break;
          case "d":
          case 'ArrowRight':
          this.input.direction = "turnRight";
          break;
          case " ":;
          this.shot = true;
          break;
          default:
          break;
        }
      }

      //Ship Key Press (On Release) Event InputHandeler
      handleKeyUp(event){
        event.preventDefault();
        console.log('this', this)
        switch(event.key){
          case 'w':
          case 'ArrowUp':
            this.input.direction = 'stop';
            break;
            case 'a':
            case 'ArrowLeft':
            this.input.direction = "stopLeftTurn";
            break;
            case 'd':
            case 'ArrowRight':
              this.input.direction = "stopRightTurn";
              break;
            case " ":
            this.shot = false;
            break;
            default:
            break;
        }
      }

      //Asteroid collision
      asteroidCollision(){
        var numAsteroids = this.asteroids.length;
        for(var i =0; i < numAsteroids; i++){
          var currentAsteroid = this.asteroids[i];
          if(currentAsteroid.health < 1){
            continue;
          }
          var hit = false;
          for(var j = 0; j <numAsteroids; j++){
            if(i !== j){
              var newAsteroid = this.asteroids[i];
              if(newAsteroid.health <1){
                continue;
              }
              if(currentAsteroid.x > newAsteroid.x && currentAsteroid.x < newAsteroid.x){
                if(currentAsteroid.y > newAsteroid.y && currentAsteroid.y < newAsteroid.y){
                  hit = true;
                  var collisionSound = document.getElementById('collisionSound');
                  collisionSound.play();
                }
              }
            }
          }
          this.asteroids[i].update(hit, false, false);
        }
      }

      bulletAstCollision(){
        if(this.shot){
          var bullet = new Bullets(this.canvas.width, this.canvas.height);
          this.bullets.push(bullet);
          var bulletSound = document.getElementById('bulletSound');
          bulletSound.play();
        }

        var numBullets = this.bullets.length;
        var numAsteroids = this.asteroids.length;

        for(var b = 0; b < numBullets; b++){
          var currentBullet = this.bullets[b];
          var hit = false;
          var destroyed = false;
          var breakAsteroid1 = null;
          var breakAsteroid2 = null;
          if(currentBullet.hit){
            continue;
          }
          for(var i = 0; i < numAsteroids; i++){
            var currentAsteroid = this.asteroids[i];
            if(currentAsteroid.health <1){
              continue;
            }
            if(currentAsteroid.x >= currentBullet.x - 15 && currentAsteroid.x <= currentBullet.x + 15){
              if(currentAsteroid.y <= currentBullet.y + 20 && currentAsteroid.y >= currentBullet.y - 20){
                hit = true;
                var shipSound = document.getElementById('shipSound');
                shipSound.play();
                currentAsteroid.update(false, false, true);
                if(currentAsteroid.size === "littleAsteroid" && currentAsteroid.health < 1){
                  this.score += 5;
                }
                if(currentAsteroid.size === "bigAsteroid" && currentAsteroid.health < 1){
                  this.score +=3;
                  destroyed = true;
                  var breakX = currentAsteroid.x;
                  var breakY = currentAsteroid.y;
                  var breakSpeed = currentAsteroid.speed * .85;
                  var breakAngle = Math.random() * 10;
                  var breakAngle2 = breakAngle * .25;
                  breakAsteroid1 = new Asteroid(this.canvas.width, this.canvas.height, breakX, breakY, breakSpeed, breakAngle, 'littleAsteroid');
                  breakAsteroid2 = new Asteroid(this.canvas.width, this.canvas.height, breakX, breakY, breakSpeed, breakAngle2, 'littleAsteroid');
                }
              }
            }
          }
          if(destroyed){
            this.asteroids.push(breakAsteroid1);
            this.asteroids.push(breakAsteroid2);
          }
          this.bullets[b].update(this.ship.x, this.ship.y, this.ship.angle, hit);
        }
      }

      //checks to see if a new round should start
      nextRoundCheck(){
        var numAsteroids = this.asteroids.length;
        var empty = true;
        for(var i = 0; i < numAsteroids; i++){
          if(this.asteroids[i].health > 0){
            empty = false;
            break;
          }
        }
        if(empty){
          this.nextRound();
        }
      }

      //starts a new round if the check passes
      nextRound(){
        if(this.shipHealth === 0){
          this.gameOver = true;
        }
        else{
          this.round += 1;
          this.amount += 5;
          for(var i =0; i < this.amount; i++){
            this.asteroid = new Asteroid(this.canvas.width, this.canvas.height, 0, 0, 0, 0, 'bigAsteroid');
            this.asteroids.push(this.asteroid);
          }
        }
      }

      //checks to see if the ship is dead
      shipDead(){
        if(this.shipHealth === 0){
          this.gameover = true;
        }
        else {
          this.ship = new Ship(this.canvas.width, this.canvas.height);
          this.bullets = [];
          this.shipHealth -= 1;
          var shipSound = document.getElementById('shipSound');
          shipSound.play();
        }
      }

      //check to see if the ship has been hit by an asteroid
      shipHit(){
        var hit = false;
        var numAsteroids = this.asteroids.length;
        for(var i =0; i <numAsteroids; i++){
          var currentAsteroid = this.asteroids[i];
          if(currentAsteroid.health < 1){
            continue;
          }
          if(currentAsteroid.x > this.ship.x - 22 && currentAsteroid.x < this.ship.x +22){
            if(currentAsteroid.y > this.ship.y - 23 && currentAsteroid.y < this.ship.y + 23){
              hit = true;
              break;
            }
          }
        }

        //kills the ship
        if(hit){
          this.shipDead();
        }
        else{
          this.ship.update(this.input);
        }
      }

      //game loop
      loop(){
        if(this.gameover){
          this.gameOver();
        }
        else{
          this.update();
          this.render();
        }
      }

      //Draws the game over
      gameOver(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "green";
        this.ctx.font ='bold 30px courier new';
        this.ctx.fillText("GAME OVER!", 290, 250);
        this.ctx.fillText("Final Score: " +this.score, 290, 300);
      }

      //draws the drawControls
      drawControls(){
        this.ctx.fillStyle = 'green';
        this.ctx.font = 'bold 16px courier new';
        this.ctx.fillText("Forward: w/up Arrow | Turn Right: d/right arrow | Turn Left: a/right arrow | Shoot: Spacebar", 5, 15);
      }

      drawScore(){
        this.ctx.fillStyle ="green";
        this.ctx.font = "bold 16px courier new";
        this.ctx.fillText('Lives:' + this.shipHealth, 5, 575 + ' ');
        this.ctx.fillText(' Round: ' + this.round, 75, 575);
        this.ctx.fillText('   Score: ' + this.score, 145, 575);
      }
  }
