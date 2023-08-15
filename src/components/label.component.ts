import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class LabelComponent extends Component {
  text: string = '';

  constructor(text: string) {
    super(ComponentTypes.Label);

    this.text = text;
  }
}
