export class Renderer {
  context: CanvasRenderingContext2D;

  constructor(canvas: any) {
    this.context = canvas.getContext('2d');
  }

  get canvasWidth() {
    return this.context.canvas.width;
  }

  get canvasHeight() {
    return this.context.canvas.height;
  }

  drawSprite(x: number, y: number, w: number, h: number) {
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 4;
    this.context.rect(x, y, w, h);
  }

  drawText(text: string, fontSize: number, x: number, y: number, color = 'white', textAlign: 'center' | 'left' | 'right' = 'center') {
    const context = this.context;

    context.font = `${fontSize}px Impact, sans-serif-black`;
    context.textAlign = textAlign;
    context.strokeStyle = 'black';
    context.lineWidth = 4;
    context.strokeText(text, x, y);
    context.fillStyle = color;
    context.fillText(text, x, y);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
