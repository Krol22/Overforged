import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { CellingY, FloorLevel } from '@/consts';
import { drawTooltipBox } from '@/utils/drawTooltipBox';
import { getUpgradeCost } from '@/utils/getUpgradeCost';
import { setSpriteCoords } from '@/utils/setSpriteCoords';
import { controls } from './controls';
import { GameData } from './gameData';
import { LETTER_HEIGHT, LETTER_WIDTH, Renderer } from './renderer';

const enum CustomerSatisfaction {
  WELL_PLEASED = "most pleased",
  SATISFIED = "quite pleased",
  GOOD = "in good spirits",
  NEUTRAL = "without strong feelings",
  ANNOYED = "somewhat displeased",
  INFURIATED = "most infuriated"
}

function mapRatingToSatisfaction(rating: number): [CustomerSatisfaction, any] {
  if (rating <= 1) {
    return [CustomerSatisfaction.INFURIATED,{ r: 199, g: 85, b: 85 }];
  } else if (rating <= 3) {
    return [CustomerSatisfaction.ANNOYED, { r: 177, g: 102, b: 85 }];
  } else if (rating <= 5) {
    return [CustomerSatisfaction.NEUTRAL, { r: 154, g: 120, b: 86 }];
  } else if (rating <= 7) {
    return [CustomerSatisfaction.GOOD, { r: 130, g: 139, b: 87 }];
  } else if (rating <= 9) {
    return [CustomerSatisfaction.SATISFIED, { r: 109, g: 155, b: 87 }];
  } else {
    return [CustomerSatisfaction.WELL_PLEASED, { r: 89, g: 170, b: 87 }];
  }
}

export class UI {
  private renderer: Renderer;
  private gameData: GameData;

  private actionText?: string;

  private anvilMenuX: number = 196;
  private anvilMenuY: number = 132;
  private drawAnvilMenu?: boolean = false;

  private notificationOpacity: number = 0;
  private notificationOpacityDir: number = 1;

