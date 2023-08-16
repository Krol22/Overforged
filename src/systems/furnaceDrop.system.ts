import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { SteelComponent } from '@/components/steel.component';
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

      // leave item in the furnace
      if (
        funnelComponent.canUseEntityId &&
        controls.isConfirm && !controls.previousState.isConfirm
      ) {
        const item = this.allEntities.find(
          (e) => e.id === funnelComponent.canUseEntityId
        );

        if (!item) {
          return;
        }

        const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);

        if (!funnelComponent.itemTypes.includes(pickableComponent.item)) {
          return;
        }

        const spriteComponent = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
        spriteComponent.visible = false;
        playerPlayerComponent.pickedItem = undefined;
        this.interactItemWithFurnace(entity, item);
      }

      // pickup steel from furnace
      if (
        !playerPlayerComponent.pickedItem &&
        controls.isConfirm && !controls.previousState.isConfirm &&
        furnaceComponent.hasSteelHeated
      ) {
        furnaceComponent.hasSteelHeated = false;
        furnaceComponent.hasSteelInside = false;

        playerPlayerComponent.pickedItem = furnaceComponent.steelEntityId;

        const item = this.allEntities.find(
          (e) => e.id === furnaceComponent.steelEntityId
        );

        if (!item) {
          return;
        }

        const spriteComponent = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
        const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
        spriteComponent.visible = true;
        pickableComponent.item = Item.hotSteel;
      }
    });
  }

  private interactItemWithFurnace(furnace: Entity, item: Entity) {
    const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
    const itemInteractionComponent = item.getComponent<InteractionComponent>(ComponentTypes.Interaction);
    const furnaceComponent = furnace.getComponent<FurnaceComponent>(ComponentTypes.Furnace);

    switch (pickableComponent.item) {
      case (Item.coal):
        furnaceComponent.fuel = furnaceComponent.fuel + 1;
        this.markToRemove(item.id);
        break;
      case (Item.steel):
        const steelComponent = item.getComponent<SteelComponent>(ComponentTypes.Steel);
        itemInteractionComponent.canInteractWith = false;
        steelComponent.inFurnace = true;

        furnaceComponent.hasSteelInside = true;
        furnaceComponent.steelEntityId = item.id;
        break;
    }
  }
}
