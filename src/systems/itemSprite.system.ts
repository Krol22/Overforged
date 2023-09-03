import { ComponentTypes } from '@/components/component.types';
import { PickableComponent } from '@/components/pickable.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';
import { setSpriteCoords } from '@/utils/setSpriteCoords';

export class ItemSpriteSystem extends System {
  constructor() {
    super([
      ComponentTypes.Pickable,
      ComponentTypes.Sprite,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      const pickableComponent = entity.getComponent<PickableComponent>(ComponentTypes.Pickable);

      setSpriteCoords(pickableComponent.item, spriteComponent);
    });
  }
}
