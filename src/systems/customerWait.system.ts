import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { PhysicsComponent } from '@/components/physics.component';
import { CustomerWaitTime } from '@/consts';
import { System } from '@/core/ecs';

export class CustomerWaitSystem extends System {
  constructor() {
    super([
      ComponentTypes.Customer,
      ComponentTypes.Physics,
    ]);
  }

  update(_dt: number) {
    this.systemEntities.forEach((entity) => {
      const customerComponent = entity.getComponent<CustomerComponent>(ComponentTypes.Customer);
      const physicsComponent = entity.getComponent<PhysicsComponent>(ComponentTypes.Physics);

      if (physicsComponent.vx === 0) {
        customerComponent.waits += 0.1;
      }

      if (physicsComponent.vx > 0) {
        customerComponent.waits -= 0;

        if (customerComponent.waits <= 0) {
          customerComponent.waits = 0;
        }
      }

      if (customerComponent.waits >= CustomerWaitTime) {
        customerComponent.isLeaving = true;
      }

      if (customerComponent.isLeaving) {
        physicsComponent.vx = -0.8;
      }

      if (customerComponent.bought) {
        customerComponent.waits = 0;
      }
    });
  }
}
