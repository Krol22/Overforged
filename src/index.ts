import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';
import { gameState } from './game-states/game.state';

createGameStateMachine(gameState);

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
