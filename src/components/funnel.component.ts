import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export class FunnelComponent extends Component {
  public itemTypes: Array<Item> = [];
  public name: string = '';

  public canUseEntityId?: string = undefined;
  public isLocked = false;

  constructor(itemTypes: Array<Item>, name: string) {
    super(ComponentTypes.Funnel);

    this.itemTypes = itemTypes;
    this.name = name;
  }

  isValidItem(item: Item) {
    return this.itemTypes.includes(item);
  }
}
