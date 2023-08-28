import { ComponentTypes } from '@/components/component.types';
import { EnemyComponent } from '@/components/enemy.component';
import { HealthComponent } from '@/components/health.component';
import { PickableComponent } from '@/components/pickable.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { ThrowComponent } from '@/components/throw.component';
import { System } from '@/core/ecs';
import { UI } from '@/core/ui';

export class ThrowSystem extends System {
  private ui: UI;

  constructor(ui: UI) {
    super([
      ComponentTypes.Sprite,
      ComponentTypes.Throw,
      ComponentTypes.Pickable,
      ComponentTypes.Position,
    ]);

    this.ui = ui;
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      const throwComponent = entity.getComponent<ThrowComponent>(ComponentTypes.Throw);
      const pickableComponent = entity.getComponent<PickableComponent>(ComponentTypes.Pickable);

      if (pickableComponent.isPicked) {
        this.ui.setActionText('Press <SPACE> to throw!');
        return;
      }

      spriteComponent.transformOriginX = 0;
      spriteComponent.transformOriginY = 0;
      spriteComponent.rotate += throwComponent.rotationSpeed;

      const enemies = this.allEntities.filter((e) => e.hasEvery([
        ComponentTypes.Enemy,
        ComponentTypes.Position,
        ComponentTypes.Health,
      ]));

      if (!enemies.length) {
        return;
      }

      // potentially to new system
      enemies.forEach((enemy) => {
        const enemyPositionComponent = enemy.getComponent<PositionComponent>(ComponentTypes.Position);
        const healthComponent = enemy.getComponent<HealthComponent>(ComponentTypes.Health);
        const enemyComponent = enemy.getComponent<EnemyComponent>(ComponentTypes.Enemy);

        if (enemyComponent.wasAlreadyHitBy(entity.id)) {
          return;
        }


        if (enemyPositionComponent.x  >= positionComponent.x) {
          enemyComponent.addCollidedWeapon(entity.id);
          healthComponent.doDamage(throwComponent.damage);

          if (!throwComponent.isPiercing) {
            this.markToRemove(entity.id);
          }
        }
      });
    });
  }
}
