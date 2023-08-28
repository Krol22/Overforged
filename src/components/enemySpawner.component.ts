import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class EnemySpawnerComponent extends Component {
  public maxSpawnerTime: number;

  public currentTime: number;

  constructor(maxSpawnerTime: number) {
    super(ComponentTypes.EnemySpawner);

    this.maxSpawnerTime = maxSpawnerTime;
    this.currentTime = maxSpawnerTime;
  }

  count() {
    this.currentTime -= 0.1;
  }

  restart() {
    const randomSpawnerTime = Math.random() * (this.maxSpawnerTime - 0.5) + 0.5;
    this.currentTime = randomSpawnerTime;
  }
}
