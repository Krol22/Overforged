import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { ItemHolderComponent } from '@/components/itemHolder.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { SpriteComponent } from '@/components/sprite.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { UI } from '@/core/ui';

export class DropzoneSystem extends System {
  private playerEntity: Entity;

  constructor(playerEntity: Entity, ui: UI) {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Interaction,
      ComponentTypes.ItemHolder,
    ]);

    this.playerEntity = playerEntity;
  } 

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);
    
    this.systemEntities.map((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const itemHolderComponent = entity.getComponent<ItemHolderComponent>(ComponentTypes.ItemHolder);
      itemHolderComponent.pickedEntityId = undefined;
      itemHolderComponent.droppedEntityId = undefined;

      if (funnelComponent.isLocked) {
        return;
      }

      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!interactionComponent.isOverlaping) {
        return;
      }

      const canUseEntity = !!funnelComponent.canUseEntityId;

      if (controls.isConfirm && !controls.previousState.isConfirm) {
        if (itemHolderComponent.hasItemOn) {
            // switch items  
          const holdingItem = this.getEntity(itemHolderComponent.holdingItemId);

          if (playerPlayerComponent.pickedItem) {
            if (!canUseEntity) {
              return;
            }

            const playerPickedItem = this.getEntity(playerPlayerComponent.pickedItem);
            const pickable = playerPickedItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

            if (pickable.disposable) {
              this.dropItem(playerPickedItem);
              playerPlayerComponent.pickedItem = undefined;
              return;
            }

            this.pickupItem(holdingItem);
            this.dropItem(playerPickedItem);

            playerPlayerComponent.pickedItem = holdingItem.id;
            itemHolderComponent.holdingItemId = playerPickedItem.id;
            itemHolderComponent.droppedEntityId = holdingItem.id;
            itemHolderComponent.pickedEntityId = itemHolderComponent.holdingItemId;
          } else {
            playerPlayerComponent.pickedItem = itemHolderComponent.holdingItemId;
            itemHolderComponent.droppedEntityId = itemHolderComponent.holdingItemId;
            itemHolderComponent.hasItemOn = false;
            itemHolderComponent.holdingItemId = undefined;

            this.pickupItem(holdingItem);
          }
        } else {
          if (canUseEntity && playerPlayerComponent.pickedItem) {
            const playerPickedItem = this.getEntity(playerPlayerComponent.pickedItem);
            const pickable = playerPickedItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

            if (pickable.disposable) {
              this.dropItem(playerPickedItem);
              playerPlayerComponent.pickedItem = undefined;
              return;
            }

            itemHolderComponent.pickedEntityId = playerPlayerComponent.pickedItem;
            itemHolderComponent.hasItemOn = true;
            itemHolderComponent.holdingItemId = playerPlayerComponent.pickedItem;

            playerPlayerComponent.pickedItem = undefined;
            this.dropItem(playerPickedItem);
          }
        }
      }
    });
  }

  private pickupItem(item: Entity) {
    const sprite = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
    sprite.visible = true;

    const pickable = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
    pickable.isPicked = true;

    const interaction = item.getComponent<InteractionComponent>(ComponentTypes.Interaction);
    interaction.canInteractWith = true;
  }

  private dropItem(item: Entity) {
    const sprite = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
    sprite.visible = false;

    const pickable = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
    pickable.isPicked = false;

    const interaction = item.getComponent<InteractionComponent>(ComponentTypes.Interaction);
    interaction.canInteractWith = false;
  }
}
