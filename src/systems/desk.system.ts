import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { PlayerComponent } from '@/components/player.component';
import { SpriteComponent } from '@/components/sprite.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';

export class DeskSystem extends System {
  public playerEntity: Entity;

  constructor(playerEntity: Entity) {
    super([
      ComponentTypes.Desk,
      ComponentTypes.ItemHolder,
      ComponentTypes.Funnel,
    ]);

    this.playerEntity = playerEntity;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.forEach((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);

      // if (funnelComponent.canUseEntityId) {
        // if (controls.isConfirm && !controls.previousState.isConfirm) {
          // const item = this.getEntity(funnelComponent.canUseEntityId);

          // const spriteComponent = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
          // playerPlayerComponent.pickedItem = undefined;
          // spriteComponent.visible = false;
          // this.markToRemove(item.id);
        // }
      // }
    });
  }
}
