import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export enum Item {
  coal = 'coal',
  steel = 'steel',
  hotSteel = 'hot-steel',

  horseShoe = 'horse-shoe',

  dagger1 = 'dagger1', // from hot-steel to anvil
  dagger = 'dagger', // from anvil to sharpener

  sword1 = 'sword1', // from hot-steel to anvil
  sword2 = 'sword2', // from anvil to furnace,
  sword3 = 'sword3', // from furnace to anvil
  sword4 = 'sword4', // from anvil to anvil,
  sword = 'sword', // from anvil to sharpener

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
