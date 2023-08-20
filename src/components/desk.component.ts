import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class DeskComponent extends Component {
  constructor() {
    super(ComponentTypes.Desk);
  }
}
