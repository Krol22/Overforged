import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export class CustomerComponent extends Component {
  public wantsToBuy: Array<Item>;
  public bought: boolean;
  public waits: number;
  public isLeaving: boolean;

  constructor(items: Array<Item>) {
    super(ComponentTypes.Customer);

    this.wantsToBuy = items;
    this.bought = false;
    this.waits = 0;
    this.isLeaving = false;
  }
}
