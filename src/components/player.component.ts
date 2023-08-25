import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class PlayerComponent extends Component {
  pickedItem?: string;
  previousPickedItem?: string;
  // picketItem can change during the frame in the majority of the systems. This will be extra flag to add some fixes
  hadItemPicked: boolean = false;
  hasMoveLocked: boolean = false;

  constructor() {
    super(ComponentTypes.Player);
  }
}
