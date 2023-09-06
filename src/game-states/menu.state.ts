import { gameData } from '@/core/gameData';
import { Renderer } from '@/core/renderer';
import { ScreenTransition } from '@/core/screen-transition';
import { State } from '@/core/state';
import { UI } from '@/core/ui';
import { gameStateMachine } from '@/game-state-machine';
import { gameState } from './game.state';

class MenuState implements State {
  private readonly renderer: Renderer;
  private readonly ui: UI;
  private readonly screenTransition: ScreenTransition;

  constructor() {
    const canvas = document.querySelector('#canvas');
    this.renderer = new Renderer(canvas);
    this.screenTransition = new ScreenTransition(this.renderer);
    this.ui = new UI(this.renderer, gameData);
  }

  onEnter() {};

  onUpdate(_: number) {
    this.renderer.clear();
    this.renderer.drawRect(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight, { color: '#182424', fill: true });

    const ox = 78;
    const oy = 40;

    this.renderer.drawSprite(0, 36, 10, 10, ox + 80, 42, 40, 40, {
      rotate: Math.PI,
    });

    this.renderer.drawSprite(0, 36, 10, 10, ox + 70, 42, 40, 40, {
      rotate: Math.PI / 2,
    });


    this.renderer.drawText("O er", ox + 0, oy + 0, { size: 4 });
    this.renderer.drawText("forged", ox + 36, oy + 25, { size: 4 });

    this.renderer.drawSprite(20, 2, 7, 6, ox + 18, oy + 2, 21, 18, { rotate: Math.PI });

    let by = -20;

    // Add continue after implementing save game
    if (0) {
      by = 0;
      this.ui.drawButton('Continue', ox + 40, oy + 70, () => {});
    }

    this.ui.drawButton('Tutorial', ox + 40, by + oy + 90, () => {});
    this.ui.drawButton('New game', ox + 40, by + oy + 110, () => {
      this.screenTransition.startTransition(() => {
        gameStateMachine.setState(gameState);
      }, 50);
    });

    this.screenTransition.update();
  }

  // onLeave(): boolean {
    // this.renderer.drawRect(0, 0, this.canvasWidth, this.canvasHeight);
  // }
}

export const menuState = new MenuState();
