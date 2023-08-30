import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { CustomerSpawnerComponent } from '@/components/customerSpawner.component';
import { PhysicsComponent } from '@/components/physics.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { FloorLevel } from '@/consts';
import { Entity, System } from '@/core/ecs';

const chances: Record<number, Item> = {
  50: Item.horseShoe,
  35: Item.tool,
  15: Item.weapon,
};

const rollItem = (): Item => {
  const roll = Math.random() * 100;

  let currentSum = 0;

  const sortedChances = Object.keys(chances).sort((a, b) => Number(b) - Number(a));
  for (let i = 0; i < sortedChances.length; i++) {
    currentSum += Number(sortedChances[i]);
    if (roll < currentSum) {
      return chances[sortedChances[i as any] as any];
    }
  }

  return Item.horseShoe;
};

function spawnCustomer(): Entity {
  const customer = new Entity();

  const sprite = new SpriteComponent(0, 0, 5, 8);
  sprite.color = '#0f0';

  customer.addComponents([
    new PositionComponent(-20, FloorLevel - 9),
    new CustomerComponent([rollItem()]),
    new PhysicsComponent(),
    sprite,
  ]);

  return customer;
}

export class CustomerSpawnSystem extends System {
  constructor() {
    super([
      ComponentTypes.CustomerSpawner,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      if (!this.gameData) {
        return;
      }

      if (this.gameData?.customersToSpawn === 0) {
        return;
      }

      const customerSpawnerComponent = entity.getComponent<CustomerSpawnerComponent>(ComponentTypes.CustomerSpawner);

      if (
        customerSpawnerComponent.currentTime <= 0 &&
        this.gameData.visibleCustomers < this.gameData.maxClientSpawned
      ) {
        const customer = spawnCustomer();
        this.addEntity(customer);

        customerSpawnerComponent.restart();
        this.gameData.visibleCustomers += 1;
        this.gameData.customersToSpawn -= 1;
        this.gameData.alreadySpawnedCustomers += 1;
        return;
      }

      customerSpawnerComponent.count();
    });
  }
}
