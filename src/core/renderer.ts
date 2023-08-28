import font from '../assets/font.png';
import sprite from '../assets/assets.png';
import { characters } from './font';

export const LETTER_WIDTH = 5;
export const LETTER_HEIGHT = 6;

type FontOptions = {
  size?: number;
  centered?: boolean;
}

type RectOptions = {
  lineWidth?: number;
  color?: string;
  fill?: boolean;
}

type SpriteOptions = {
  rotate?: number;
  flipX?: number;
  transformOriginX?: number;
  transformOriginY?: number;
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

  drawSprite(sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, options: SpriteOptions = {}) {
    this.context.save();

    const { transformOriginX = 0, transformOriginY = 0 } = options;

    this.context.translate(Math.floor(dx) + Math.floor(dw / 2), Math.floor(dy) + Math.floor(dh / 2));

    const rotate = options?.rotate ?? 0;
    const flipX = options?.flipX;

    if (flipX) {
      this.context.scale(flipX, 1);
    }

    this.context.rotate(rotate);

    this.context.drawImage(
      this.spriteImage,
      sx, sy, sw, sh, -Math.floor(dw / 2) + transformOriginX, -Math.floor(dh / 2) + transformOriginY, dw, dh,
    );

    this.context.restore();
  }

  drawText(text: string, x: number, y: number, options: FontOptions) {
    const letters = text.split('');
    let centeredOffset = Math.floor(options.centered ? - text.length * LETTER_WIDTH / 2 : 0);
    
    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const characterIndex = characters[letter];

      const letterX = characterIndex % 16;
      const letterY = Math.floor(characterIndex / 16);

      const fontSize = options.size || 1;

      const transformedWidth = LETTER_WIDTH * fontSize;
      const transformedHeight = LETTER_HEIGHT * fontSize;

      let offsetX = 0;
      if (letter === 'i') {
        offsetX = 2;
      }

      this.context.drawImage(
        this.fontImage,
        letterX * LETTER_WIDTH,
        letterY * LETTER_HEIGHT,
        LETTER_WIDTH,
        LETTER_HEIGHT,
        x + i * transformedWidth + offsetX + centeredOffset,
        y,
        transformedWidth,
        transformedHeight,
      );
    }
  }

  drawCelling() {
    this.drawRect(0, 0, this.canvasWidth, 124, { color: '#000', fill: true });

    for (let i = 0; i < 300; i += 5) {
      this.context.drawImage(
        this.spriteImage,
        3, 25, 5, 3, i, 120, 5, 3,
      );
    }
  }

  drawFloor() {
    this.drawRect(0, 170, this.canvasWidth, 600, { color: '#000', fill: true });

    for (let i = 0; i < 302; i += 5) {
      this.context.drawImage(
        this.spriteImage,
        13, 8, 5, 5, i, 170, 5, 5,
      );
    }
  }

  drawRightWall() {
    this.drawRect(299, 100, this.canvasWidth, 500, { color: '#000', fill: true });

    for (let i = 120; i < this.canvasHeight; i += 5) {
      this.context.drawImage(
        this.spriteImage,
        8, 8, 5, 5, 300, i, 5, 5,
      );
    }
  }

  drawSplitWall() {
    this.drawRect(158, 124, 5, 26, { color: '#000', fill: true });

    for (let i = 124; i < 146; i += 5) {
      this.drawSprite(
        13, 8, 5, 4, 159, i, 5, 4,
        {
          rotate: Math.PI / 2
        }
      );
    }
  }

  drawOrnaments() {
    this.drawSprite(20, 2, 7, 6, 220, 134, 7, 6);
    this.drawSprite(20, 2, 7, 6, 228, 136, 7, 6);
    this.drawSprite(20, 2, 7, 6, 234, 132, 7, 6);

    this.drawSprite(0, 36, 10, 10, 274, 128, 10, 10, {
      rotate: Math.PI,
    });

    this.drawSprite(0, 36, 10, 10, 272, 128, 10, 10, {
      rotate: Math.PI / 2,
    });
  }

  clear() {
    this.context.fillStyle = '#3d453d';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}
