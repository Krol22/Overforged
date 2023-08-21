import { AnvilComponent } from '@/components/anvil.component';
import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { ItemHolderComponent } from '@/components/itemHolder.component';
import { PickableComponent } from '@/components/pickable.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { UI } from '@/core/ui';

export class AnvilSystem extends System {
  private renderer: Renderer;
  private ui: UI;

  constructor(renderer: Renderer, ui: UI) {
    super([
      ComponentTypes.Anvil,
      ComponentTypes.Interaction,
      ComponentTypes.Funnel,
      ComponentTypes.Position,
      ComponentTypes.ItemHolder,
    ]);

    this.renderer = renderer;
    this.ui = ui;
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const anvilComponent = entity.getComponent<AnvilComponent>(ComponentTypes.Anvil);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);
      const itemHolderComponent = entity.getComponent<ItemHolderComponent>(ComponentTypes.ItemHolder);

      funnelComponent.isLocked = false;

      if (!interactionComponent.isOverlaping) {
        return;
      }

      if (itemHolderComponent.pickedEntityId) {
        anvilComponent.isPlacedItemReady = false;
      }

      if (itemHolderComponent.hasItemOn) {
        const anvilItem = this.getEntity(itemHolderComponent.holdingItemId);
        const pickableComponent = anvilItem.getComponent<PickableComponent>(ComponentTypes.Pickable);
        funnelComponent.isLocked = true;

        if (pickableComponent.item === Item.hotSteel) {
          this.handleForgePlacedItem(entity, pickableComponent);
        }

        if (anvilComponent.isPlacedItemReady) {
          this.ui.setActionText(`Press <SPACE> to take from anvil.`);
          funnelComponent.isLocked = false;
        }

        if (!anvilComponent.isPlacedItemReady) {
          this.ui.setActionText(`Press <SPACE> to forge.`);
          if (controls.isConfirm && !controls.previousState.isConfirm) {
            this.handleTransformPlacedItem(entity, pickableComponent);
          }
        }
      } else {
        funnelComponent.isLocked = false;
      }
    });
  }

  private handleForgePlacedItem(anvil: Entity, pickableComponent: PickableComponent) {
    const positionComponent = anvil.getComponent<PositionComponent>(ComponentTypes.Position);
    const anvilComponent = anvil.getComponent<AnvilComponent>(ComponentTypes.Anvil);

    this.renderer.drawText("Press 1 2 3", positionComponent.x, positionComponent.y - 24, { size: 1 });

    if (controls.is1 && !controls.previousState.is1) {
      pickableComponent.item = Item.horseShoe;
      pickableComponent.disposable = true;
      anvilComponent.isPlacedItemReady = true;
    } else if (controls.is2 && !controls.previousState.is2) {
      pickableComponent.item = Item.tool1;
      anvilComponent.isPlacedItemReady = false;
    } else if (controls.is3 && !controls.previousState.is3) {
      pickableComponent.item = Item.weapon1;
      anvilComponent.isPlacedItemReady = true;
    }
  }

  private handleTransformPlacedItem(anvil: Entity, pickableComponent: PickableComponent) {
    const anvilComponent = anvil.getComponent<AnvilComponent>(ComponentTypes.Anvil);

    if (pickableComponent.item === Item.weapon3) {
      pickableComponent.item = Item.weapon4;
      anvilComponent.isPlacedItemReady = true;
    }

    if (pickableComponent.item === Item.weapon2) {
      pickableComponent.item = Item.weapon3;
    }

    if (pickableComponent.item === Item.tool1) {
      pickableComponent.item = Item.tool2;
      anvilComponent.isPlacedItemReady = true;
    }
  }
}
