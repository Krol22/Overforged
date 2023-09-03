import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { CellingY, FloorLevel, RightWallX } from '@/consts';
import { drawTooltipBox } from '@/utils/drawTooltipBox';
import { setSpriteCoords } from '@/utils/setSpriteCoords';
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

  public storedItems: Partial<Record<Item, number>> = {};
  public requiredItems: Array<Item> = [];

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
        Math.floor(this.renderer.canvasWidth / 4 - textWidth / 2),
        FloorLevel + 40,
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
    // this.drawDayCycleUI();
    this.drawStoredItems();
  }

  getTooltipColor(item: Item) {
    if (this.requiredItems.includes(item)) {
      const numberOfItem = this.storedItems[item] ?? 0;
      const requiredItemsNumber = this.requiredItems.filter((i) => item === i).length;

      if (numberOfItem < requiredItemsNumber) {
        return '#ac3232';
      }

      return '#97f3a7';
    }

    return '#ddd';
  }

  drawStoredItems() {
    const ox = 100;
    const oy = CellingY - 30;

    this.renderer.drawText("Stored items:", ox + 10, oy + 8, {});

    const sprite = new SpriteComponent(0, 0, 0, 0);
    setSpriteCoords(Item.horseShoe, sprite);
    const position = new PositionComponent(ox + 80, oy + 20);
    const numberOfHs = this.storedItems[Item.horseShoe] ?? 0;

    drawTooltipBox(
      position,
      sprite,
      Item.horseShoe,
      this.getTooltipColor(Item.horseShoe),
      this.renderer,
    );

    this.renderer.drawText(`:${numberOfHs}`, ox + 93, oy + 8, {});

    setSpriteCoords(Item.axe, sprite);
    position.x = ox + 115;
    position.y = oy + 22;

    const numberOfAxe = this.storedItems[Item.axe] ?? 0;

    drawTooltipBox(
      position,
      sprite,
      Item.axe,
      this.getTooltipColor(Item.axe),
      this.renderer,
    );

    this.renderer.drawText(`:${numberOfAxe}`, ox + 131, oy + 8, {});

    setSpriteCoords(Item.weapon, sprite);
    position.x = ox + 154;
    position.y = oy + 22;

    const numberOfWeapon = this.storedItems[Item.weapon] ?? 0;

    drawTooltipBox(
      position,
      sprite,
      Item.weapon,
      this.getTooltipColor(Item.weapon),
      this.renderer,
    );

    this.renderer.drawText(`:${numberOfWeapon}`, ox + 171, oy + 8, {});
  }

  drawBetweenDaysOverlay() {
    this.renderer.drawRect(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight, { fill: true, color: '#000' });

    this.renderer.drawText(`Summary of day ${this.gameData.day}: `, this.renderer.canvasWidth / 2, 20, { size: 1, centered: true });

    this.renderer.drawText(`You have ${this.gameData.coins} coins to spend:`, this.renderer.canvasWidth / 2 - 100, 45, { size: 1 });

    options.forEach((option, index) => {
      this.renderer.drawText(`${option.text} - ${option.costPerLevel}`, this.renderer.canvasWidth / 2 - 90, 60 + 10 * index, { size: 1 });
    });
  }

  drawGameOverOverlay() {
  }

  setStoredItems(items: Record<Item, number>) {
  }

  clear() {
    this.drawAnvilMenu = false;
    this.actionText = undefined;
  }
}
