import { Component } from '@/core/ecs';
import { Box } from '@/utils/box';
import { ComponentTypes } from './component.types';

export class InteractionComponent extends Component {
  public isOverlaping: boolean = false;
  public canInteractWith: boolean = true;
  public emptyLabel?: string;
  public withItemLabel?: string;
  public priority: number;

  public box: Box;

  constructor(priority: number, box: Box) {
    super(ComponentTypes.Interaction);
    this.priority = priority;
    this.box = box;
  }
}
