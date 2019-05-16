

export default class Ship{
  constructor(displayWidth, displayHeight){
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.x = displayWidth / 2;
    this.y = displayHeight / 2;
    this.angle = -90;
    this.health = 3;
    this.direction = '';
  }


  //ship creation/rendering
  render(ctx){
    ctx.save();
    ctx.strokeStyle = 'green';
    ctx.fillStyle = 'green';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-5, -10);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-5, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  //Updates The Ship frames
  update(input){
    this.direction = input.direction;
    switch(this.direction){
      case 'forward':
      this.x += Math.cos(this.angle);
      this.y += Math.sin(this.angle);
      break;
      case 'turnLeft':
      this.angle -= .05;
      break;
      case 'turnRight':
      this.angle += .05;
      break;
      case 'stop':
      this.x += 0;
      this.y += 0;
      break;
      case 'stopRightTurn':
      this.angle += 0;
      break;
      case 'stopLeftTurn':
      this.angle -= 0;
      break;
      default:
      break;
    }
    this.checkEdge();
  }

  //checks when the ship hits an edge/boundary
  checkEdge(){
    if(this.x < 0){
      this.x = this.displayWidth;
    }
    else if(this.x > this.displayWidth){
      this.x = 0;
    }
    if(this.y <0){
      this.y = this.displayHeight;
    }
    else if(this.y > this.displayHeight){
      this.y = 0;
    }
  }


}
