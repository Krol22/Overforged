import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class EnemyComponent extends Component {
  private hitBy: Array<string> = [];

  constructor() {
    super(ComponentTypes.Enemy);
  }

  addCollidedWeapon(id: string) {
    this.hitBy.push(id);
  }

  wasAlreadyHitBy(id: string) {
    return this.hitBy.includes(id);
  }
}
