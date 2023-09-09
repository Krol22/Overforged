import { gameData } from '@/core/gameData';
import { Renderer } from '@/core/renderer';
import { ScreenTransition } from '@/core/screen-transition';
import { State } from '@/core/state';
import { UI } from '@/core/ui';
import { gameStateMachine } from '@/game-state-machine';
import { gameStateFactory } from './game.state';
import { tutorialState } from './tutorial.state';

const subtext = [
  "* The forge waits for no one.",
  "* Each strike shapes your destiny.",
  "* A displeased Lord is bad for business.",
  "* Quality over quantity, always.",
  "* The echo of the hammer writes history.",
  "* In every strike, a spark of possibility."
];

const rollText = () => {
  const index = Math.floor(Math.random() * 3);
  return subtext[index];
};

class MenuState implements State {
  private readonly renderer: Renderer;
  private readonly ui: UI;
  private readonly screenTransition: ScreenTransition;
  private readonly text: string;

  constructor() {
    const canvas = document.querySelector('#canvas');
    this.renderer = new Renderer(canvas);
    this.screenTransition = new ScreenTransition(this.renderer);
    this.ui = new UI(this.renderer, gameData);

    this.text = rollText();

    this.screenTransition.startTransition(() => {}, 50, true);
  }

  onEnter() {};

  onUpdate(_: number) {
    this.renderer.clear();
    this.renderer.drawRect(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight, { color: '#182424', fill: true });

    const ox = 74;
    const oy = 30;

    this.renderer.drawSprite(80, 0, 10, 10, ox + 82, oy + 13, 40, 40, {
      rotate: Math.PI,
    });

    this.renderer.drawSprite(80, 0, 10, 10, ox + 72, oy + 13, 40, 40, {
      rotate: Math.PI / 2,
    });


    this.renderer.drawText("O er", ox + 0, oy - 1, { size: 4 });
    this.renderer.drawText("forged", ox + 36, oy + 25, { size: 4 });

    this.renderer.drawText("Anvil, Hammer, Legacy", ox + 71, oy + 59, {
      size: 1,
      centered: true,
      color: { r: 200, g: 200, b: 200 } });

    this.renderer.drawText(this.text, 10, this.renderer.canvasHeight / 2 - 15, {
      size: 1,
      color: { r: 200, g: 200, b: 200 } });

    this.renderer.drawSprite(20, 2, 7, 6, ox + 18, oy + 2, 21, 18, { rotate: Math.PI });

    let by = -20;

    // Add continue after implementing save game
    if (0) {
      by = 0;
      this.ui.drawButton('Continue', ox + 40, oy + 70, () => {});
    }

    this.ui.drawButton('Learn the craft!', ox + 25, by + oy + 105, () => {
      this.screenTransition.startTransition(() => {
        gameStateMachine.setState(tutorialState());
      }, 50);
    });
    this.ui.drawButton('Take me to the forge!', ox + 12, by + oy + 125, () => {
      this.screenTransition.startTransition(() => {
        gameData.newGame(false);
        gameStateMachine.setState(gameStateFactory());
      }, 50);
    });

    this.screenTransition.update();
  }

  // onLeave(): boolean {
    // this.renderer.drawRect(0, 0, this.canvasWidth, this.canvasHeight);
  // }
}

export const menuState = new MenuState();
