import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { SteelComponent } from '@/components/steel.component';
import { TransformerComponent } from '@/components/transformer.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';

// #TODO update name
export class FurnaceDropSystem extends System {
  public playerEntity: Entity;

  constructor(playerEntity: Entity) {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Furnace,
      ComponentTypes.Interaction,
      ComponentTypes.Transformer,
    ]);

    this.playerEntity = playerEntity;
  } 

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const furnaceComponent = entity.getComponent<FurnaceComponent>(ComponentTypes.Furnace);

      if (!interactionComponent.isOverlaping) {
        return;
      }
      
      if (playerPlayerComponent.pickedItem && controls.isConfirm && !controls.previousState.isConfirm) {
        const playerItem = this.getEntity(playerPlayerComponent.pickedItem);
        const pickableComponent = playerItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

        if (pickableComponent.item === Item.coal) {
          this.addCoalToFurnace(entity, playerItem);
          playerPlayerComponent.pickedItem = undefined;
          return;
        }
      }

      // pickup item from furnace
      if (
        !playerPlayerComponent.pickedItem &&
        controls.isConfirm && !controls.previousState.isConfirm &&
        furnaceComponent.entityHeated
      ) {
        furnaceComponent.entityHeated = false;
        furnaceComponent.hasItemInside = false;

        playerPlayerComponent.pickedItem = furnaceComponent.heatingEntityId;
        const steel = this.getEntity(furnaceComponent.heatingEntityId);

        const transformerComponent = entity.getComponent<TransformerComponent>(ComponentTypes.Transformer);
        const spriteComponent = steel.getComponent<SpriteComponent>(ComponentTypes.Sprite);
        const steelPickableComponent = steel.getComponent<PickableComponent>(ComponentTypes.Pickable);

        spriteComponent.visible = true;
        const transformsItemTo = transformerComponent.definition[steelPickableComponent.item];

        funnelComponent.isLocked = false;

        if (!transformsItemTo) {
          return;
        }

        steelPickableComponent.item = transformsItemTo;
      }

      if (
        funnelComponent.canUseEntityId &&
        controls.isConfirm && !controls.previousState.isConfirm
      ) {
        const playerItem = this.getEntity(playerPlayerComponent.pickedItem);
        const spriteComponent = playerItem.getComponent<SpriteComponent>(ComponentTypes.Sprite);
        spriteComponent.visible = false;
        playerPlayerComponent.pickedItem = undefined;

        this.interactItemWithFurnace(entity, playerItem);
        funnelComponent.isLocked = true;
      }
    });
  }

  private addCoalToFurnace(furnace: Entity, coal: Entity) {
    const furnaceComponent = furnace.getComponent<FurnaceComponent>(ComponentTypes.Furnace);
    furnaceComponent.fuel = furnaceComponent.fuel + 1;
    this.markToRemove(coal.id);
  }

  private interactItemWithFurnace(furnace: Entity, item: Entity) {
    const furnaceComponent = furnace.getComponent<FurnaceComponent>(ComponentTypes.Furnace);
    const itemInteractionComponent = item.getComponent<InteractionComponent>(ComponentTypes.Interaction);

    const steelComponent = item.getComponent<SteelComponent>(ComponentTypes.Steel);
    itemInteractionComponent.canInteractWith = false;
    steelComponent.heatCounter = 0;
    steelComponent.isHeated = false;
    steelComponent.inFurnace = true;

    furnaceComponent.hasItemInside = true;
    furnaceComponent.heatingEntityId = item.id;
  }
}
