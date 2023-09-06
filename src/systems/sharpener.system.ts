import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { MaxSharpingTime, SharpenerComponent } from '@/components/sharpener.component';
import { SpriteComponent } from '@/components/sprite.component';
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
      ComponentTypes.Position,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
    this.ui = ui;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);
    const playerSpriteComponent = this.playerEntity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

    this.systemEntities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const sharpenerComponent = entity.getComponent<SharpenerComponent>(ComponentTypes.Sharpener);
      const transformerComponent = entity.getComponent<TransformerComponent>(ComponentTypes.Transformer);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      // playerSpriteComponent.sx = 32;
      // playerSpriteComponent.sy = 26;

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
        // playerSpriteComponent.sx = 48;
        // playerSpriteComponent.sy = 26;

        const hasSharpenItem = this.sharpenItem(positionComponent, sharpenerComponent);
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

  private sharpenItem(positionComponent: PositionComponent, sharpenerComponent: SharpenerComponent): boolean {
    sharpenerComponent.sharpenerCount += this.gameData.sharpening;
    
    const progress = 11 * sharpenerComponent.sharpenerCount / MaxSharpingTime;

    this.renderer.drawRect(
      positionComponent.x,
      positionComponent.y - 9,
      progress,
      2,
      {
        color: '#ddd',
        lineWidth: 1,
        fill: true,
      },
    );

    this.renderer.drawSprite(
      11,
      26,
      13,
      4,
      positionComponent.x - 2,
      positionComponent.y - 10,
      13,
      4,
    );

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
