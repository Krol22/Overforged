import { AnvilComponent } from '@/components/anvil.component';
import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PlayerComponent } from '@/components/player.component';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

export class AnvilSystem extends System {
  private renderer: Renderer;
  private playerEntity: Entity;

  constructor(playerEntity: Entity, renderer: Renderer) {
    super([
      ComponentTypes.Anvil,
      ComponentTypes.Interaction,
      ComponentTypes.Funnel,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
  }

  public update(_dt: number): void {
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    this.systemEntities.map((entity) => {
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);
      const anvilComponent = entity.getComponent<AnvilComponent>(ComponentTypes.Anvil);

      if (!funnelComponent.canUseEntityId) {
        return;
      }

      console.log("ANVIL TIME");
    });
  }
}
