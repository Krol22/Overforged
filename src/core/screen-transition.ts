import { Renderer } from './renderer';

export class ScreenTransition {
  private isTransitioning: boolean = false;
  private transitionCounter: number = 0;
  private transitionTime: number = 1000;

  private direction: number = 1;

  private callback: () => void = () => {};

  constructor(
    private readonly renderer: Renderer,
  ) {}

  startTransition(callback: () => void, time: number, backwards?: boolean) {
    this.isTransitioning = true;
    this.callback = callback;
    this.transitionTime = time;
    this.direction = 1;

    if (backwards) {
      this.direction = -1;
      this.transitionCounter = time;
    }
  }

  update() {
    const percentage = easeInOut(this.transitionCounter / this.transitionTime);

    this.renderer.drawRect(
      0,
      0,
      this.renderer.canvasWidth / 2 * (percentage),
      this.renderer.canvasHeight,
      { fill: true, color: '#111' },
    );

    if (this.isTransitioning) {
      this.transitionCounter += 1 * this.direction;
    } else {
      return;
    }

    if (this.direction > 0) {
      if (this.transitionCounter > this.transitionTime) {
        this.isTransitioning = false;
        this.transitionCounter = 0;

        this.callback();
      }
    }

    if (this.direction < 0) {
      if (this.transitionCounter <= 0) {
        this.isTransitioning = false;
        this.transitionCounter = 0;

        this.callback();
      }
    }
  }
}

function easeInOut(t: number): number {
  if (t < 0.5) {
    // ease in
    return 2 * t * t;
  } else {
    // ease out
    return 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}
