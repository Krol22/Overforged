import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class DropzoneSystem extends System {
  private playerEntity: Entity;
  private renderer: Renderer;

  constructor(playerEntity: Entity, renderer: Renderer) {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Interaction,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
  } 

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);
    
    this.systemEntities.map((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      funnelComponent.canUseEntityId = undefined;

      if (funnelComponent.isLocked) {
        return;
      }

      if (!playerPlayerComponent.pickedItem) {
        return;
      }

      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!interactionComponent.isOverlaping) {
        return;
      }

      const item = this.getEntity(playerPlayerComponent.pickedItem);
      const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);

      if (!funnelComponent.itemTypes.includes(pickableComponent.item)) {
        return;
      }

      funnelComponent.canUseEntityId = item.id;
      const text = `Press <SPACE> to drop ${pickableComponent.item} in ${funnelComponent.name}`;
      const textWidth = text.length * 5;

      this.renderer.drawText(
        text,
        Math.floor(this.renderer.canvasWidth / 2 - textWidth / 2),
        this.renderer.canvasHeight - 10,
        { size: 1 },
      );
    });
  }
}
