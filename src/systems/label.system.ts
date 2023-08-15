import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { LabelComponent } from '@/components/label.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

const offset_y = 20;

export class LabelSystem extends System {
  constructor(public readonly renderer: Renderer) {
    super([
      ComponentTypes.Label,
      ComponentTypes.Interaction,
      ComponentTypes.Position,
      ComponentTypes.Sprite,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!interactionComponent.isOverlaping) {
        return;
      }

      const positionComponent = entity.getComponent<PositionComponent>(ComponentTypes.Position);
      const labelComponent = entity.getComponent<LabelComponent>(ComponentTypes.Label);
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);

      const textWidth = labelComponent.text.length * 5;
      const posX = positionComponent.x + (spriteComponent.srcW / 2) - (textWidth / 2) + 2;

      console.log(spriteComponent.visible, labelComponent.text, positionComponent.y - offset_y);

      if (!spriteComponent.visible) {
        return;
      }


      this.renderer.drawText(labelComponent.text, Math.floor(posX), positionComponent.y - offset_y, {});
    });
  }
}
