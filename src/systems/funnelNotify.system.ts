import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { FloorLevel } from '@/consts';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class FunnelNotifySystem extends System {
  constructor(
    private readonly playerEntity: Entity,
    private readonly renderer: Renderer,
  ) {
    super([ComponentTypes.Position, ComponentTypes.Sprite, ComponentTypes.Funnel]);
  } 

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      if (!playerPlayerComponent.previousPickedItem) {
        return;
      }

      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);

      const item = this.getEntity(playerPlayerComponent.previousPickedItem);
      const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);

      if (funnelComponent.isLocked && !pickableComponent.disposable) {
        return;
      }

      if (funnelComponent.itemTypes.includes(pickableComponent.item)) {
        this.renderer.drawSprite(
          37, 12, 7, 11,
          positionComponent.x + spriteComponent.dw / 2 - 3, FloorLevel + 10, 7, 11
        );
      }
    });


  }
}
