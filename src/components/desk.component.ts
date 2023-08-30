import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export class DeskComponent extends Component {
  public storedItems: Array<Item> = [];

  constructor() {
    super(ComponentTypes.Desk);
  }

  addItem(item: Item) {
    this.storedItems.push(item);
  }

  removeItem(item: Item) {
    const index = this.storedItems.findIndex((i) => item === i);
    this.storedItems.splice(index, 1);
  }

  hasItem(item: Item): boolean {
    return this.storedItems.includes(item);
  }
}
