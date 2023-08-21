import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class AnvilComponent extends Component {
  /**
   * @deprecated The method should not be used
   */
  public hasItemOn: boolean = false;

  /**
   * @deprecated The method should not be used
   */
  public placedItemId?: string = undefined;

  public isPlacedItemReady: boolean = false;
  
  constructor() {
    super(ComponentTypes.Anvil);
  }
}
