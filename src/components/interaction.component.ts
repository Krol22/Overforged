import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class InteractionComponent extends Component {
  public isOverlaping: boolean = false;
  public canInteractWith: boolean = true;
  public emptyLabel?: string;
  public withItemLabel?: string;

  constructor(labels: { emptyLabel?: string, withItemLabel?: string } = {}) {
    super(ComponentTypes.Interaction);

    this.emptyLabel = labels.emptyLabel;
    this.withItemLabel = labels.withItemLabel;
  }
}
