import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { ItemHolderComponent } from '@/components/itemHolder.component';
import { PickableComponent } from '@/components/pickable.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { MaxHeatLevel, SteelComponent } from '@/components/steel.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { drawTooltipBox } from '@/utils/drawTooltipBox';
import { setSpriteCoords } from '@/utils/setSpriteCoords';

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

      if (furnaceComponent.fuel > 0 && furnaceComponent.fuelCounter === 0) {
        furnaceComponent.fuel -= 1;
        furnaceComponent.fuelCounter = this.gameData.fuelEfficency;
      }

      if (furnaceComponent.fuelCounter > 0) {
        furnaceComponent.fuelCounter -= 0.5;
        furnaceComponent.temperature += 0.1;

        if (furnaceComponent.temperature >= MaxTemperature) {
          furnaceComponent.temperature = MaxTemperature;
        }
      }

      if (furnaceComponent.fuel === 0 && furnaceComponent.fuelCounter === 0) {
        furnaceComponent.temperature -= this.gameData.furnaceTemperatureFactor;

        if (furnaceComponent.temperature <= 25) {
          furnaceComponent.temperature = 25;
        }
      }

      // Heating steel
      if (itemHolderComponent.hasItemOn) {
        const steelEntity = this.getEntity(itemHolderComponent.holdingItemId);

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

      let heatLevel = Math.floor(furnaceComponent.temperature / 7);

      this.renderer.drawRect(
        positionComponent.x + 17,
        positionComponent.y - 7,
        2,
        13 - heatLevel,
        {
          fill: true,
          color: '#3d453d'
        }
      );

      heatLevel = furnaceComponent.temperature / 34;
      this.renderer.drawSprite(27, 15, 5, 6, positionComponent.x + 3, positionComponent.y + 14 - heatLevel, 5, 6);

      if (itemHolderComponent.hasItemOn) {
        let color = '#ddd';
        if (furnaceComponent.entityHeated) {
          color = '#97f3a7';
        }

        const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
        const item = this.getEntity(itemHolderComponent.holdingItemId);
        const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);

        drawTooltipBox(
          positionComponent,
          spriteComponent,
          pickableComponent.item,
          color,
          this.renderer,
        );
      }
    });
  }
}
