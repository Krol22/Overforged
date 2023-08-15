import { ComponentTypes } from '@/components/component.types';
import { FurnaceComponent } from '@/components/furnace.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

const FuelEfficency = 100;
const MaxTemperature = 100;

export class FurnaceSystem extends System {
  private renderer: Renderer;

  constructor(renderer: Renderer) {
    super([
      ComponentTypes.Furnace,
    ]);

    this.renderer = renderer;
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const furnaceComponent = entity.getComponent<FurnaceComponent>(ComponentTypes.Furnace);

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

      const progress = 80 * furnaceComponent.temperature / 100;

      this.renderer.drawRect(
        this.renderer.canvasWidth - 40,
        40 + 80 - progress,
        20,
        progress,
        { color: '#f00', fill: true },
      );
      this.renderer.drawRect(this.renderer.canvasWidth - 40, 40, 20, 80, { color: '#fff', lineWidth: 2 });
    });
  }
}
