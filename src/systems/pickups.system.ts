import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';

export class PickupsSystem extends System {
  public playerEntity: Entity;

  constructor(playerEntity: Entity) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Position,
      ComponentTypes.Pickable,
    ]);

    this.playerEntity = playerEntity;
  }

  public update(_dt: number): void {
    const playerPositionComponent = this.playerEntity.getComponent<PositionComponent>(ComponentTypes.Position);
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const pickableComponent = entity.getComponent<PickableComponent>(ComponentTypes.Pickable);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!pickableComponent.isPicked) {
        if (interactionComponent.isOverlaping && controls.isConfirm && !controls.previousState.isConfirm) {
          pickableComponent.isPicked = true;
          playerPlayerComponent.pickedItem = entity.id;
        }

        return;
      }

      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);

      if (controls.isConfirm) {
        pickableComponent.isPicked = false;
        positionComponent.y = 170 - 4;
        playerPlayerComponent.pickedItem = undefined;
        return;
      }

      positionComponent.x = playerPositionComponent.x;
      positionComponent.y = 170 - 16 - 24;
    });
  }
}
