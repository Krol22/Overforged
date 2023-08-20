import { ComponentTypes } from '@/components/component.types';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { controls } from '@/core/controls';
import { System } from '@/core/ecs';

const PLAYER_MAX_SPEED = 2;
const DAMP = 0.80;

export class ControlsSystem extends System {
  constructor() {
    super([
      ComponentTypes.Position,
      ComponentTypes.Player,
    ]);
  }

  public update(_dt: number): void {
    const player = this.systemEntities[0];

    const positionComponent = player.getComponent<PositionComponent>(ComponentTypes.Position);
    const playerComponent = player.getComponent<PlayerComponent>(ComponentTypes.Player);

    if (playerComponent.pickedItem) {
      const item = this.allEntities.find(({ id }) => {
        return id === playerComponent.pickedItem;
      });

      if (item) {
        const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
        // console.log("Picked Item: ", pickableComponent.item);
      }
      playerComponent.hadItemPicked = true;
    } else {
      playerComponent.hadItemPicked = false;
    }

    if (!playerComponent.hasMoveLocked) {
      this.movePlayer(positionComponent, playerComponent);
    }
  }

  private movePlayer(positionComponent: PositionComponent, playerComponent: PlayerComponent) {
    playerComponent.ax = controls.inputDirection.x * 1.5;
    playerComponent.vx += playerComponent.ax;

    if (playerComponent.vx > PLAYER_MAX_SPEED) {
      playerComponent.vx = PLAYER_MAX_SPEED;
    }

    if (playerComponent.vx < -PLAYER_MAX_SPEED) {
      playerComponent.vx = -PLAYER_MAX_SPEED;
    }

    positionComponent.x += playerComponent.vx;

    if (playerComponent.vx !== 0) {
      playerComponent.vx *= DAMP;
    }
  }
}
