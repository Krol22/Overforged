import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { Entity, System } from '@/core/ecs';

export class FunnelSystem extends System {
  private playerEntity: Entity;

  constructor(playerEntity: Entity) {
    super([ComponentTypes.Funnel, ComponentTypes.Interaction]);
    
    this.playerEntity = playerEntity;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      funnelComponent.canUseEntityId = undefined;

      if (funnelComponent.isLocked) {
        return;
      }

      if (!interactionComponent.isOverlaping) {
        return;
      }

      if (playerPlayerComponent.pickedItem) {
        const item = this.getEntity(playerPlayerComponent.pickedItem);
        const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
        if (funnelComponent.itemTypes.includes(pickableComponent.item)) {
          funnelComponent.canUseEntityId = item.id;
        }
      }
    });
  }
}
