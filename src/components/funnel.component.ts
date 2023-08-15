import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export class FunnelComponent extends Component {
  public itemTypes: Array<Item> = [];
  public name: string = '';

  constructor(itemTypes: Array<Item>, name: string) {
    super(ComponentTypes.Funnel);

    this.itemTypes = itemTypes;
    this.name = name;
  }
}
