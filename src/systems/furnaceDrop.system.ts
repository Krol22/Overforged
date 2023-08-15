import { ComponentTypes } from '@/components/component.types';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';

export class FurnaceDropSystem extends System {
  public playerEntity: Entity;

  constructor(playerEntity: Entity) {
    super([
      ComponentTypes.Funnel,
      ComponentTypes.Furnace,
      ComponentTypes.Interaction,
    ]);

    this.playerEntity = playerEntity;
  } 

  public update(_dt: number): void {
    const playerPositionComponent = this.playerEntity.getComponent<PositionComponent>(ComponentTypes.Position);
    const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

    if (!playerPlayerComponent.pickedItem) {
      return;
    }

    this.systemEntities.map((entity) => {
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);
      const funnelComponent = entity.getComponent<FunnelComponent>(ComponentTypes.Funnel);

      if (
        interactionComponent.isOverlaping &&
        playerPlayerComponent.pickedItem &&
        controls.isConfirm && !controls.previousState.isConfirm
      ) {
        const item = this.allEntities.find(
          (e) => e.id === playerPlayerComponent.pickedItem
        );

        if (!item) {
          return;
        }

        const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);

        if (!funnelComponent.itemTypes.includes(pickableComponent.item)) {
          return;
        }

        const spriteComponent = item.getComponent<SpriteComponent>(ComponentTypes.Sprite);
        spriteComponent.visible = false;

        this.markToRemove(playerPlayerComponent.pickedItem);

        this.interactWithItem(entity, item);
      }
    });
  }

  private interactWithItem(furnace: Entity, item: Entity) {
    const pickableComponent = item.getComponent<PickableComponent>(ComponentTypes.Pickable);
    const furnaceComponent = furnace.getComponent<FurnaceComponent>(ComponentTypes.Furnace);

    switch (pickableComponent.item) {
      case (Item.coal):
        furnaceComponent.fuel = furnaceComponent.fuel + 1;
        break;
    }
  }
}
