import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class ItemHolderComponent extends Component {
  public droppedEntityId?: string = undefined;
  public pickedEntityId?: string = undefined;

  public hasItemOn: boolean = false;
  public holdingItemId?: string = undefined;

  constructor() {
    super(ComponentTypes.ItemHolder);
  }
}
