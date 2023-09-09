import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';
import { gameStateFactory } from './game-states/game.state';
import { menuState } from './game-states/menu.state';
import { gameOverState } from './game-states/gameOver.state';
import { tutorialState } from './game-states/tutorial.state';

// createGameStateMachine(gameStateFactory());
// createGameStateMachine(menuState);
// createGameStateMachine(gameOverState);
createGameStateMachine(tutorialState());

let previousTime = 0;
const interval = 1000 / 60;

(function draw(currentTime: number) {
  const delta = currentTime - previousTime;

  if (delta >= interval) {
    previousTime = currentTime - (delta % interval);

    controls.queryController();
    gameStateMachine.getState().onUpdate(delta);
  }

  requestAnimationFrame(draw);
})(0);
