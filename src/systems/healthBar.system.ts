import { ComponentTypes } from '@/components/component.types';
import { HealthComponent } from '@/components/health.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class HealthBarSystem extends System {
  constructor(
    private renderer: Renderer,
  ) {
    super([
      ComponentTypes.Position,
      ComponentTypes.Sprite,
      ComponentTypes.Health,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      const healthComponent = entity.getComponent<HealthComponent>(ComponentTypes.Health);

      if (!spriteComponent.visible) {
        return;
      }

      if (healthComponent.currentHealth >= healthComponent.maxHealth) {
        return; 
      }

      const x = positionComponent.x - Math.floor(spriteComponent.dw / 2);
      const y = positionComponent.y - 10;

      const progress = 11 * (healthComponent.currentHealth / healthComponent.maxHealth);

      this.renderer.drawRect(x + 1, y + 1, progress, 2, { fill: true, color: '#f00' });
      this.renderer.drawSprite(11, 26, 13, 4, x, y, 13, 4);
    });
  }
}
