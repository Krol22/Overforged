import { GameData } from './gameData';
import { LETTER_WIDTH, Renderer } from './renderer';

const options = [
  { text: 'Upgrade forge', costPerLevel: 10 },
  { text: 'Upgrade coal efficency', costPerLevel: 4 },
];

export class UI {
  private renderer: Renderer;
  private gameData: GameData;

  private actionText?: string;

  private anvilMenuX: number = 196;
  private anvilMenuY: number = 132;
  private drawAnvilMenu?: boolean = false;

  private selectedOption: number = 0;

  constructor(renderer: Renderer, gameData: GameData) {
    this.renderer = renderer;
    this.gameData = gameData;
  }

  showAnvilMenu(x: number, y: number) {
    this.drawAnvilMenu = true;
    this.anvilMenuX = x;
    this.anvilMenuY = y;
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

    if (this.drawAnvilMenu) {
      this.renderer.drawText("1", this.anvilMenuX - 14, this.anvilMenuY, { size: 1 });
      this.renderer.drawText("2", this.anvilMenuX - 0, this.anvilMenuY - 5, { size: 1 });
      this.renderer.drawText("3", this.anvilMenuX + 14, this.anvilMenuY, { size: 1 });

      this.renderer.drawSprite(
        20,
        2,
        7,
        6,
        this.anvilMenuX - 16,
        this.anvilMenuY + 9,
        7,
        6,
      );

      this.renderer.drawSprite(
        0,
        28,
        8,
        8,
        this.anvilMenuX - 2,
        this.anvilMenuY + 5,
        8,
        8,
      );

      this.renderer.drawSprite(
        0,
        36,
        10,
        10,
        this.anvilMenuX + 10,
        this.anvilMenuY + 9,
        10,
        10,
      );
    }

    this.drawGameUI();

    if (this.gameData.isDayChangeOverlayVisible) {
      this.drawBetweenDaysOverlay();
    }
  }

  drawGameUI() {
    this.renderer.drawText(`Coins: ${this.gameData.coins}`, 0, 70, { size: 1 });
    this.renderer.drawText(`Remaning enemies: ${this.gameData.remaningEnemies}`, 0, 80, { size: 1 });
  }

  drawBetweenDaysOverlay() {
    this.renderer.drawRect(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight, { fill: true, color: '#000' });

    this.renderer.drawText(`Congratulations, you survived ${this.gameData.day} days!`, this.renderer.canvasWidth / 2, 20, { size: 1, centered: true });

    this.renderer.drawText(`You have ${this.gameData.coins} coins to spend:`, this.renderer.canvasWidth / 2 - 100, 45, { size: 1 });

    options.forEach((option, index) => {
      this.renderer.drawText(`${option.text} - ${option.costPerLevel}`, this.renderer.canvasWidth / 2 - 90, 60 + 10 * index, { size: 1 });
    });
  }

  drawGameOverOverlay() {
  }

  clear() {
    this.drawAnvilMenu = false;
    this.actionText = undefined;
  }
}
