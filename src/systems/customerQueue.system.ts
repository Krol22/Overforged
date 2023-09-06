import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { DeskComponent } from '@/components/desk.component';
import { PhysicsComponent } from '@/components/physics.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { CustomerBetweenMargin, CustomerWaitTime } from '@/consts';
import { System } from '@/core/ecs';

export class CustomerQueueSystem extends System {
  constructor() {
    super([
      ComponentTypes.Customer,
      ComponentTypes.Position,
      ComponentTypes.Sprite,
      ComponentTypes.Physics,
    ]);
  }

  public update(_dt: number): void {
    const desk = this.allEntities.find((entity) => entity.hasEvery([ComponentTypes.Desk]));
    if (!desk) {
      throw new Error('Desk is undefined!');
    }

    const xPositions = this.systemEntities.filter((entity) => {
      const customerComponent = entity.getComponent<CustomerComponent>(ComponentTypes.Customer);
      return customerComponent.isLeaving === false;
    }).map((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

      return {
        x: positionComponent.x,
        w: spriteComponent.dw,
        id: entity.id,
      };
    }).sort((a, b) => a.x - b.x);

    const deskPositionComponent = desk.getComponent<PositionComponent>(ComponentTypes.Position);
    const deskDeskComponent = desk.getComponent<DeskComponent>(ComponentTypes.Desk);

    this.systemEntities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const customerComponent = entity.getComponent<CustomerComponent>(ComponentTypes.Customer);
      const physicsComponent = entity.getComponent<PhysicsComponent>(ComponentTypes.Physics);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

      const xPositionsIndex = xPositions.findIndex((e) => e.id === entity.id);

      // is not last index
      if (xPositionsIndex !== xPositions.length - 1 && xPositions.length !== 1) {
        physicsComponent.vx = 0.4;
        const nextPosition = xPositions[xPositionsIndex + 1];

        if (positionComponent.x + spriteComponent.dw + CustomerBetweenMargin >= nextPosition.x) {
          physicsComponent.vx = 0;
          return;
        }
      }

      // is last index
      if (deskPositionComponent.x - 5 <= positionComponent.x + spriteComponent.dw) {
        physicsComponent.vx = 0;

        if (deskDeskComponent.hasItem(customerComponent.wantsToBuy[0])) {
          deskDeskComponent.removeItem(customerComponent.wantsToBuy[0]);
          customerComponent.bought = true;
          customerComponent.isLeaving = true;
          this.gameData.clientsHandled += 1;
        }
      } else {
        physicsComponent.vx = 0.4;
      }

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
