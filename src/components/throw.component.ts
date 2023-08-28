import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class ThrowComponent extends Component {
  public isPiercing: boolean;
  public damage: number;
  public rotationSpeed: number;

  constructor(damage: number, isPiercing: boolean) {
    super(ComponentTypes.Throw);

    this.damage = damage;
    this.isPiercing = isPiercing;

    this.rotationSpeed = 0.01;
  }
}
