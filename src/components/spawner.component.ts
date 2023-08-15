import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export enum Item {
  coal = 'coal',
  iron = 'iron',
}

export class SpawnerComponent extends Component {
  itemType: Item;

  constructor(itemType: Item) {
    super(ComponentTypes.Spawner);

    this.itemType = itemType;
  }
}
