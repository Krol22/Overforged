import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export const enum Item {
  coal = 'Coal',
  steel = 'Steel',
  hotSteel = 'Hot Steel',

  horseShoe = 'Horse Shoe',

  weapon1 = 'Forged Blade', // from hot-steel to anvil
  weapon2 = 'Heated Blade', // from anvil to furnace,
  weapon3 = 'Sword', // from furnace to anvil
  weapon = 'Sharpened Sword', // from anvil to sharpener

  axe1 = 'Axe', // from hot-sceel to anvil
  axe = 'Sharpened Axe', // from anvil to sharpener
}

export class SpawnerComponent extends Component {
  itemType: Item;

  constructor(itemType: Item) {
    super(ComponentTypes.Spawner);

    this.itemType = itemType;
  }
}
