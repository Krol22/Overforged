import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { ItemHolderComponent } from '@/components/itemHolder.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { MaxHeatLevel, SteelComponent } from '@/components/steel.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

const FuelEfficency = 100;
const MaxTemperature = 100;

export class FurnaceSystem extends System {
  private renderer: Renderer;

  constructor(renderer: Renderer) {
    super([
      ComponentTypes.Position,
      ComponentTypes.Furnace,
      ComponentTypes.Funnel,
      ComponentTypes.ItemHolder,
      ComponentTypes.Transformer,
    ]);

    this.renderer = renderer;
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const furnaceComponent = entity.getComponent<FurnaceComponent>(ComponentTypes.Furnace);
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const itemHolderComponent = entity.getComponent<ItemHolderComponent>(ComponentTypes.ItemHolder);

      // Heating furnace itself
      // console.log(furnaceComponent.fuel);
      // console.log(furnaceComponent.temperature);

      if (furnaceComponent.fuel > 0 && furnaceComponent.fuelCounter === 0) {
        furnaceComponent.fuel -= 1;
        furnaceComponent.fuelCounter = FuelEfficency;
      }

      if (furnaceComponent.fuelCounter > 0) {
        furnaceComponent.fuelCounter -= 0.5;
        furnaceComponent.temperature += 0.1;

        if (furnaceComponent.temperature >= MaxTemperature) {
          furnaceComponent.temperature = MaxTemperature;
        }
      }

      if (furnaceComponent.fuel === 0 && furnaceComponent.fuelCounter === 0) {
        furnaceComponent.temperature -= 0.1;

        if (furnaceComponent.temperature <= 0) {
          furnaceComponent.temperature = 0;
        }
      }

      // Heating steel
      if (itemHolderComponent.hasItemOn) {
        const steelEntity = this.allEntities.find((e) => e.id === itemHolderComponent.holdingItemId);

        if (steelEntity) {
          const steelComponent = steelEntity.getComponent<SteelComponent>(ComponentTypes.Steel);

          if (!steelComponent.isHeated) {
            steelComponent.heatCounter += furnaceComponent.temperature;

            if (steelComponent.heatCounter >= MaxHeatLevel) {
              steelComponent.isHeated = true;
              furnaceComponent.entityHeated = true;
              funnelComponent.isLocked = false;
            }
          }
        } else {
          console.error('NO STEEL ENTITY');
        }
      }

      // Heat level UI
      this.renderer.drawSprite(
        44,
        8,
        4,
        15,
        positionComponent.x + 16,
        positionComponent.y - 8,
        4,
        15,
      );

      let heatLevel = furnaceComponent.temperature / 34;

      this.renderer.drawSprite(
        27,
        15,
        5,
        6,
        positionComponent.x + 3,
        positionComponent.y + 14 - heatLevel,
        5,
        6,
      );

      // const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      if (itemHolderComponent.hasItemOn) {
        // spriteComponent.color = '#ccc';

        if (furnaceComponent.entityHeated) {
          // spriteComponent.color = '#cc0';
        }
      } else {
        // spriteComponent.color = '#888';
      }
    });
  }
}
