import { LETTER_WIDTH, Renderer } from './renderer';

export class UI {
  private renderer: Renderer;

  private actionText?: string;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  // #TODO - if priorities needed add an option for setting optional priority with options.
  setActionText(actionText: string) {
    this.actionText = actionText;
  }

  draw() {
    if (this.actionText) {
      const textWidth = this.actionText.length * LETTER_WIDTH;
      this.renderer.drawText(
        this.actionText,
        Math.floor(this.renderer.canvasWidth / 2 - textWidth / 2),
        this.renderer.canvasHeight - 10,
        { size: 1 },
      );
    }
  }

  clear() {
    this.actionText = undefined;
  }
}
