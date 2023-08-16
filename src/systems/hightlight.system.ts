import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { SpriteComponent } from '@/components/sprite.component';
import { System } from '@/core/ecs';

export class HightlightSystem extends System {
  constructor() {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Sprite,
    ]);
  }

  public update(_dt: number): void {
    this.systemEntities.map((entity) => {
      const spriteComponent = entity.getComponent<SpriteComponent>(ComponentTypes.Sprite);
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      // if (interactionComponent.isOverlaping) {
        // spriteComponent.color = '#f00';
      // } else {
        // spriteComponent.color = spriteComponent.defaultColor;
      // }
    });
  }
}
