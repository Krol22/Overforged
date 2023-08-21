import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export class PickableComponent extends Component {
  public isPicked: boolean = false;
  public item: Item = Item.coal;
  public disposable: boolean = false;

  constructor(item: Item, disposable: boolean = false) {
    super(ComponentTypes.Pickable);

    this.item = item;
    this.disposable = disposable;
  }
}
