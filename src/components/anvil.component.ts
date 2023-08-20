import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class AnvilComponent extends Component {
  public hasHotSteel: boolean = false;

  public hasItemOn: boolean = false;
  public placedItemId?: string = undefined;
  public isPlacedItemReady: boolean = false;
  
  constructor() {
    super(ComponentTypes.Anvil);
  }
}
