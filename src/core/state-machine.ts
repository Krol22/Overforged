import { State } from './state';

export class StateMachine {
  // Current state
  private cs: State;

  constructor(initialState: State, ...enterArgs: any) {
    this.cs = initialState;
    this.cs.onEnter?.(...enterArgs);
  }

  setState(newState: State, ...enterArgs: any) {
    this.cs.onLeave?.();
    this.cs = newState;
    this.cs.onEnter?.(...enterArgs);
  }

  getState() {
    return this.cs;
  }
}
