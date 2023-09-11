import { createGameStateMachine, gameStateMachine } from './game-state-machine';
import { controls } from '@/core/controls';
import { menuState } from './game-states/menu.state';

createGameStateMachine(menuState);

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


window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', resizeGameContainer, false);
    resizeGameContainer();
});

function resizeGameContainer() {
    const gameContainer = document.querySelector('.game');
    const canvas = document.getElementById('canvas');

    if (!gameContainer || !canvas) return;

    const originalWidth = 610;
    const originalHeight = 400;

    const margin = 32;
    const aspectRatio = originalWidth / originalHeight;

    const windowWidth = window.innerWidth - 2 * margin;
    const windowHeight = window.innerHeight - 2 * margin;

    let newWidth = windowWidth;
    let newHeight = newWidth / aspectRatio;

    if (newHeight > windowHeight) {
        newHeight = windowHeight;
        newWidth = newHeight * aspectRatio;
    }

    const scaleFactor = newWidth / originalWidth;
    gameContainer.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
}
