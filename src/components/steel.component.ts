import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export const MaxHeatLevel = 3000;

export class SteelComponent extends Component {
  public isHeated: boolean = false;
  public inFurnace: boolean = false;
  public heatCounter: number = 0;

  constructor() {
    super(ComponentTypes.Steel);
  }
}
