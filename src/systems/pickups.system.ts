import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { PhysicsComponent } from '@/components/physics.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { FloorLevel } from '@/consts';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { UI } from '@/core/ui';

export class PickupsSystem extends System {
  public playerEntity: Entity;
  public ui: UI;

  constructor(playerEntity: Entity, ui: UI) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Position,
      ComponentTypes.Pickable,
    ]);

    this.playerEntity = playerEntity;
    this.ui = ui;
  }

  public update(_dt: number): void {
    const playerPositionComponent = this.playerEntity.getComponent<PositionComponent>(ComponentTypes.Position);
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);
    const playerSpriteComponent = this.playerEntity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

    this.systemEntities.map((entity) => {
      const pickableComponent = entity.getComponent<PickableComponent>(ComponentTypes.Pickable);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!pickableComponent.isPicked) {
        if (interactionComponent.isOverlaping) {
          this.ui.setActionText(`Press <X> to pick ${pickableComponent.item}`);
        }

        if (
          interactionComponent.isOverlaping
          && controls.isX && !controls.previousState.isX
        ) {

          // If player has picketItem drop it
          if (playerPlayerComponent.pickedItem) {
            const item = this.getEntity(playerPlayerComponent.pickedItem);
            const itemPickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
            const itemPositionComponent = item.getComponent<PositionComponent>(ComponentTypes.Position);

            itemPickableComponent.isPicked = false;
            itemPositionComponent.y = FloorLevel - 4;
          }

          pickableComponent.isPicked = true;
          playerPlayerComponent.pickedItem = entity.id;
        }

        return;
      }

      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      const physicsComponent = entity.getComponent<PhysicsComponent>(ComponentTypes.Physics);

      if (controls.isX && !controls.previousState.isX) {
        physicsComponent.vy = -3;
        pickableComponent.isPicked = false;
        playerPlayerComponent.pickedItem = undefined;
        return;
      }

      const { x, y } = getPickableOffset(pickableComponent.item);

      positionComponent.x = Math.floor(playerPositionComponent.x + spriteComponent.dw / 2) + x;
      positionComponent.y = FloorLevel + y;
      spriteComponent.flipX = playerSpriteComponent.flipX;
    });
  }
}

function getPickableOffset(type: Item): { x: number, y: number } {
  if (type === Item.coal) {
    return { x: -0, y: -12 };
  }

  if (type === Item.weapon1) {
    return { x: -4, y: -12 };
  }

  if (type === Item.tool1) {
    return { x: -2, y: -12 };
  }

  return { x: 0, y: -12 };
};
