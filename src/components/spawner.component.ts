import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export enum Item {
  coal = 'coal',
  steel = 'steel',
  hotSteel = 'hot-steel',

  horseShoe = 'horse-shoe',

  weapon1 = 'weapon1', // from hot-steel to anvil
  weapon2 = 'weapon2', // from anvil to furnace,
  weapon3 = 'weapon3', // from furnace to anvil
  weapon4 = 'weapon4', // from anvil to anvil,
  weapon = 'weapon', // from anvil to sharpener

  tool1 = 'tool1', // from hot-sceel to anvil
  tool2 = 'tool2', // from anvil to anvil
  tool = 'tool', // from anvil to sharpener
}

export class SpawnerComponent extends Component {
  itemType: Item;

  constructor(itemType: Item) {
    super(ComponentTypes.Spawner);

    this.itemType = itemType;
  }
}
