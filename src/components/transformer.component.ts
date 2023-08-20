import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';
import { Item } from './spawner.component';

export const anvilTransformerDefinition = {
  [Item.sword2]: Item.sword3,
  [Item.sword3]: Item.sword4,

  [Item.axe1]: Item.axe2,
};

export const furnaceTransformerDefinition = {
  [Item.steel]: Item.hotSteel,
  [Item.sword1]: Item.sword2,
};

export const sharpenerTransformerDefinition = {
  [Item.dagger1]: Item.dagger,
  [Item.sword4]: Item.sword,
  [Item.axe2]: Item.axe,
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
