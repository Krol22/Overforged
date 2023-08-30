import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class CustomerSpawnerComponent extends Component {
  public maxSpawnerTime: number;

  public currentTime: number;

  constructor(maxSpawnerTime: number) {
    super(ComponentTypes.CustomerSpawner);

    this.maxSpawnerTime = maxSpawnerTime;
    this.currentTime = 20; // spawn almost immediately
  }

  count() {
    this.currentTime -= 0.1;
  }

  restart() {
    const randomSpawnerTime = Math.random() * (this.maxSpawnerTime - 2) + 2;
    this.currentTime = randomSpawnerTime;
  }
}
