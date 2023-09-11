import { aabb } from '@/utils/aabb';

class Controls {
  isLeft = false;
  isRight = false;
  isConfirm = false;
  isEscape = false;
  is1 = false;
  is2 = false;
  is3 = false;
  isX = false;
  inputDirection: DOMPoint;

  mouseX: number = 0;
  mouseY: number = 0;
  isMouse1: boolean = false;
  isMouse1Pressed: boolean = false;

  keyMap: Map<string, boolean> = new Map();
  previousState = {
    is1: this.is1,
    is2: this.is2,
    is3: this.is3,
    isX: this.isX,
    isConfirm: this.isConfirm,
    isEscape: this.isEscape,
    isMouse1Pressed: this.isMouse1Pressed,
  };

  constructor() {
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    this.inputDirection = new DOMPoint();
  }

  registerMouseEvents(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const gameContainer = canvas.parentElement;

      if (!gameContainer) {
        return;
      }
      
      const style = window.getComputedStyle(gameContainer);
      const transform = style.transform || 'none';
      let scaleFactor = 1;

      if (transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        scaleFactor = parseFloat(values[0]); // Assuming uniform scaling
      }

      const x = (event.clientX - rect.left) / scaleFactor / 2;
      const y = (event.clientY - rect.top) / scaleFactor / 2;

      this.mouseX = x;
      this.mouseY = y;
    });

    canvas.addEventListener('mousedown', (event) => {
      if (event.button !== 0) {
        return;
      }

      this.isMouse1 = true;  
    });

    canvas.addEventListener('mouseup', (event) => {
      if (event.button !== 0) {
        return;
      }

      this.isMouse1 = false;  
    });
  }

  isHovered(x: number, y: number, width: number, height: number): boolean {
    return aabb(x, y, width, height, this.mouseX, this.mouseY, 1, 1);
  }

  isDown(x: number, y: number, width: number, height: number): boolean {
    if (!this.isHovered(x, y, width, height)) {
      return false;
    }

    return this.isMouse1Pressed;
  }

  isPressed(x: number, y: number, width: number, height: number): boolean {
    if (!this.isHovered(x, y, width, height)) {
      return false;
    }

    return this.isMouse1Pressed && !this.previousState.isMouse1Pressed;
  }

  queryController() {
    this.previousState.isConfirm = this.isConfirm;
    this.previousState.isEscape = this.isEscape;
    this.previousState.isX = this.isX;
    this.previousState.isMouse1Pressed = this.isMouse1Pressed;

    const leftVal = (this.keyMap.get('KeyA') || this.keyMap.get('ArrowLeft') || this.keyMap.get('KeyH')) ? -1 : 0;
    const rightVal = (this.keyMap.get('KeyD') || this.keyMap.get('ArrowRight') || this.keyMap.get('KeyL')) ? 1 : 0;
    const upVal = (this.keyMap.get('KeyW') || this.keyMap.get('ArrowUp')) ? -1 : 0;
    const downVal = (this.keyMap.get('KeyS') || this.keyMap.get('ArrowDown')) ? 1 : 0;
    this.inputDirection.x = (leftVal + rightVal);
    this.inputDirection.y = (upVal + downVal);

    this.isLeft = this.inputDirection.x < 0;
    this.isRight = this.inputDirection.x > 0;
    this.isConfirm = Boolean(this.keyMap.get('Space'));
    this.isEscape = Boolean(this.keyMap.get('Escape'));

    this.is1 = Boolean(this.keyMap.get('Digit1'));
    this.is2 = Boolean(this.keyMap.get('Digit2'));
    this.is3 = Boolean(this.keyMap.get('Digit3'));
    this.isX = Boolean(this.keyMap.get('KeyX'));

    this.isMouse1Pressed = this.isMouse1;
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.keyMap.set(event.code, isPressed);
  }
}

export const controls = new Controls();
