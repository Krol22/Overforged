import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class PlayerComponent extends Component {
  ax: number = 0;
  ay: number = 0;
  vx: number = 0;
  vy: number = 0;

  pickedItem?: string;

  constructor() {
    super(ComponentTypes.Player);
  }
}
