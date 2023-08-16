import { ComponentTypes } from '@/components/component.types';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { SteelComponent } from '@/components/steel.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class DrawSystem extends System {
  constructor(public readonly renderer: Renderer) {
    super([
      ComponentTypes.Position,
      ComponentTypes.Sprite,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

      const steelComponent = entity.getComponent<SteelComponent>(ComponentTypes.Steel);

      if (!spriteComponent.visible) {
        return;
      }

      if (!steelComponent) {
        this.renderer.drawSprite(
          positionComponent.x,
          positionComponent.y,
          spriteComponent.srcW,
          spriteComponent.srcH,
          spriteComponent.color,
        );

        return;
      }

      const color = steelComponent.isHeated ? '#ff0' : '#ddd';
      this.renderer.drawSprite(
        positionComponent.x,
        positionComponent.y,
        spriteComponent.srcW,
        spriteComponent.srcH,
        color,
      );
    });
  }
}