  public storedItems: Partial<Record<Item, number>> = {};
  public requiredItems: Array<Item> = [];

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
        58,
        10,
        10,
        9,
        this.anvilMenuX - 2,
        this.anvilMenuY + 5,
        10,
        9,
      );

      this.renderer.drawSprite(
        80,
        0,
        10,
        10,
        this.anvilMenuX + 10,
        this.anvilMenuY + 9,
        10,
        10,
      );
    }

    this.drawGameUI();
    // this.drawButton('Settings', this.renderer.canvasWidth / 2 - 57, 23, () => {
      // this.gameData.showSettings();
    // });

    if (this.gameData.isDayChangeOverlayVisible) {
      this.drawBetweenDaysOverlay();
    }
  }

  drawButton(text: string, x: number, y: number, onPress: () => void, isDisabled: boolean = false) {
    const textWidth = text.length * LETTER_WIDTH;
    const marginVertical = 8;
    const marginHorizontal = 4;

    let offsetY = 0;

    const buttonW = textWidth + 2 * marginVertical;
    const buttonH = LETTER_HEIGHT + 2 * marginHorizontal;

    if (isDisabled) {
      const color = 'rgba(255, 255, 255, 0.6)';
      this.renderer.drawRect(x, y + offsetY, buttonW, buttonH, { color, lineWidth: 1 });
      this.renderer.drawText(text, x + marginVertical, y + marginHorizontal + offsetY, { opacity: 0.6 });
      return;
    }

    let color = '#888';
    if (controls.isHovered(x, y, buttonW, buttonH)) {
      color = '#fff';
    }

    if (controls.isPressed(x, y, buttonW, buttonH)) {
      onPress();
    }

    if (controls.isDown(x, y, buttonW, buttonH)) {
      offsetY = 1;
    }

    this.renderer.drawRect(x, y + offsetY, buttonW, buttonH, { color, lineWidth: 1 });
    this.renderer.drawText(text, x + marginVertical, y + marginHorizontal + offsetY, {});
  }

  drawGameUI() {
    // this.drawDayCycleUI();
    this.drawStoredItems();
    if (this.gameData.lastCustomerNotification) {
      if (this.notificationOpacityDir === 0) {
        this.notificationOpacityDir = 1;
      }

      this.notificationOpacity += this.notificationOpacityDir * 0.01;

      if (this.notificationOpacity >= 1) {
        this.notificationOpacityDir = 0;
        this.notificationOpacity = 1;
        setTimeout(() => {
          this.notificationOpacityDir = -1;
        }, 1000);
      }

      if (this.notificationOpacity <= 0 && this.notificationOpacityDir !== 0) {
        this.notificationOpacity = 0;
        console.log(this.gameData.lastCustomerNotification, "?");
        this.gameData.lastCustomerNotification = false;
        this.gameData.finishDay();
      }

      this.drawLastClientForToday(this.notificationOpacity);
    }
  }

  drawLastClientForToday(counter: number) {
    const ox = 8;
    const oy = 75;

    const hexOpacity = mapToHex(counter);

    this.renderer.drawRect(ox - 1, oy - 1, 103, 26, { color: `#fff${hexOpacity}`, fill: false, lineWidth: 1 });
    this.renderer.drawRect(ox + 0, oy + 0, 101, 24, { color: `#000${hexOpacity}`, fill: true });

    this.renderer.drawText('And that was all', ox + 4, oy + 4, { size: 1, opacity: counter});  
    this.renderer.drawText('customers this day.', ox + 4, oy + 14, { size: 1, opacity: counter });  
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

  drawSettingsModal() {
    const ox = 80;
    const oy = 50;

    const modalW = 167;
    const modalH = 65;

    this.renderer.drawRect(ox - 7, oy - 12, modalW + 4, modalH + 4, { color: '#fff', fill: true });
    this.renderer.drawRect(ox - 5, oy - 10, modalW, modalH, { color: '#182424', fill: true });

    this.renderer.drawText('Pause', ox + 72, oy + 0, { size: 1.5, centered: true });
    this.drawButton(`Continue`, ox + 5, oy + 30, () => {
      this.gameData.hideSettings();
    });

    this.drawButton(`Exit to menu`, ox + 76, oy + 30, () => {});
  }

  drawStoredItems() {
    const ox = 120;
    const oy = CellingY - 21;

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
    if (this.gameData.day === 0) {
      const ox = 60;
      const oy = 20;

      const modalW = 200;
      const modalH = 181;

      this.renderer.drawRect(ox - 7, oy - 12, modalW + 4, modalH + 4, { color: '#3c2013', fill: true });
      this.renderer.drawRect(ox - 9, oy - 10, modalW + 8, modalH, { color: '#3c2013', fill: true });
      this.renderer.drawRect(ox - 5, oy - 10, modalW, modalH, { color: '#222', fill: true });
      this.renderer.drawRect(ox - 7, oy - 8, modalW + 4, modalH - 4, { color: '#222', fill: true });

      this.renderer.drawText(`Congratulations!`, ox + 32, oy - 0, { size: 1.5 });

      this.drawButton(`Start next day`, ox + 50, oy + 144, () => {
        this.gameData.newGame(false);
      });
      return;
    }

    const ox = 60;
    const oy = 20;

    const modalW = 200;
    const modalH = 181;

    this.renderer.drawRect(ox - 7, oy - 12, modalW + 4, modalH + 4, { color: '#3c2013', fill: true });
    this.renderer.drawRect(ox - 9, oy - 10, modalW + 8, modalH, { color: '#3c2013', fill: true });
    this.renderer.drawRect(ox - 5, oy - 10, modalW, modalH, { color: '#222', fill: true });
    this.renderer.drawRect(ox - 7, oy - 8, modalW + 4, modalH - 4, { color: '#222', fill: true });


    this.renderer.drawText(`Day ${this.gameData.day} summary: `, ox + 42, oy - 0, { size: 1.5 });

    this.renderer.drawText(`You have served ${this.gameData.clientsHandled} villagers`, ox + 4, oy + 17, { size: 1 });

    const [satisfactionText, color] = mapRatingToSatisfaction(this.gameData.totalSatisfaction);
    this.renderer.drawText(`The Lord is ${satisfactionText}!`, ox + 4, oy + 27, { size: 1, color });

    this.renderer.drawText(`Available upgrades: (${this.gameData.totalCoins}c available)`, ox + 4, oy + 37, { size: 1 });

    const upgradeablesOY = 5;

    const {
      furnaceLevel,
      grindWheelLevel,
      coalLevel,
      bench: couch,
    } = this.gameData;

    const coins = this.gameData.totalCoins;

    // Furnace
    const furnaceUpgradeCost = getUpgradeCost(20, furnaceLevel);
    const canUpgradeFurnace = coins >= furnaceUpgradeCost;

    // Furnace
    this.renderer.drawSprite(27, 15, 5, 6, ox + 3, oy + 57 + upgradeablesOY, 5, 6);
    this.renderer.drawSprite(0, 0, 13, 20, ox + 0, oy + 45 + upgradeablesOY, 13, 20);
    this.drawButton(`Buy level ${furnaceLevel + 1} (${furnaceUpgradeCost}c)`, ox + 20, oy + 49 + upgradeablesOY, () => {
      this.gameData.totalCoins -= furnaceUpgradeCost;
      this.gameData.furnaceLevel += 1;
    }, !canUpgradeFurnace);

    this.renderer.drawText('Increase heating speed', ox + 135, oy + 52 + upgradeablesOY, { size: 0.5});
    this.renderer.drawText('of the furnace.', ox + 135, oy + 57 + upgradeablesOY, { size: 0.5});

    // Grind wheel
    const grindWheelUpgradeCost = getUpgradeCost(15, grindWheelLevel + 1);
    const canUpgradeGrindWheel = coins >= grindWheelUpgradeCost;

    this.renderer.drawSprite(13, 0, 7, 8, ox + 3, oy + 75 + upgradeablesOY, 7, 8, {});
    this.drawButton(`Buy level ${grindWheelLevel + 1} (${grindWheelUpgradeCost}c)`, ox + 20, oy + 72 + upgradeablesOY, () => {
      this.gameData.totalCoins -= grindWheelUpgradeCost;
      this.gameData.grindWheelLevel += 1;
    }, !canUpgradeGrindWheel);

    this.renderer.drawText('Reduce sharping time', ox + 135, oy + 75 + upgradeablesOY, { size: 0.5});
    this.renderer.drawText('of the grind wheel.', ox + 135, oy + 80 + upgradeablesOY, { size: 0.5});

    // Coal
    const coalUpgradeCost = getUpgradeCost(10, coalLevel + 1);
    const canUpgradeCoal = coins >= coalUpgradeCost;

    this.renderer.drawSprite(18, 8, 6, 5, ox + 4, oy + 100 + upgradeablesOY, 6, 5, {});
    this.drawButton(`Buy level ${coalLevel + 1} (${coalUpgradeCost}c)`, ox + 20, oy + 95 + upgradeablesOY, () => {
      this.gameData.totalCoins -= coalUpgradeCost;
      this.gameData.coalLevel += 1;
    }, !canUpgradeCoal);

    this.renderer.drawText('Increase efficency', ox + 135, oy + 98 + upgradeablesOY, { size: 0.5});
    this.renderer.drawText('of the coal.', ox + 135, oy + 103 + upgradeablesOY, { size: 0.5});

    // Couch
    const canBuyCouch = coins >= 200 && !couch;

    this.renderer.drawSprite(68, 10, 22, 11, ox + 0, oy + 119 + upgradeablesOY, 22, 11, {});

    this.drawButton(this.gameData.bench ? `Already bought` : `Buy for 200c`, ox + 40, oy + 118 + upgradeablesOY, () => {
      this.gameData.totalCoins -= 200;
      this.gameData.bench = 1; 
    }, !canBuyCouch);

    this.renderer.drawText('Make your customers', ox + 135, oy + 122 + upgradeablesOY, { size: 0.5});
    this.renderer.drawText('feel more comfy.', ox + 135, oy + 127 + upgradeablesOY, { size: 0.5});

    this.drawButton(`Start next day`, ox + 50, oy + 144 + upgradeablesOY, () => {
      this.gameData.startNextDay();
    });
  }

  drawGameOverOverlay() {
  }

  clear() {
    this.drawAnvilMenu = false;
    this.actionText = undefined;
  }
}

function mapToHex(value: number) {
  if (value < 0) {
    return 0;  // or handle the error in some other way
  }

  if (value > 1) {
    return 'f';
  }
  
  const intVal = Math.floor(value * 15);
  
  // Convert to hex
  return intVal.toString(16).toUpperCase();
}
