import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class PhysicsComponent extends Component {
  ax: number = 0;
  ay: number = 0;
  vx: number = 0;
  vy: number = 0;

  affectedByGravity: boolean = false;

  constructor() {
    super(ComponentTypes.Physics);
  }
}
