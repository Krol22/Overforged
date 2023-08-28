import { ComponentTypes } from '@/components/component.types';
import { HealthComponent } from '@/components/health.component';
import { System } from '@/core/ecs';

export class HealthSystem extends System {
  constructor() {
    super([ComponentTypes.Health]);
  }

  public update(_dt: number): void {

    this.systemEntities.forEach((entity) => {
      const healthComponent = entity.getComponent<HealthComponent>(ComponentTypes.Health);

      if (healthComponent.currentHealth <= 0) {
        this.markToRemove(entity.id);

        if (!this.gameData) {
          return;
        }

        this.gameData.remaningEnemies -= 1;

        if (this.gameData.remaningEnemies <= 0) {
          this.gameData.finishDay();
        }
      }
    });
  }
}
