import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { PlayerComponent } from '@/components/player.component';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class ActionLabelSystem extends System {
  private playerEntity: Entity;
  private renderer: Renderer;

  constructor(playerEntity: Entity, renderer: Renderer) {
    super([
      ComponentTypes.Interaction,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (interactionComponent.isOverlaping && interactionComponent.emptyLabel) {
        const textWidth = interactionComponent.emptyLabel.length * 5;

        this.renderer.drawText(
          interactionComponent.emptyLabel,
          Math.floor(this.renderer.canvasWidth / 2 - textWidth / 2),
          this.renderer.canvasHeight - 10,
          { size: 1 },
        );
      }
    });
  }
}
