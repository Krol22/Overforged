import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { aabb } from '@/utils/aabb';

const debug = false;

export class OverlapSystem extends System {
  public playerEntity: Entity;
  public renderer: Renderer;

  constructor(playerEntity: Entity, renderer: Renderer) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Sprite,
      ComponentTypes.Position,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
  }

  public update(_dt: number): void {
    const playerPositionComponent = this.playerEntity.getComponent<PositionComponent>(ComponentTypes.Position);
    const playerSpriteComponent = this.playerEntity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

    this.systemEntities.map((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      interactionComponent.isOverlaping = interactionComponent.canInteractWith && aabb(
        playerPositionComponent.x,
        playerPositionComponent.y,
        playerSpriteComponent.sw,
        playerSpriteComponent.sh,
        positionComponent.x + interactionComponent.box.x,
        positionComponent.y + interactionComponent.box.y,
        interactionComponent.box.w,
        interactionComponent.box.h,
      );

      if (debug && spriteComponent.visible) {
        const color = interactionComponent.isOverlaping ? '#f00' : '#0ff';

        this.renderer.drawRect(
          positionComponent.x + interactionComponent.box.x,
          positionComponent.y + interactionComponent.box.y,
          interactionComponent.box.w,
          interactionComponent.box.h,
          {
            color,
            lineWidth: 2,
          },
        );
      }
    });
  }
}
