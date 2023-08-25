import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class PickupBlockerComponent extends Component {
  constructor() {
    super(ComponentTypes.PickupBlocker);
  }
}
