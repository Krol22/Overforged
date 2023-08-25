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
      ComponentTypes.Pickable,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const physicsComponent = entity.getComponent<PhysicsComponent>(ComponentTypes.Physics);
      const pickableComponent = entity.getComponent<PickableComponent>(ComponentTypes.Pickable);

      if (!physicsComponent.affectedByGravity || pickableComponent.isPicked) {
        return;
      }

      if (positionComponent.y >= floorLevel - 12) {
        physicsComponent.vy = 0;
        physicsComponent.ay = 0;
        return;
      }

      physicsComponent.ay += gravity;

      physicsComponent.vx += physicsComponent.ax;
      physicsComponent.vy += physicsComponent.ay;

      positionComponent.x += physicsComponent.vx;
      positionComponent.y += physicsComponent.vy;

      if (physicsComponent.vx !== 0) { 
        physicsComponent.vx *= DAMP;
        physicsComponent.ax *= DAMP;
      }
    });
  }
}
