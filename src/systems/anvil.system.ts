import { AnvilComponent } from '@/components/anvil.component';
import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
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
  private playerEntity: Entity;

  constructor(playerEntity: Entity, renderer: Renderer, ui: UI) {
    super([
      ComponentTypes.Anvil,
      ComponentTypes.Interaction,
      ComponentTypes.Funnel,
      ComponentTypes.Position,
    ]);

    this.renderer = renderer;
    this.ui = ui;
    this.playerEntity = playerEntity;
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!interactionComponent.isOverlaping) {
        return;
      }

      if (funnelComponent.canUseEntityId) {
        const anvilItem = this.getEntity(funnelComponent.canUseEntityId);
        const pickableComponent = anvilItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

        if (pickableComponent.item === Item.hotSteel) {
          this.handleForgePlacedItem(entity, anvilItem);
          return;
        } 

        if (controls.isConfirm && !controls.previousState.isConfirm) {
          this.handleTransformPlacedItem(pickableComponent);
        }
      }
    });
  }

  private handleForgePlacedItem(anvil: Entity, anvilItem: Entity) {
    const pickableComponent = anvilItem.getComponent<PickableComponent>(ComponentTypes.Pickable);
    const positionComponent = anvil.getComponent<PositionComponent>(ComponentTypes.Position);

    this.ui.showAnvilMenu(positionComponent.x + 4, positionComponent.y - 36);
    this.ui.setActionText('Press <NUMBER> to forge weapon');

    if (controls.is1 && !controls.previousState.is1) {
      pickableComponent.item = Item.horseShoe;
      pickableComponent.disposable = true;
    } else if (controls.is2 && !controls.previousState.is2) {

      pickableComponent.item = Item.axe1;
      pickableComponent.disposable = true;
    } else if (controls.is3 && !controls.previousState.is3) {
      pickableComponent.item = Item.weapon1;
    }
  }

  private handleTransformPlacedItem(pickableComponent: PickableComponent) {
    if (pickableComponent.item === Item.weapon2) {
      pickableComponent.item = Item.weapon3;
    }
  }
}
