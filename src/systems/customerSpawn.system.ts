import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { CustomerSpawnerComponent } from '@/components/customerSpawner.component';
import { PhysicsComponent } from '@/components/physics.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { FloorLevel } from '@/consts';
import { Entity, System } from '@/core/ecs';
import { gameData } from '@/core/gameData';

const chances: Record<number, Item> = {
  50: Item.horseShoe,
  35: Item.axe,
  15: Item.weapon,
};

const sprites = [
  () => new SpriteComponent(69, 25, 11, 15),
  () => new SpriteComponent(57, 23, 11, 17),
  () => new SpriteComponent(81, 22, 16, 20),
];

function* day0CustomerSprite(): Generator<SpriteComponent> {
  yield sprites[0]();
  yield sprites[1]();
  yield sprites[2]();
}

const customerSpawner = day0CustomerSprite();

const rollSprite = () => {
  if (gameData.day === 0) {
    return customerSpawner.next().value;
  } 

  const index = Math.floor(Math.random() * 3);
  return sprites[index]();
};

function* day0Spawner(): Generator<Item.horseShoe | Item.axe | Item.weapon> {
  yield Item.horseShoe;
  yield Item.axe;
  yield Item.weapon;
}

const spawner = day0Spawner();

const rollItem = (): Item => {
  if (gameData.day === 0) {
    return spawner.next().value;
  }

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
  const sprite = rollSprite();

  customer.addComponents([
    new PositionComponent(-20, FloorLevel - sprite.dh),
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
