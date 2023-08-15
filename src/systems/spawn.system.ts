import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { LabelComponent } from '@/components/label.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';

function spawnCoal(): Entity {
  const coal = new Entity();

  const spriteHeight = 4;

  const positionComponent = new PositionComponent(Math.random() * 50, 170 - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 8, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Coal');
  const pickableComponent = new PickableComponent(Item.coal);

  pickableComponent.isPicked = true;

  coal.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    pickableComponent,
  ]);

  return coal;
}

export class SpawnSystem extends System {
  private playerEntity: Entity;

  constructor(playerEntity: Entity) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Spawner,
      ComponentTypes.Position,
    ]);

    this.playerEntity = playerEntity;
  }

  public update(_dt: number): void {

    this.systemEntities.forEach((entity) => {
      const interactionComponent = entity.getComponent<InteractionComponent>(ComponentTypes.Interaction);

      if (!interactionComponent.isOverlaping) {
        return;
      }

      const playerPlayerComponent = this.playerEntity.getComponent<PlayerComponent>(ComponentTypes.Player);

      if (playerPlayerComponent.hadItemPicked) {
        return;
      }

      if (controls.isConfirm && !controls.previousState.isConfirm) {
        const newCoal = spawnCoal();
        this.addEntity(newCoal);
        playerPlayerComponent.pickedItem = newCoal.id;

        return;
      }
    });
  }
}
