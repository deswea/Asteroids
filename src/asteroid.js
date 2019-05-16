//Asteroid Classic

export default class Asteroid{
  constructor(displayWidth, displayHeight, x, y, speed, angle, size){
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.size = size;
    this.health = 25;
    if(this.size === "littleAsteroid"){
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.angle = angle;
    }
    else{
      this.x = Math.random() * displayWidth;
      this.y = Math.random() * displayHeight;

      if(this.x > (this.displayWidth/2) - 30 && this.x < (this.displayWidth /2) + 30){
          if(this.y > (this.displayHeight/2) - 30 && this.y < (this.displayHeight/2) + 30){
            this.x = this.displayWidth/4;
            this.y = this.displayHeight/4;
        }
      }
      this.speed = Math.random() * .5;
      this.angle = Math.random() * 25;
    }
  }



    //draws and renders the asteroids on the Canvas
    render(ctx){
      ctx.save();
      ctx.strokeStyle ='white';
      ctx.fillStyle = 'grey';
      ctx.translate(this.x , this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      if(this.size === 'littleAsteroid'){
        ctx.moveTo(0, -10);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(5, 25);
        ctx.lineTo(10, 5);
        ctx.lineTo(3, -3);
      }
      else{
        ctx.moveTo(-10, 0);
        //ctx.lineTo(-10, 0);
        ctx.lineTo(-50, 30);
        ctx.lineTo(-30, 40);
        ctx.lineTo(10, 30);
        ctx.lineTo(30, 25);
        ctx.lineTo(15, 5);
        ctx.lineTo(10, -10);
        ctx.lineTo(5, -10);
        ctx.lineTo(-10, -10);
        ctx.lineTo(-15,-2);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }

    //checks the edges of the screen for the asteroids to go the other side
    checkEdge(displayWidth, displayHeight){
      if(this.x < 0){
        this.x = displayWidth;
      }
      else if(this.x > displayWidth){
        this.x = 0;
      }
      if(this.y < 0){
        this.y = displayHeight;
      }
      else if(this.y > displayHeight){
        this.y = 0;
      }
    }

    update(collision, shipCol, bulletCol ){
      if(collision){
        this.angle *= 1;
      }
      if(shipCol){
        this.health = 0;
      }
      if(bulletCol){
        this.health -= 1;
      }

      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
      this.checkEdge(this.displayWidth, this.displayHeight);
    }
  }
