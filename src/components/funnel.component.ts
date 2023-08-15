import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export class FunnelComponent extends Component {
  public itemTypes: Array<Item> = [];

  constructor(itemTypes: Array<Item>) {
    super(ComponentTypes.Funnel);

    this.itemTypes = itemTypes;
  }
}
