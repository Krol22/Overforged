import { ComponentTypes } from '@/components/component.types';
import { CustomerComponent } from '@/components/customer.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { CustomerWaitTime } from '@/consts';
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

  }

  public draw(_dt: number): void {
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

      const itemToBuy = customerComponent.wantsToBuy[0];

      const itemSpriteComponent = new SpriteComponent(0, 0, 0, 0);
      setSpriteCoords(itemToBuy, itemSpriteComponent);

      const neutralColor = [221, 221, 221];
      const angryColor = [172, 50, 50];

      const color = getTransitionColor(neutralColor, angryColor, customerComponent.waits, CustomerWaitTime);

      drawTooltipBox(
        positionComponent,
        spriteComponent,
        itemToBuy,
        `rgb(${color.join(', ')})`,
        this.renderer,
      );
    });
  }
}

function getTransitionColor(color1: Array<number>, color2: Array<number>, current_time: number, max_time: number) {
  // Initialize the resulting color as an array with three elements: [R, G, B]
  let transitionColor = [0, 0, 0];

  // Loop through each color channel (R, G, B)
  for (let i = 0; i < 3; i++) {
    // Perform linear interpolation for each color channel
    transitionColor[i] = Math.floor(
      color1[i] + (color2[i] - color1[i]) * (current_time / max_time)
    );
  }

  return transitionColor;
}
