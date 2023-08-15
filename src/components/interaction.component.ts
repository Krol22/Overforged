import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class InteractionComponent extends Component {
  public isOverlaping: boolean = false;

  constructor() {
    super(ComponentTypes.Interaction);
  }
}
