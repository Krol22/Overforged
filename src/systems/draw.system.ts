import { ComponentTypes } from '@/components/component.types';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class DrawSystem extends System {
  public update(_dt: number): void {
  }

  constructor(public readonly renderer: Renderer) {
    super([
      ComponentTypes.Position,
      ComponentTypes.Sprite,
    ]);
  }

  public draw(): void {
    this.systemEntities.map((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

      if (!spriteComponent.visible) {
        return;
      }

      if (spriteComponent.color) {
        this.renderer.drawRect(
          positionComponent.x,
          positionComponent.y,
          spriteComponent.dw,
          spriteComponent.dh,
          {
            color: spriteComponent.color,
          },
        );

        return;
      }

      this.renderer.drawSprite(
        spriteComponent.sx,
        spriteComponent.sy,
        spriteComponent.sw,
        spriteComponent.sh,
        positionComponent.x,
        positionComponent.y,
        spriteComponent.dw,
        spriteComponent.dh,
        {
          rotate: spriteComponent.rotate,
          flipX: spriteComponent.flipX,
          transformOriginX: spriteComponent.transformOriginX,
          transformOriginY: spriteComponent.transformOriginY,
        }
      );
    });
  }
}
