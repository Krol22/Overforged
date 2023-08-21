import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { MaxSharpingTime, SharpenerComponent } from '@/components/sharpener.component';
import { TransformerComponent } from '@/components/transformer.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { UI } from '@/core/ui';

export class SharpenerSystem extends System {
  public playerEntity: Entity;
  public renderer: Renderer;
  public ui: UI;

  constructor(playerEntity: Entity, renderer: Renderer, ui: UI) {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Interaction,
      ComponentTypes.Sharpener,
      ComponentTypes.Transformer,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
    this.ui = ui;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.forEach((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const sharpenerComponent = entity.getComponent<SharpenerComponent>(ComponentTypes.Sharpener);
      const transformerComponent = entity.getComponent<TransformerComponent>(ComponentTypes.Transformer);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!playerPlayerComponent.pickedItem) {
        return;
      }

      const pickedItem = this.getEntity(playerPlayerComponent.pickedItem);
      const pickableComponent = pickedItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

      if (!funnelComponent.isValidItem(pickableComponent.item)) {
        return; 
      }

      if (!interactionComponent.isOverlaping) {
        return;
      }

      if (controls.isConfirm) {
        playerPlayerComponent.hasMoveLocked = true;
        const hasSharpenItem = this.sharpenItem(sharpenerComponent);
        if (!hasSharpenItem) {
          return; 
        }

        const item = this.getEntity(pickedItem.id);
        this.transformItemAfterSharping(item, transformerComponent);
        playerPlayerComponent.hasMoveLocked = false;
      } else {
        this.ui.setActionText('Press <SPACE> to sharpen item');
        playerPlayerComponent.hasMoveLocked = false;
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
    pickableComponent.disposable = true;
  }
}
