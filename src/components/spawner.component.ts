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
  weapon = 'weapon', // from anvil to sharpener

  axe1 = 'axe1', // from hot-sceel to anvil
  axe2 = 'axe2', // from anvil to anvil
  axe = 'axe', // from anvil to sharpener
}

export class SpawnerComponent extends Component {
  itemType: Item;

  constructor(itemType: Item) {
    super(ComponentTypes.Spawner);

    this.itemType = itemType;
  }
}
