//the bullet class

export default class Bullets{
  constructor(displayWidth, displayHeight){
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.shot = false;
    this.hit = false;
  }



  render(ctx){
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(-1, 0);
    ctx.stroke();
    ctx.restore();
  }

  update(x, y, angle, hit){
    if(this.shot){
      this.x += 2 * Math.cos(this.angle);
      this.y += 2 * Math.sin(this.angle);
    }
    else{
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.shot = true;
    }
  }
}
