import { ComponentTypes } from '@/components/component.types';
import { PickableComponent } from '@/components/pickable.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { FloorLevel } from '@/consts';
import { Entity, System } from '@/core/ecs';
import { UI } from '@/core/ui';

export class PickupsSystem extends System {
  public playerEntity: Entity;
  public ui: UI;

  constructor(playerEntity: Entity, ui: UI) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Position,
      ComponentTypes.Pickable,
    ]);

    this.playerEntity = playerEntity;
    this.ui = ui;
  }

  public update(_dt: number): void {
    const playerPositionComponent = this.playerEntity.getComponent<PositionComponent>(ComponentTypes.Position);
    const playerSpriteComponent = this.playerEntity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

    this.systemEntities.map((entity) => {
      const pickableComponent = entity.getComponent<PickableComponent>(ComponentTypes.Pickable);
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

      const { x, y } = getPickableOffset(pickableComponent.item);

      positionComponent.x = Math.floor(playerPositionComponent.x + spriteComponent.dw / 2) + x;
      positionComponent.y = FloorLevel + y;
      spriteComponent.flipX = playerSpriteComponent.flipX;
    });
  }
}

function getPickableOffset(type: Item): { x: number, y: number } {
  if (type === Item.coal) {
    return { x: -0, y: -12 };
  }

  if (type === Item.steel) {
    return { x: 0, y: -12 };
  }

  if (type === Item.hotSteel) {
    return { x: 0, y: -12 };
  }

  if ([Item.weapon1, Item.weapon2, Item.weapon3, Item.weapon].includes(type)) {
    return { x: -4, y: -12 };
  }

  if ([Item.axe1, Item.axe].includes(type)) {
    return { x: -4, y: -12 };
  }

  return { x: 0, y: -12 };
};
