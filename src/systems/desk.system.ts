import { ComponentTypes } from '@/components/component.types';
import { DeskComponent } from '@/components/desk.component';
import { FunnelComponent } from '@/components/funnel.component';
import { InteractionComponent } from '@/components/interaction.component';
import { PickableComponent } from '@/components/pickable.component';
import { Item } from '@/components/spawner.component';
import { controls } from '@/core/controls';
import { System } from '@/core/ecs';
import { UI } from '@/core/ui';

function* clearDeskAfter0Day() {
  const deskComponent: DeskComponent = yield;
  deskComponent.storedItems = [];
}

const cleaner = clearDeskAfter0Day();

export class DeskSystem extends System {
  constructor(
    private ui: UI,
  ) {
    super([
      ComponentTypes.Desk,
      ComponentTypes.Funnel,
      ComponentTypes.Position,
      ComponentTypes.ItemHolder,
      ComponentTypes.Interaction,
    ]);
  }

  public update(_dt: number): void {
    const deskEntity = this.systemEntities[0];

    if (!deskEntity) {
      return;
    }

    const deskComponent = deskEntity.getComponent<DeskComponent>(ComponentTypes.Desk);
    const interactionComponent = deskEntity.getComponent<InteractionComponent>(ComponentTypes.Interaction);
    const funnelComponent = deskEntity.getComponent<FunnelComponent>(ComponentTypes.Funnel);

    if (this.gameData.day !== 0) {
      cleaner.next(deskComponent);
    }

    const storedItems: Partial<Record<Item, number>> = {};

    deskComponent.storedItems.forEach((item) => {
      if (!storedItems[item]) {
        storedItems[item] = 0;
      }

      storedItems[item] = storedItems[item] as number + 1;
    });

    this.ui.storedItems = storedItems;

    if (!interactionComponent.isOverlaping) {
      return;
    }

    if (!funnelComponent.canUseEntityId) {
      return;
    }

    if (controls.isConfirm && !controls.previousState.isConfirm) {
      const droppedItem = this.getEntity(funnelComponent.canUseEntityId);
      const pickableComponent = droppedItem.getComponent<PickableComponent>(ComponentTypes.Pickable);

      deskComponent.addItem(pickableComponent.item);
    }

  }
}
