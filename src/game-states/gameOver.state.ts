import { gameData } from '@/core/gameData';
import { Renderer } from '@/core/renderer';
import { ScreenTransition } from '@/core/screen-transition';
import { State } from '@/core/state';
import { UI } from '@/core/ui';
import { gameStateMachine } from '@/game-state-machine';
import { gameStateFactory } from './game.state';
import { tutorialState } from './tutorial.state';

const subtext = [
  "Even the finest smiths endure setbacks.",
  "Failure is the anvil on which success is forged.",
  "The forge grows cold, but your spirit need not.",
  "In each loss, the seeds of a new victory are sown.",
  "Mistakes are the sparks that can ignite greater skill.",
  "Your anvil awaits; it's never too late to start anew."
];

const rollText = () => {
  const index = Math.floor(Math.random() * 3);
  return subtext[index];
};

class GameOverState implements State {
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
  }

  onEnter() {
    this.screenTransition.startTransition(() => {}, 50, true);
  };

  onUpdate(_: number) {
    this.renderer.clear();
    this.renderer.drawRect(0, 0, this.renderer.canvasWidth, this.renderer.canvasHeight, { color: '#181818', fill: true });

    const ox = 85;
    const oy = 20;

    this.renderer.drawText("Game over", ox + 0, oy + 0, { size: 3 });
    this.renderer.drawText("Alas, the Lord is most infuriated!", ox - 17, oy + 35, { size: 1 });
    this.renderer.drawText("The villagers murmur in discontent,", ox - 19, oy + 45, { size: 1 });
    this.renderer.drawText("and you have lost their trust. Your", ox - 20, oy + 55, { size: 1 });
    this.renderer.drawText("service to the village is at an end.", ox - 21, oy + 65, { size: 1 });
    this.renderer.drawText(`You managed to keep the forge burning for ${gameData.day} days,`, ox - 52, oy + 90, { size: 1 });
    this.renderer.drawText(`crafting wares for a total of ${gameData.clientsHandled} villagers.`, ox - 39, oy + 100, { size: 1 });

    this.ui.drawButton('Refine Your Skills', ox + 12, oy + 120, () => {
      this.screenTransition.startTransition(() => {
        gameStateMachine.setState(tutorialState());
      }, 50);
    });

    this.ui.drawButton('Another Round!', ox + 22, oy + 140, () => {
      this.screenTransition.startTransition(() => {
        gameData.newGame(false);
        gameStateMachine.setState(gameStateFactory());
      }, 50);
    });

    this.renderer.drawText(`"${this.text}"`, 151, this.renderer.canvasHeight / 2 - 10, {
      size: 1,
      color: { r: 200, g: 200, b: 200 },
      centered: true,
    });


    this.screenTransition.update();
  }
}

export const gameOverState = new GameOverState();
