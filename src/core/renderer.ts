import font from '../assets/font.png';
import sprite from '../assets/assets.png';
import { characters } from './font';
import { CellingY, FloorLevel } from '@/consts';

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
  gradient?: CanvasGradient;
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
    this.context.imageSmoothingEnabled = false;

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
      this.context.strokeRect(Math.floor(x), Math.floor(y), w, h);
      return;
    }

    if (!options.gradient) {
      this.context.fillStyle = options.color || "#fff";
    } else {
      this.context.fillStyle = options.gradient;
    }
    this.context.fillRect(Math.floor(x), Math.floor(y), w, h);
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

  drawEntry() {
    const gradient = this.context.createLinearGradient(40, 0, 0, 0);

    // Define gradient stops: right side transparent, left side black
    gradient.addColorStop(0, "rgba(0, 0, 0, 0)"); // Right: Transparent
    gradient.addColorStop(0.9, "rgba(0, 0, 0, 1)"); // Left: Black


    this.drawRect(
      0, CellingY, 40, 60,
      { fill: true, gradient },
    );
  }

  drawCelling() {
    this.drawRect(105, 0, this.canvasWidth, CellingY + 4, { color: '#000', fill: true });
    this.drawRect(0, 0, this.canvasWidth, CellingY, { color: '#000', fill: true });

    for (let i = 105; i < 300; i += 5) {
      this.context.drawImage(
        this.spriteImage,
        3, 25, 5, 3, i, CellingY, 5, 3,
      );
    }
  }

  drawFloor() {
    this.drawRect(0, FloorLevel, this.canvasWidth, 600, { color: '#000', fill: true });

    for (let i = 0; i < 302; i += 5) {
      this.context.drawImage(
        this.spriteImage,
        13, 8, 5, 5, i, FloorLevel, 5, 5,
      );
    }
  }

  drawRightWall() {
    this.drawRect(299, CellingY, this.canvasWidth, 500, { color: '#000', fill: true });

    for (let i = CellingY; i < this.canvasHeight; i += 5) {
      this.context.drawImage(
        this.spriteImage,
        8, 8, 5, 5, 300, i, 5, 5,
      );
    }
  }

  drawSplitWall() {
    this.drawRect(158, CellingY + 4, 5, 26, { color: '#000', fill: true });

    for (let i = CellingY + 4; i < FloorLevel - 24; i += 5) {
      this.drawSprite(
        13, 8, 5, 4, 159, i, 5, 4,
        {
          rotate: Math.PI / 2
        }
      );
    }
  }

  drawOutsideWall(t: number) {
    const morning = [215, 232, 253]; // Yellow
    const noon = [179, 219, 224]; // Blue

    const color = [Math.round(lerp(morning[0], noon[0], t / 100)),
              Math.round(lerp(morning[1], noon[1], t / 100)),
              Math.round(lerp(morning[2], noon[2], t / 100))];

    const fillColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    this.drawRect(0, CellingY, 106, 80, { color: '#000', fill: true });

    this.drawRect(
      0,
      CellingY,
      105,
      80,
      { color: fillColor, fill: true },
    );
    this.drawRect(105, CellingY + 4, 5, 26, { color: '#000', fill: true });


    for (let i = CellingY + 4; i < FloorLevel - 24; i += 5) {
      this.drawSprite(
        13, 8, 5, 4, 106, i, 5, 4,
        {
          rotate: Math.PI / 2
        }
      );
    }
  }

  drawOrnaments() {
    this.drawSprite(20, 2, 7, 6, 220, FloorLevel - 36, 7, 6);
    this.drawSprite(20, 2, 7, 6, 228, FloorLevel - 34, 7, 6);
    this.drawSprite(20, 2, 7, 6, 234, FloorLevel - 38, 7, 6);

    this.drawSprite(0, 36, 10, 10, 274, FloorLevel - 42, 10, 10, {
      rotate: Math.PI,
    });

    this.drawSprite(0, 36, 10, 10, 272, FloorLevel - 42, 10, 10, {
      rotate: Math.PI / 2,
    });
  }

  clear() {
    this.context.fillStyle = '#3d453d';
    this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }
}

function lerp(start: number, end: number, t: number) {
  return (1 - t) * start + t * end;
}

function lerpColor(color1: [number, number, number], color2: [number, number, number], t: number) {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;

  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));

  return `rgb(${r}, ${g}, ${b})`;
}
