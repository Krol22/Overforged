import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export class PickableComponent extends Component {
  public isPicked: boolean = true;
  public item: Item = Item.coal;

  constructor(item: Item) {
    super(ComponentTypes.Pickable);

    this.item = item;
  }
}
