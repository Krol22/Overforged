import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';

export function setSpriteCoords(item: Item, spriteComponent: SpriteComponent): void {

  switch(item) {
        case Item.steel:
          spriteComponent.sx = 25;
          spriteComponent.sy = 8;
          spriteComponent.sw = 7;
          spriteComponent.sh = 7;
          spriteComponent.dw = 7;
          spriteComponent.dh = 7;

          spriteComponent.transformOriginX = -8;
          break;

        case Item.coal:
          spriteComponent.transformOriginX = -7;
          break;

        case Item.axe:
          spriteComponent.sx = 58;
          spriteComponent.sy = 10;
          spriteComponent.sw = 10;
          spriteComponent.sh = 9;
          spriteComponent.dw = 10;
          spriteComponent.dh = 9;

          spriteComponent.transformOriginX = 7;

          break;
        case Item.axe1:
          spriteComponent.sx = 48;
          spriteComponent.sy = 10;
          spriteComponent.sw = 10;
          spriteComponent.sh = 9;
          spriteComponent.dw = 10;
          spriteComponent.dh = 9;

          spriteComponent.transformOriginX = 7;

          break;
        case Item.weapon:
          spriteComponent.sx = 80;
          spriteComponent.sy = 0;
          spriteComponent.sw = 10;
          spriteComponent.sh = 10;
          spriteComponent.dw = 10;
          spriteComponent.dh = 10;

          spriteComponent.transformOriginX = 7;

          break;
        case Item.weapon1:
          spriteComponent.sx = 50;
          spriteComponent.sy = 0;
          spriteComponent.sw = 10;
          spriteComponent.sh = 10;
          spriteComponent.dw = 10;
          spriteComponent.dh = 10;

          spriteComponent.transformOriginX = 7;

          break;
        case Item.weapon2:
          spriteComponent.sx = 60;
          spriteComponent.sy = 0;
          spriteComponent.sw = 10;
          spriteComponent.sh = 10;
          spriteComponent.dw = 10;
          spriteComponent.dh = 10;

          spriteComponent.transformOriginX = 7;

          break;
        case Item.weapon3:
          spriteComponent.sx = 70;
          spriteComponent.sy = 0;
          spriteComponent.sw = 10;
          spriteComponent.sh = 10;
          spriteComponent.dw = 10;
          spriteComponent.dh = 10;

          spriteComponent.transformOriginX = 7;
          
          break;
        case Item.hotSteel:
          spriteComponent.sx = 27;
          spriteComponent.sy = 0;
          spriteComponent.sw = 7;
          spriteComponent.sh = 7;
          spriteComponent.dw = 7;
          spriteComponent.dh = 7;

          spriteComponent.transformOriginX = -8;

          break;
        case Item.horseShoe:
          spriteComponent.sx = 20;
          spriteComponent.sy = 2;
          spriteComponent.sw = 7;
          spriteComponent.sh = 6;
          spriteComponent.dw = 7;
          spriteComponent.dh = 6;

          break;

  }
}
