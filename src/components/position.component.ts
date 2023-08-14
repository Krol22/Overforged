import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class PositionComponent extends Component {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    super(ComponentTypes.Position);

    this.x = x;
    this.y = y;
  }
}
