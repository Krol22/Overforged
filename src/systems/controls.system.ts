import { ComponentTypes } from '@/components/component.types';
import { PhysicsComponent } from '@/components/physics.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { controls } from '@/core/controls';
import { System } from '@/core/ecs';

const PLAYER_MAX_SPEED = 2;
const DAMP = 0.80;

export class ControlsSystem extends System {
  constructor() {
    super([
      ComponentTypes.Position,
      ComponentTypes.Sprite,
      ComponentTypes.Player,
      ComponentTypes.Physics,
    ]);
  }

  public update(_dt: number): void {
    const player = this.systemEntities[0];

    const positionComponent = player.getComponent<PositionComponent>(ComponentTypes.Position);
    const physicsComponent = player.getComponent<PhysicsComponent>(ComponentTypes.Physics);
    const playerComponent = player.getComponent<PlayerComponent>(ComponentTypes.Player);
    const spriteComponent = player.getComponent<SpriteComponent>(ComponentTypes.Sprite);

    if (-1 < physicsComponent.vx && physicsComponent.vx < 1) {
      physicsComponent.vx = 0;
      spriteComponent.rotate = 0;
    }

    if (playerComponent.pickedItem) {
      const item = this.allEntities.find(({ id }) => {
        return id === playerComponent.pickedItem;
      });

      if (item) {
        // const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
        // console.log(pickableComponent.item);

        playerComponent.hadItemPicked = true;
        playerComponent.previousPickedItem = item.id;
      }
    } else {
      playerComponent.hadItemPicked = false;
      playerComponent.previousPickedItem = undefined;
    }

    if (spriteComponent.transformFlipX !== 0) {
      spriteComponent.flipX += spriteComponent.transformFlipX * 0.3;

      if (spriteComponent.flipX < -1) {
        spriteComponent.transformFlipX = 0;
        spriteComponent.flipX = -1;
      }

      if (spriteComponent.flipX > 1) {
        spriteComponent.transformFlipX = 0;
        spriteComponent.flipX = 1;
      }
    } 

    if (!playerComponent.hasMoveLocked) {
      this.movePlayer(positionComponent, physicsComponent);

      spriteComponent.sx = 32;
      spriteComponent.sy = 26;
      spriteComponent.sw = 12;
      spriteComponent.sh = 14;
    } else {
      physicsComponent.vx = 0;
      physicsComponent.ax = 0;

      spriteComponent.sx = 45;
      spriteComponent.sy = 26;
      spriteComponent.sw = 11;
      spriteComponent.sh = 14;
    }

  }

  private movePlayer(positionComponent: PositionComponent, physicsComponent: PhysicsComponent) {
    physicsComponent.ax = controls.inputDirection.x * 1.5;
    physicsComponent.vx += physicsComponent.ax;

    if (physicsComponent.vx > PLAYER_MAX_SPEED) {
      physicsComponent.vx = PLAYER_MAX_SPEED;
    }

    if (physicsComponent.vx < -PLAYER_MAX_SPEED) {
      physicsComponent.vx = -PLAYER_MAX_SPEED;
    }

    positionComponent.x += physicsComponent.vx;

    if (positionComponent.x < 139) {
      positionComponent.x = 139;
    }

    if (positionComponent.x >= 288) {
      positionComponent.x = 288;
    }

    if (physicsComponent.vx !== 0) {
      physicsComponent.vx *= DAMP;
    }
  }
}
