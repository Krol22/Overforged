import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { Entity, System } from '@/core/ecs';
import { aabb } from '@/utils/aabb';

export class OverlapSystem extends System {
  public playerEntity: Entity;

  constructor(playerEntity: Entity) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Sprite,
      ComponentTypes.Position,
    ]);

    this.playerEntity = playerEntity;
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
        playerSpriteComponent.srcW,
        playerSpriteComponent.srcH,
        positionComponent.x,
        positionComponent.y,
        spriteComponent.srcW,
        spriteComponent.srcH,
      );
    });
  }
}
