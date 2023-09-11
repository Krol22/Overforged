import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { AngryCustomerFactor, HappyCustomerFactor } from '@/consts';
import { System } from '@/core/ecs';

const coinValue = {
  [Item.horseShoe]: 2,
  [Item.axe]: 3,
  [Item.weapon]: 5,
};

const satisfactionFactor = {
  [Item.horseShoe]: 1,
  [Item.axe]: 1.5,
  [Item.weapon]: 2.5,
};

export class CustomerDespawnSystem extends System {
  constructor() {
    super([ComponentTypes.Customer, ComponentTypes.Position]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const customerComponent = entity.getComponent<CustomerComponent>(ComponentTypes.Customer);

      if (positionComponent.x <= -20 && customerComponent.isLeaving) {
        const item = customerComponent.wantsToBuy[0] as Item.horseShoe | Item.axe | Item.weapon;
        if (customerComponent.bought) {
          this.gameData.totalSatisfaction += HappyCustomerFactor * satisfactionFactor[item];
          this.gameData.totalCoins += coinValue[item];
        } else {
          this.gameData.totalSatisfaction += AngryCustomerFactor;
        }

        this.markToRemove(entity.id);
        this.gameData.visibleCustomers -= 1;
      }
    });
  }
}
