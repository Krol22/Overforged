import font from '../assets/font.png';
import { characters } from './font';

export const LETTER_WIDTH = 5;
export const LETTER_HEIGHT = 6;

type FontOptions = {
  size?: number;
}

type RectOptions = {
  lineWidth?: number;
  color?: string;
  fill?: boolean;
}

export class Renderer {
  private context: CanvasRenderingContext2D;
  private fontImage: HTMLImageElement;

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

  drawRect(x: number, y: number, w: number, h: number, options: RectOptions) {
    this.context.strokeStyle = options.color || "#fff";
    if (!options.fill) {
      this.context.lineWidth = options.lineWidth || 2;
      this.context.strokeRect(x, y, w, h);
      return;
    }

    this.context.fillStyle = options.color || "#fff";
    this.context.fillRect(x, y, w, h);
  }

  drawSprite(x: number, y: number, w: number, h: number, color: string) {
    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.strokeRect(x, y, w, h);
  }

  drawText(text: string, x: number, y: number, options: FontOptions) {
    const letters = text.split('');
    
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const characterIndex = characters[letter];

      const letterX = characterIndex % 16;
      const letterY = Math.floor(characterIndex / 16);

      const fontSize = options.size || 1;

      const transformedWidth = LETTER_WIDTH * fontSize;
      const transformedHeight = LETTER_HEIGHT * fontSize;

      this.context.drawImage(
        this.fontImage,
        letterX * LETTER_WIDTH,
        letterY * LETTER_HEIGHT,
        LETTER_WIDTH,
        LETTER_HEIGHT,
        x + i * transformedWidth,
        y,
        transformedWidth,
        transformedHeight,
      );
    }
  }

  clear() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
