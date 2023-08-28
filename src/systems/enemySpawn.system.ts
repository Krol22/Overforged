import { ComponentTypes } from '@/components/component.types';
import { EnemyComponent } from '@/components/enemy.component';
import { EnemySpawnerComponent } from '@/components/enemySpawner.component';
import { HealthComponent } from '@/components/health.component';
import { PhysicsComponent } from '@/components/physics.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { Entity, System } from '@/core/ecs';

function spawnEnemy(): Entity {
  const enemy = new Entity();

  enemy.addComponents([
    new PositionComponent(-10, 170 - 5),
    new EnemyComponent(),
    new SpriteComponent(0, 0, 5, 8),
    new HealthComponent(3),
    new PhysicsComponent(),
  ]);

  return enemy;
}

export class EnemySpawnSystem extends System {
  constructor() {
    super([
      ComponentTypes.EnemySpawner,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      if (!this.gameData) {
        return;
      }

      if (this.gameData?.enemiesToSpawn === 0) {
        return;
      }

      const enemySpawnerComponent = entity.getComponent<EnemySpawnerComponent>(ComponentTypes.EnemySpawner);

      if (enemySpawnerComponent.currentTime <= 0) {
        const enemy = spawnEnemy();
        this.addEntity(enemy);

        enemySpawnerComponent.restart();
        this.gameData.enemiesToSpawn -= 1;
        return;
      }

      enemySpawnerComponent.count();
    });
  }
}
