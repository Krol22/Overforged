import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export const MaxSharpingTime = 100;

export class SharpenerComponent extends Component {
  public sharpingSpeed = 1;

  public sharpenerCount = 0;

  constructor() {
    super(ComponentTypes.Sharpener);
  }
}
