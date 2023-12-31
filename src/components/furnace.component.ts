import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class FurnaceComponent extends Component {
  // Increases when there is a fuel, decreases when there is no fuel
  public temperature: number = 0;

  // This will indicate how much fuel - coal - furnace have
  public fuel: number = 0;

  // This will count dont to decreas fuel amount
  public fuelCounter: number = 0;

  /**
   * @deprecated The method should not be used
   */
  public hasItemInside: boolean = false;

  /**
   * @deprecated The method should not be used
   */
  public heatingEntityId?: string = undefined;
  public entityHeated: boolean = false;

  constructor() {
    super(ComponentTypes.Furnace);
  }
}
