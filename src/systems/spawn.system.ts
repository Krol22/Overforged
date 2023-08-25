import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { PhysicsComponent } from '@/components/physics.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item, SpawnerComponent } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { SteelComponent } from '@/components/steel.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { UI } from '@/core/ui';

function spawnCoal(): Entity {
  const coal = new Entity();

  const spriteHeight = 5;

  const positionComponent = new PositionComponent(Math.random() * 50, 170 - spriteHeight);
  const spriteComponent = new SpriteComponent(18, 8, 6, spriteHeight);
  const interactionComponent = new InteractionComponent(2, { x: 0, y: 0, w: 8, h: 4 });
  const pickableComponent = new PickableComponent(Item.coal, true);
  const physicsComponent = new PhysicsComponent();
  physicsComponent.affectedByGravity = true;
  pickableComponent.isPicked = true;

  coal.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    pickableComponent,
    physicsComponent,
  ]);

  return coal;
}

function spawnSteel(): Entity {
  const steel = new Entity();

  const spriteHeight = 7;
  const positionComponent = new PositionComponent(Math.random() * 50, 170 - spriteHeight);
  const spriteComponent = new SpriteComponent(25, 8, 7, spriteHeight);
  const interactionComponent = new InteractionComponent(2, { x: 0, y: 0, w: 2, h: 8 });
  const pickableComponent = new PickableComponent(Item.steel);
  const steelComponent = new SteelComponent();
  const physicsComponent = new PhysicsComponent();
  physicsComponent.affectedByGravity = true;

  pickableComponent.isPicked = true;

  steel.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    pickableComponent,
    steelComponent,
    physicsComponent,
  ]);

  return steel;
}

export class SpawnSystem extends System {
  private playerEntity: Entity;
  private ui: UI;

  constructor(playerEntity: Entity, ui: UI) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Spawner,
      ComponentTypes.Position,
    ]);

    this.playerEntity = playerEntity;
    this.ui = ui;
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

      const spawner = entity.getComponent<SpawnerComponent>(ComponentTypes.Spawner);

      this.ui.setActionText(`Press <SPACE> to pick up the ${spawner.itemType}`);

      if (controls.isConfirm && !controls.previousState.isConfirm) {
        switch (spawner.itemType) {
          case (Item.coal):
            const newCoal = spawnCoal();
            this.addEntity(newCoal);
            playerPlayerComponent.pickedItem = newCoal.id;
            break;
          case (Item.steel):
            const newSteel = spawnSteel();
            this.addEntity(newSteel);
            playerPlayerComponent.pickedItem = newSteel.id;
            break;
        }

        return;
      }
    });
  }
}
