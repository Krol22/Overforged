import { gameData } from '@/core/gameData';
import { Renderer } from '@/core/renderer';
import { ScreenTransition } from '@/core/screen-transition';
import { State } from '@/core/state';
import { UI } from '@/core/ui';
import { gameStateMachine } from '@/game-state-machine';
import { gameStateFactory } from './game.state';

class TutorialState implements State {
  private readonly renderer: Renderer;
  private readonly ui: UI;
  private readonly screenTransition: ScreenTransition;

  private pageSelected: number = 0;

  constructor() {
    const canvas = document.querySelector('#canvas');
    this.renderer = new Renderer(canvas);
    this.screenTransition = new ScreenTransition(this.renderer);
    this.ui = new UI(this.renderer, gameData);
  }

  onEnter() {
    this.screenTransition.startTransition(() => {}, 50, true);
  };

  onUpdate(_: number) {
    this.renderer.clear();
    this.renderer.drawRect(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight, { color: '#182424', fill: true });

    if (this.pageSelected === 0) {
      this.rendererFirstPage();
    } else if (this.pageSelected === 1) {
      this.rendererSecondPage();
    } else if (this.pageSelected === 2) {
      this.rendererThirdPage();
    }

    this.screenTransition.update();
  }

  private rendererFirstPage() {
    this.renderer.drawText("How to play?", 135, 8, { size: 1.5, centered: true });

    // Player
    this.renderer.drawSprite(32, 26, 12, 14, 12, 24, 12, 14);
    this.renderer.drawText("- ", 30, 29, { size: 1 });
    this.renderer.drawText("  this is your character.Use arrows or <A> <D> keys", 30, 25, { size: 1 });
    this.renderer.drawText("  to move. Use <Space> to interact with forge tools.", 30, 33, { size: 1 });

    // Furnace
    let oy = 25;

    this.renderer.drawSprite(27, 15, 5, 6, 15, oy + 39, 5, 6);
    this.renderer.drawSprite(0, 0, 13, 20, 12, oy + 28, 13, 20);
    this.renderer.drawText("- ", 30, oy + 37, { size: 1 });
    this.renderer.drawText("  Furnace, a hearth of the forge. Heats the steel.", 30, oy + 25, { size: 1 });
    this.renderer.drawText("  Remember to keep the temperature high! Furnace", 30, oy + 33, { size: 1 });
    this.renderer.drawText("  will inform you when item is heated when tooltip", 30, oy + 41, { size: 1 });
    this.renderer.drawText("  above it will turn green!", 30, oy + 49, { size: 1 });

    this.ui.drawButton('Next page', 230, 180, () => {
      this.pageSelected = 1;
    });

    // Ironbox
    oy = 85;

    this.renderer.drawSprite(0, 20, 11, 8, 14, oy + 5, 11, 8);
    this.renderer.drawText("- ", 30, oy + 7, { size: 1 });
    this.renderer.drawText("  Box of infinite steel.", 30, oy + 7, { size: 1 });

    // Coalpile
    oy = 105;

    this.renderer.drawSprite(13, 19, 14, 7, 13, oy + 6, 14, 7);
    this.renderer.drawText("- ", 30, oy + 7, { size: 1 });
    this.renderer.drawText("  Pile of coal, your furnace fuel.", 31, oy + 7, { size: 1 });

    // Protip
    oy = 135;

    this.renderer.drawRect(10, oy + 3, this.renderer.canvasWidth / 2 - 20, 30, { fill: true, color: '#3d453d' });

    this.renderer.drawText("! ", 17, oy + 12, { size: 2 });
    this.renderer.drawText("  Tip: it is better to switch heated item in furnace", 18, oy + 11, { size: 1 });
    this.renderer.drawText("  with non heated to save some time!", 18, oy + 19, { size: 1 });
  }

