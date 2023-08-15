import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class PlayerComponent extends Component {
  ax: number = 0;
  ay: number = 0;
  vx: number = 0;
  vy: number = 0;

  pickedItem?: string;
  hadItemPicked: boolean = false;
  // picketItem can change during the frame in the majority of the systems. This will be extra flag to add some fixes

  constructor() {
    super(ComponentTypes.Player);
  }
}
