import { ComponentTypes } from '@/components/component.types';
import { InteractionComponent } from '@/components/interaction.component';
import { LabelComponent } from '@/components/label.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item, SpawnerComponent } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { SteelComponent } from '@/components/steel.component';
import { controls } from '@/core/controls';
import { Entity, System } from '@/core/ecs';
import { Renderer } from '@/core/renderer';

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

function spawnSteel(): Entity {
  const steel = new Entity();

  const spriteHeight = 8;
  const positionComponent = new PositionComponent(Math.random() * 50, 170 - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 2, spriteHeight, '#ddd');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Steel');
  const pickableComponent = new PickableComponent(Item.steel);
  const steelComponent = new SteelComponent();

  pickableComponent.isPicked = true;

  steel.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    pickableComponent,
    steelComponent,
  ]);

  return steel;
}

export class SpawnSystem extends System {
  private playerEntity: Entity;
  private renderer: Renderer;

  constructor(playerEntity: Entity, renderer: Renderer) {
    super([
      ComponentTypes.Interaction,
      ComponentTypes.Spawner,
      ComponentTypes.Position,
    ]);

    this.playerEntity = playerEntity;
    this.renderer = renderer;
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

      const text = `Press <SPACE> to pick up the ${spawner.itemType}`;
      const textWidth = text.length * 5;

      this.renderer.drawText(
        text,
        Math.floor(this.renderer.canvasWidth / 2 - textWidth / 2),
        this.renderer.canvasHeight - 10,
        { size: 1 },
      );

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
