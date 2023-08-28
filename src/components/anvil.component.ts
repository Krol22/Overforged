import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class AnvilComponent extends Component {
  constructor() {
    super(ComponentTypes.Anvil);
  }
}
