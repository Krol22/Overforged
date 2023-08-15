import font from '../assets/font.png';
import { characters } from './font';

const letterWidth = 5;
const letterHeight = 6;

type FontOptions = {
  size?: number;
}

export class Renderer {
  context: CanvasRenderingContext2D;
  fontImage: HTMLImageElement;

  constructor(canvas: any) {
    this.context = canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    this.fontImage = new Image();
    this.fontImage.src = font;
  }

  get canvasWidth() {
    return this.context.canvas.width;
  }

  get canvasHeight() {
    return this.context.canvas.height;
  }

  drawSprite(x: number, y: number, w: number, h: number, color: string) {
    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.strokeRect(x, y, w, h);

    this.drawText('Hello in the XIII century!', 70, 20, {
      size: 2,
    });
  }

  drawText(text: string, x: number, y: number, options: FontOptions) {
    const letters = text.split('');
    
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const characterIndex = characters[letter];

      const letterX = characterIndex % 16;
      const letterY = Math.floor(characterIndex / 16);

      const fontSize = options.size || 1;

      const transformedWidth = letterWidth * fontSize;
      const transformedHeight = letterHeight * fontSize;

      this.context.drawImage(
        this.fontImage,
        letterX * letterWidth,
        letterY * letterHeight,
        letterWidth,
        letterHeight,
        x + i * transformedWidth,
        y,
        transformedWidth,
        transformedHeight,
      );
    }
  }

  clear() {
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
