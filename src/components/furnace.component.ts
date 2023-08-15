import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class FurnaceComponent extends Component {
  constructor() {
    super(ComponentTypes.Furnace);
  }
}
