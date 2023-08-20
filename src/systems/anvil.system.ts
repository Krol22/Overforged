import { AnvilComponent } from '@/components/anvil.component';
import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class AnvilSystem extends System {
  private renderer: Renderer;
  private playerEntity: Entity;

  constructor(playerEntity: Entity, renderer: Renderer) {
    super([
      ComponentTypes.Anvil,
      ComponentTypes.Interaction,
      ComponentTypes.Funnel,
      ComponentTypes.Position,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const anvilComponent = entity.getComponent<AnvilComponent>(ComponentTypes.Anvil);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (interactionComponent.isOverlaping && anvilComponent.isPlacedItemReady) {
        if (controls.isConfirm && !controls.previousState.isConfirm) {
          anvilComponent.hasItemOn = false;
          anvilComponent.isPlacedItemReady = false;

          const item = this.getEntity(anvilComponent.placedItemId);
          const sprite = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
          const interaction = item.getComponent<InteractionComponent>(ComponentTypes.Interaction);

          playerPlayerComponent.pickedItem = anvilComponent.placedItemId;
          sprite.visible = true;
          interaction.canInteractWith = true;
          anvilComponent.placedItemId = undefined;
        }
      }

      if (anvilComponent.hasItemOn) {
        const anvilItem = this.getEntity(anvilComponent.placedItemId);

        if (!anvilItem) {
          console.error('ERROR Item not found');
          return;
        }

        const pickableComponent = anvilItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

        if (pickableComponent.item === Item.hotSteel) {
          this.handleForgePlacedItem(entity, pickableComponent);
          return;
        }

        if (controls.isConfirm && !controls.previousState.isConfirm) {
          this.handleTransformPlacedItem(entity, pickableComponent);
          return;
        }

        return;
      }

      if (!funnelComponent.canUseEntityId) {
        return;
      }

      const item = this.allEntities.find(({ id }) => funnelComponent.canUseEntityId === id);

      if (!item) {
        return;
      }

      if (anvilComponent.hasItemOn) {
        return;
      }

      if (controls.isConfirm && !controls.previousState.isConfirm) {
        anvilComponent.hasItemOn = true;
        anvilComponent.placedItemId = item.id;

        const sprite = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
        const interaction = item.getComponent<InteractionComponent>(ComponentTypes.Interaction);

        playerPlayerComponent.pickedItem = undefined;
        sprite.visible = false;
        interaction.canInteractWith = false;
      }
    });
  }

  private handleForgePlacedItem(anvil: Entity, pickableComponent: PickableComponent) {
    const positionComponent = anvil.getComponent<PositionComponent>(ComponentTypes.Position);
    const anvilComponent = anvil.getComponent<AnvilComponent>(ComponentTypes.Anvil);

    this.renderer.drawText("Press 1 2 3 4", positionComponent.x, positionComponent.y - 10, { size: 1 });

    if (controls.is1 && !controls.previousState.is1) {
      pickableComponent.item = Item.horseShoe;
      anvilComponent.isPlacedItemReady = true;
    } else if (controls.is2 && !controls.previousState.is2) {
      pickableComponent.item = Item.dagger1;
      anvilComponent.isPlacedItemReady = true;
    } else if (controls.is3 && !controls.previousState.is3) {
      pickableComponent.item = Item.axe1;
      anvilComponent.isPlacedItemReady = true;
    } else if (controls.is4 && !controls.previousState.is4) {
      pickableComponent.item = Item.sword1;
      anvilComponent.isPlacedItemReady = true;
    }
  }

  private handleTransformPlacedItem(anvil: Entity, pickableComponent: PickableComponent) {
    const anvilComponent = anvil.getComponent<AnvilComponent>(ComponentTypes.Anvil);

    if (pickableComponent.item === Item.sword3) {
      pickableComponent.item = Item.sword4;
      anvilComponent.isPlacedItemReady = true;
    }

    if (pickableComponent.item === Item.sword2) {
      pickableComponent.item = Item.sword3;
    }

    if (pickableComponent.item === Item.axe1) {
      pickableComponent.item = Item.axe1;
      anvilComponent.isPlacedItemReady = true;
    }
  }
}
