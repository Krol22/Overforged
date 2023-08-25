import { ComponentTypes } from '@/components/component.types';
import { PickableComponent } from '@/components/pickable.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';

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

      switch(pickableComponent.item) {
        case Item.tool:
        case Item.tool1:
        case Item.tool2:
          spriteComponent.sx = 0;
          spriteComponent.sy = 28;
          spriteComponent.sw = 8;
          spriteComponent.sh = 8;
          spriteComponent.dw = 8;
          spriteComponent.dh = 8;

          break;
        case Item.weapon:
        case Item.weapon1:
        case Item.weapon2:
        case Item.weapon3:
        case Item.weapon4:
          spriteComponent.sx = 0;
          spriteComponent.sy = 36;
          spriteComponent.sw = 10;
          spriteComponent.sh = 10;
          spriteComponent.dw = 10;
          spriteComponent.dh = 10;
          
          break;
        case Item.hotSteel:
          spriteComponent.sx = 27;
          spriteComponent.sy = 0;
          spriteComponent.sw = 7;
          spriteComponent.sh = 7;
          spriteComponent.dw = 7;
          spriteComponent.dh = 7;

          break;
        case Item.horseShoe:
          spriteComponent.sx = 20;
          spriteComponent.sy = 2;
          spriteComponent.sw = 7;
          spriteComponent.sh = 6;
          spriteComponent.dw = 7;
          spriteComponent.dh = 6;

          break;
      }
    });
  }
}