  private rendererSecondPage() {
    this.renderer.drawText("How to play?", 135, 8, { size: 1.5, centered: true });

    this.renderer.drawSprite(13, 13, 12, 6, 12, 32, 12, 6);
    this.renderer.drawText("- ", 30, 33, { size: 1 });
    this.renderer.drawText("  Anvil, takes hot steel and forges it into a weapon", 30, 25, { size: 1 });
    this.renderer.drawText("  or tool. Use 1, 2, 3 numbers to select what you want", 30, 33, { size: 1 });
    this.renderer.drawText("  to make.", 30, 41, { size: 1 });

    // Grind wheel
    let oy = 55;

    this.renderer.drawSprite(13, 0, 7, 8, 14, 5 + oy, 8, 12);
    this.renderer.drawText("- ", 30, oy + 9, { size: 1 });
    this.renderer.drawText("  Grind wheel, some of the forged weapons needs to", 30, oy + 5, { size: 1 });
    this.renderer.drawText("  be sharpened before selling them.", 30, oy + 13, { size: 1 });

    this.ui.drawButton('Prev page', 15, 180, () => {
      this.pageSelected = 0;
    });

    // Counter 
    oy = 83;

    this.renderer.drawSprite(34, 0, 16, 8, 11, 7 + oy, 16, 8);
    this.renderer.drawText("- ", 30, oy + 9, { size: 1 });
    this.renderer.drawText("  Counter, leave ready items there so your", 30, oy + 5, { size: 1 });
    this.renderer.drawText("  customers will be able to buy them!", 30, oy + 13, { size: 1 });

    this.ui.drawButton('Prev page', 15, 180, () => {
      this.pageSelected = 0;
    });

    this.ui.drawButton('Next page', 230, 180, () => {
      this.pageSelected = 2;
    });


    // Items tree

    oy = 110;

    this.renderer.drawText(" Items tree: ", 10, oy + 2, { size: 1 });

    this.renderer.drawSprite(25, 8, 7, 7, 4, 25 + oy, 14, 14);
    this.renderer.drawSprite(0, 41, 10, 1, 22, 32 + oy, 25, 2);
    this.renderer.drawSprite(27, 0, 7, 7, 48, 25 + oy, 14, 14);
    this.renderer.drawSprite(0, 32, 23, 19, 64, 14 + oy, 46, 38);

    this.renderer.drawSprite(20, 2, 7, 6, 112, 9 + oy, 14, 12);
    this.renderer.drawSprite(48, 10, 10, 9, 112, 24 + oy, 20, 18);
    this.renderer.drawSprite(0, 41, 10, 1, 135, 32 + oy, 25, 2);
    this.renderer.drawSprite(58, 10, 10, 9, 162, 24 + oy, 20, 18);

    this.renderer.drawSprite(50, 0, 10, 10, 112, 42 + oy, 20, 20);
    this.renderer.drawSprite(0, 41, 10, 1, 135, 50 + oy, 25, 2);
    this.renderer.drawSprite(60, 0, 10, 10, 162, 42 + oy, 20, 20);
    this.renderer.drawSprite(0, 41, 10, 1, 185, 50 + oy, 25, 2);
    this.renderer.drawSprite(70, 0, 10, 10, 213, 42 + oy, 20, 20);
    this.renderer.drawSprite(0, 41, 10, 1, 236, 50 + oy, 25, 2);
    this.renderer.drawSprite(80, 0, 10, 10, 265, 42 + oy, 20, 20);
  }

  private rendererThirdPage() {
    this.renderer.drawText("How to play?", 135, 8, { size: 1.5, centered: true });

    let oy = 25;

    this.renderer.drawText("Your mission is to keep both the villagers and the Lord", 15, oy + 25, { size: 1 });
    this.renderer.drawText("well-pleased with your craftsmanship. Displeased Lord", 15, oy + 33, { size: 1 });
    this.renderer.drawText("will bring the end for your time at the forge. Craft", 15, oy + 41, { size: 1 });
    this.renderer.drawText("wisely and manage your resources to earn favor and", 15, oy + 49, { size: 1 });
    this.renderer.drawText("continue your service to the village.", 15, oy + 57, { size: 1 });

    this.ui.drawButton('Start simple', 108, 125, () => {
      this.screenTransition.startTransition(() => {
        gameData.newGame(true);
        gameStateMachine.setState(gameStateFactory());
      }, 50);
    });

    this.ui.drawButton('Take me to the forge!', 85, 145, () => {
      this.screenTransition.startTransition(() => {
        gameData.newGame(false);
        gameStateMachine.setState(gameStateFactory());
      }, 50);
    });

    this.ui.drawButton('Prev page', 15, 180, () => {
      this.pageSelected = 1;
    });
  }
}

export const tutorialState = () => new TutorialState();
