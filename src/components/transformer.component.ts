import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export const anvilTransformerDefinition = {
  [Item.weapon2]: Item.weapon3,
};

export const furnaceTransformerDefinition = {
  [Item.steel]: Item.hotSteel,
  [Item.weapon1]: Item.weapon2,
};

export const sharpenerTransformerDefinition = {
  [Item.weapon3]: Item.weapon,
  [Item.axe1]: Item.axe,
};

export class TransformerComponent extends Component {
  public definition: Partial<Record<Item, Item>>;

  constructor(definition: Partial<Record<Item, Item>>) {
    super(ComponentTypes.Transformer);

    this.definition = definition;
  }

  transform(item: Item): Item {
    if (!this.definition[item]) {
      throw new Error('TransformerComponent doesn`t have ');
    }

    return this.definition[item] as Item;
  }
}
