import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { ItemHolderComponent } from '@/components/itemHolder.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { Entity, System } from '@/core/ecs';
import { UI } from '@/core/ui';

export class DropzoneActionTextSystem extends System {
  constructor(
    private playerEntity: Entity,
    private ui: UI,
  )  {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Interaction,
      ComponentTypes.ItemHolder,
    ]);
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!interactionComponent.isOverlaping) {
        return;
      }

      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const itemHolderComponent = entity.getComponent<ItemHolderComponent>(ComponentTypes.ItemHolder);

      if (
        itemHolderComponent.hasItemOn && 
        !funnelComponent.isLocked && 
        !playerPlayerComponent.pickedItem
      ) {
        const item = this.getEntity(itemHolderComponent.holdingItemId);
        const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);

        this.ui.setActionText(`Take ${pickableComponent.item} from ${funnelComponent.name}.`);
        return;
      }

      let item;
      try {
        item = this.getEntity(playerPlayerComponent.pickedItem);
      } catch (e) {
        return;
      }

      const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
      const canUseEntityId = funnelComponent.isValidItem(pickableComponent.item);

      if (!canUseEntityId) {
        return;
      }

      if (pickableComponent.disposable || !itemHolderComponent.hasItemOn) {
        this.ui.setActionText(`Place ${pickableComponent.item} in ${funnelComponent.name}.`);
        return;
      }

      const holdItem = this.getEntity(itemHolderComponent.holdingItemId);
      const holdItemPickableComponent = holdItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

      if (!funnelComponent.isLocked) {
        this.ui.setActionText(`Switch ${pickableComponent.item} with ${holdItemPickableComponent.item}`);
      }
    });
  }
}
