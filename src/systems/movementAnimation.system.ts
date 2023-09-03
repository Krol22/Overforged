import { ComponentTypes } from '@/components/component.types';
import { PhysicsComponent } from '@/components/physics.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';

export class MovementAnimationSystem extends System {
  constructor() {
    super([
      ComponentTypes.Sprite,
      ComponentTypes.Physics,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach(( entity) => {
      const physicsComponent = entity.getComponent<PhysicsComponent>(ComponentTypes.Physics);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

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

      if (physicsComponent.vx > 0) {
        spriteComponent.transformFlipX = -1;
      } else if (physicsComponent.vx < 0) {
        spriteComponent.transformFlipX = 1;
      }

      if (physicsComponent.vx !== 0) {
        spriteComponent.rotate += spriteComponent.rotateDir * Math.abs(physicsComponent.vx / 50);

        if (spriteComponent.rotate > 0.09) {
          spriteComponent.rotateDir *= -1;
        }

        if (spriteComponent.rotate < -0.09) {
          spriteComponent.rotateDir *= -1;
        }
      }

      if (physicsComponent.vx === 0) {
        spriteComponent.rotate = 0;
      }
    });
  }
}
