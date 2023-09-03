import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { UI } from '@/core/ui';
import { drawTooltipBox } from '@/utils/drawTooltipBox';
import { setSpriteCoords } from '@/utils/setSpriteCoords';

export class CustomerTooltipSystem extends System {
  constructor(
    private readonly renderer: Renderer,
    private readonly ui: UI,
  ) {
    super([
      ComponentTypes.Position,
      ComponentTypes.Customer,
      ComponentTypes.Sprite,
    ]);
  }

  public update(_dt: number): void {
    const items = this.systemEntities.map((entity) => {
      const customerComponent = entity.getComponent<CustomerComponent>(ComponentTypes.Customer);  

      if (customerComponent.isLeaving) {
        return null;
      }

      return customerComponent.wantsToBuy;
    }).filter(Boolean).flat();

    this.ui.requiredItems = items as Item[];

    this.systemEntities.forEach((entity) => {
      const customerComponent = entity.getComponent<CustomerComponent>(ComponentTypes.Customer);  
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);  
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);  

      if (customerComponent.wantsToBuy.length === 0 || customerComponent.isLeaving) {
        return; 
      }

      const x = positionComponent.x + Math.floor(spriteComponent.dw / 2);

      const itemToBuy = customerComponent.wantsToBuy[0];

      const itemSpriteComponent = new SpriteComponent(0, 0, 0, 0);
      setSpriteCoords(itemToBuy, itemSpriteComponent);

      const neutralColor = [221, 221, 221];
      const angryColor = [172, 50, 50];

      // Box
      drawTooltipBox(
        positionComponent,
        spriteComponent,
        itemToBuy,
        '#ddd',
        this.renderer,
      );

      // Arrow
      // this.renderer.drawSprite(
        // 32,
        // 8,
        // 4,
        // 4,
        // x,
        // positionComponent.y - spriteComponent.dh + 3, 
        // 4,
        // 4,
      // );
    });
  }
}
