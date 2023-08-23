import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { ItemHolderComponent } from '@/components/itemHolder.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { Item } from '@/components/spawner.component';
import { SteelComponent } from '@/components/steel.component';
import { TransformerComponent } from '@/components/transformer.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { UI } from '@/core/ui';

// #TODO update name
export class FurnaceDropSystem extends System {
  public playerEntity: Entity;
  public ui: UI;

  constructor(playerEntity: Entity, ui: UI) {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Furnace,
      ComponentTypes.Interaction,
      ComponentTypes.Transformer,
      ComponentTypes.ItemHolder,
    ]);

    this.playerEntity = playerEntity;
    this.ui = ui;
  } 

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);
      const itemHolderComponent = entity.getComponent<ItemHolderComponent>(ComponentTypes.ItemHolder);
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const furnaceComponent = entity.getComponent<FurnaceComponent>(ComponentTypes.Furnace);
      const transformerComponent = entity.getComponent<TransformerComponent>(ComponentTypes.Transformer);

      if (!interactionComponent.isOverlaping) {
        return;
      }
      
      // handle coals
      if (controls.isConfirm && !controls.previousState.isConfirm && playerPlayerComponent.pickedItem) {
        const id = itemHolderComponent.pickedEntityId || playerPlayerComponent.pickedItem;
        const playerItem = this.getEntity(id);
        const pickableComponent = playerItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

        if (pickableComponent.item === Item.coal) {
          this.addCoalToFurnace(entity, playerItem);
          playerPlayerComponent.pickedItem = undefined;
          return;
        }
      }

      if (!(controls.isConfirm && !controls.previousState.isConfirm)) {
        return;
      }
      // furnace picked item from player
      console.log(itemHolderComponent);
      if (itemHolderComponent.pickedEntityId) {
        const pickedItem = this.getEntity(itemHolderComponent.pickedEntityId);
        this.interactItemWithFurnace(pickedItem);
        funnelComponent.isLocked = true;
      }

      // furnace dropped item for player
      if (itemHolderComponent.droppedEntityId) {
        const droppedItem = this.getEntity(itemHolderComponent.droppedEntityId);
        furnaceComponent.entityHeated = false;

        const pickableComponent = droppedItem.getComponent<PickableComponent>(ComponentTypes.Pickable);
        const transformsItemTo = transformerComponent.definition[pickableComponent.item];

        if (!transformsItemTo) {
          throw new Error('INVALID TRANSFORMER DEFINITION');
        }

        pickableComponent.item = transformsItemTo;
      }
    });
  }

  private addCoalToFurnace(furnace: Entity, coal: Entity) {
    const furnaceComponent = furnace.getComponent<FurnaceComponent>(ComponentTypes.Furnace);
    furnaceComponent.fuel = furnaceComponent.fuel + 1;
    this.markToRemove(coal.id);
  }

  private interactItemWithFurnace(item: Entity) {
    const itemInteractionComponent = item.getComponent<InteractionComponent>(ComponentTypes.Interaction);

    const steelComponent = item.getComponent<SteelComponent>(ComponentTypes.Steel);
    itemInteractionComponent.canInteractWith = false;
    steelComponent.heatCounter = 0;
    steelComponent.isHeated = false;
  }
}
