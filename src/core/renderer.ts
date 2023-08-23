import font from '../assets/font.png';
import sprite from '../assets/sprites.png';
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

type SpriteOptions = {
  rotate?: number;
  flipX?: number;
}

export class Renderer {
  private context: CanvasRenderingContext2D;
  private fontImage: HTMLImageElement;
  private spriteImage: HTMLImageElement;

  constructor(canvas: any) {
    this.context = canvas.getContext('2d');
    this.context.imageSmoothingEnabled = true;

    this.fontImage = new Image();
    this.fontImage.src = font;

    this.spriteImage = new Image();
    this.spriteImage.src = sprite;
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

  drawSprite(sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, options?: SpriteOptions) {
    this.drawRect(dx, dy, dw, dh, { lineWidth: 1, color: '#f00' });
    this.context.save();

    this.context.translate(Math.floor(dx) + dw / 2, Math.floor(dy) + dh / 2);

    const rotate = options?.rotate ?? 0;
    const flipX = options?.flipX;

    if (flipX) {
      this.context.scale(flipX, 1);
    }

    this.context.rotate(rotate);

    this.context.drawImage(
      this.spriteImage,
      sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh,
    );

    this.context.restore();
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
