import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { Renderer } from '@/core/renderer';
import { setSpriteCoords } from './setSpriteCoords';

export function drawTooltipBox (
  positionComponent: PositionComponent,
  spriteComponent: SpriteComponent,
  item: Item,
  color: string,
  renderer: Renderer
) {
  const itemSpriteComponent = new SpriteComponent(0, 0, 0, 0);
  setSpriteCoords(item, itemSpriteComponent);
  const x = positionComponent.x;

  const offsetY = -5;

  renderer.drawRect(
    x + Math.floor(spriteComponent.dw / 2) - 1 - itemSpriteComponent.dw / 2,
    positionComponent.y - itemSpriteComponent.dh - 5 + offsetY,
    itemSpriteComponent.dw + 4,
    itemSpriteComponent.dh + 6,
    {
      fill: true,
      color: '#000',
    }
  );

  renderer.drawRect(
      x + Math.floor(spriteComponent.dw / 2) - 2 - itemSpriteComponent.dw / 2,
      positionComponent.y - itemSpriteComponent.dh - 4 + offsetY,
      itemSpriteComponent.dw + 6,
      itemSpriteComponent.dh + 4,
    {
      fill: true,
      color: '#000',
    }
  );

  renderer.drawRect(
    x + Math.floor(spriteComponent.dw / 2) - itemSpriteComponent.dw / 2,
    positionComponent.y - itemSpriteComponent.dh - 4 + offsetY,
    itemSpriteComponent.dw + 2,
    itemSpriteComponent.dh + 4,
    {
      fill: true,
      color,
    }
  );

  renderer.drawRect(
    x + Math.floor(spriteComponent.dw / 2) - 1 - itemSpriteComponent.dw / 2,
    positionComponent.y - itemSpriteComponent.dh - 3 + offsetY,
    itemSpriteComponent.dw + 4,
    itemSpriteComponent.dh + 2,
    {
      fill: true,
      color,
    }
  );

  // Item
  renderer.drawSprite(
    itemSpriteComponent.sx,
    itemSpriteComponent.sy,
    itemSpriteComponent.sw,
    itemSpriteComponent.sh,
    x + Math.floor(spriteComponent.dw / 2) + 1 - itemSpriteComponent.dw / 2,
    positionComponent.y - itemSpriteComponent.dh - 2 + offsetY,
    itemSpriteComponent.dw,
    itemSpriteComponent.dh,
  );
}
