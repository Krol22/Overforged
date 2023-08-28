import { ComponentTypes } from '@/components/component.types';
import { PhysicsComponent } from '@/components/physics.component';
import { PickableComponent } from '@/components/pickable.component';
import { PositionComponent } from '@/components/position.component';
import { System } from '@/core/ecs';

const floorLevel = 170;
const gravity = 0.2;
const DAMP = 0.85;

export class PhysicsSystem extends System {
  constructor() {
    super([
      ComponentTypes.Position,
      ComponentTypes.Physics,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const physicsComponent = entity.getComponent<PhysicsComponent>(ComponentTypes.Physics);

      if (entity.hasEvery([ComponentTypes.Player])) {
        return;
      }

      if (entity.hasEvery([ComponentTypes.Pickable])) {
        const pickableComponent = entity.getComponent<PickableComponent>(ComponentTypes.Pickable);
        if (pickableComponent.isPicked) {
          return;
        }
      }

      if (positionComponent.y >= floorLevel - 4) {
        physicsComponent.vy = 0;
        physicsComponent.ay = 0;
        return;
      }

      if (physicsComponent.affectedByGravity) {
        physicsComponent.ay += gravity;
      }

      physicsComponent.vx += physicsComponent.ax;
      physicsComponent.vy += physicsComponent.ay;

      positionComponent.x += physicsComponent.vx;
      positionComponent.y += physicsComponent.vy;

      if (physicsComponent.vx !== 0) { 
        // physicsComponent.vx *= DAMP;
        physicsComponent.ax *= DAMP;
      }
    });
  }
}
