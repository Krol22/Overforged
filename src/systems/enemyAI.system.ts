import { ComponentTypes } from '@/components/component.types';
import { PhysicsComponent } from '@/components/physics.component';
import { System } from '@/core/ecs';

export class EnemyAISystem extends System {
  constructor() {
    super([
      ComponentTypes.Enemy,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      const physicsComponent = entity.getComponent<PhysicsComponent>(ComponentTypes.Physics);

      physicsComponent.vx = 0.1;
    });
  }
}
