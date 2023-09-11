import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { PhysicsComponent } from '@/components/physics.component';
import { CustomerWaitTime } from '@/consts';
import { System } from '@/core/ecs';
import { gameData } from '@/core/gameData';

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

      if (customerComponent.isLeaving) {
        physicsComponent.vx = -0.8;
      }

      if (this.gameData.day === 0) {
        return;
      }

      if (physicsComponent.vx === 0) {
        let waitBase = 1;
        let waitTime = 0.1 * (waitBase + gameData.day / 8);
        if (this.gameData.bench) {
          waitBase = 1;
          waitTime = 0.07 * (waitBase + gameData.day / 8);
        }

        customerComponent.waits += waitTime;
      }

      if (physicsComponent.vx > 0) {
        customerComponent.waits -= 0.1;

        if (customerComponent.waits <= 0) {
          customerComponent.waits = 0;
        }
      }

      if (customerComponent.waits >= CustomerWaitTime) {
        customerComponent.isLeaving = true;
      }

      if (customerComponent.bought) {
        customerComponent.waits = 0;
      }
    });
  }
}
