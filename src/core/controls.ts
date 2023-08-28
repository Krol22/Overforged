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

  keyMap: Map<string, boolean> = new Map();
  previousState = {
    is1: this.is1,
    is2: this.is2,
    is3: this.is3,
    isX: this.isX,
    isConfirm: this.isConfirm,
    isEscape: this.isEscape
  };

  constructor() {
    document.addEventListener('keydown', event => this.toggleKey(event, true));
    document.addEventListener('keyup', event => this.toggleKey(event, false));
    this.inputDirection = new DOMPoint();
  }

  queryController() {
    this.previousState.isConfirm = this.isConfirm;
    this.previousState.isEscape = this.isEscape;
    this.previousState.isX = this.isX;

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
  }

  private toggleKey(event: KeyboardEvent, isPressed: boolean) {
    this.keyMap.set(event.code, isPressed);
  }
}

export const controls = new Controls();
