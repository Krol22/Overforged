import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { MaxSharpingTime, SharpenerComponent } from '@/components/sharpener.component';
import { TransformerComponent } from '@/components/transformer.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class SharpenerSystem extends System {
  public playerEntity: Entity;
  public renderer: Renderer;

  constructor(playerEntity: Entity, renderer: Renderer) {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Interaction,
      ComponentTypes.Sharpener,
      ComponentTypes.Transformer,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.forEach((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const sharpenerComponent = entity.getComponent<SharpenerComponent>(ComponentTypes.Sharpener);
      const transformerComponent = entity.getComponent<TransformerComponent>(ComponentTypes.Transformer);

      if (funnelComponent.canUseEntityId) {
        if (controls.isConfirm) {
          playerPlayerComponent.hasMoveLocked = true;
          const hasSharpenItem = this.sharpenItem(sharpenerComponent);
          if (!hasSharpenItem) {
            return; 
          }

          const item = this.getEntity(funnelComponent.canUseEntityId);
          this.transformItemAfterSharping(item, transformerComponent);
          playerPlayerComponent.hasMoveLocked = false;
        } else {
          playerPlayerComponent.hasMoveLocked = false;
        }
      }
    });
  }

  private sharpenItem(sharpenerComponent: SharpenerComponent): boolean {
    sharpenerComponent.sharpenerCount += sharpenerComponent.sharpingSpeed;
    
    const progress = 80 * sharpenerComponent.sharpenerCount / 100;

    this.renderer.drawRect(
      this.renderer.canvasWidth - 20,
      40 + 80 - progress,
      20,
      progress,
      { color: '#ff0', fill: true },
    );
    this.renderer.drawRect(this.renderer.canvasWidth - 40, 40, 20, 80, { color: '#fff', lineWidth: 2 });

    if (sharpenerComponent.sharpenerCount > MaxSharpingTime) {
      sharpenerComponent.sharpenerCount = 0;
      return true;
    }

    return false;
  }

  private transformItemAfterSharping(item: Entity, transformerComponent: TransformerComponent) {
    const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
    pickableComponent.item = transformerComponent.transform(pickableComponent.item);
  }
}
