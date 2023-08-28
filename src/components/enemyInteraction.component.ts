import { Component } from '@/core/ecs';
import { Box } from '@/utils/box';
import { ComponentTypes } from './component.types';

// different because interaction is reserved for player
export class EnemyInteractionComponent extends Component {
  public isOverlaping: boolean = false;

  public canInteractWith: boolean = true;
  public emptyLabel?: string;
  public withItemLabel?: string;
  public priority: number;

  public box: Box;

  constructor(priority: number, box: Box) {
    super(ComponentTypes.EnemyInteraction);
    this.priority = priority;
    this.box = box;
  }
}
