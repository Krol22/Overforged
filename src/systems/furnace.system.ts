import { ComponentTypes } from '@/components/component.types';
import { FurnaceComponent } from '@/components/furnace.component';
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
      ComponentTypes.Furnace,
      ComponentTypes.Transformer,
    ]);

    this.renderer = renderer;
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const furnaceComponent = entity.getComponent<FurnaceComponent>(ComponentTypes.Furnace);

      // Heating furnace itself
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
      if (furnaceComponent.hasItemInside) {
        const steelEntity = this.allEntities.find((e) => e.id === furnaceComponent.heatingEntityId);

        if (steelEntity) {
          const steelComponent = steelEntity.getComponent<SteelComponent>(ComponentTypes.Steel);

          if (!steelComponent.isHeated) {
            steelComponent.heatCounter += furnaceComponent.temperature;

            if (steelComponent.heatCounter >= MaxHeatLevel) {
              steelComponent.isHeated = true;
              furnaceComponent.entityHeated = true;
            }
          }
        } else {
          console.error('NO STEEL ENTITY');
        }
      }

      // Heat level UI
      const progress = 80 * furnaceComponent.temperature / 100;

      this.renderer.drawRect(
        this.renderer.canvasWidth - 40,
        40 + 80 - progress,
        20,
        progress,
        { color: '#f00', fill: true },
      );
      this.renderer.drawRect(this.renderer.canvasWidth - 40, 40, 20, 80, { color: '#fff', lineWidth: 2 });

      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      if (furnaceComponent.hasItemInside) {
        spriteComponent.color = '#ccc';

        if (furnaceComponent.entityHeated) {
          spriteComponent.color = '#cc0';
        }
      } else {
        spriteComponent.color = '#888';
      }
    });
  }
}
