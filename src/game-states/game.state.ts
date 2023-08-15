import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { LabelComponent } from '@/components/label.component';
import { PickableComponent } from '@/components/pickable.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item, SpawnerComponent } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { ECS, Entity } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { State } from '@/core/state';
import { ControlsSystem } from '@/systems/controls.system';
import { DrawSystem } from '@/systems/draw.system';
import { DropzoneSystem } from '@/systems/dropzone.system';
import { FurnaceSystem } from '@/systems/furnace.system';
import { FurnaceDropSystem } from '@/systems/furnaceDrop.system';
import { HightlightSystem } from '@/systems/hightlight.system';
import { LabelSystem } from '@/systems/label.system';
import { OverlapSystem } from '@/systems/overlap.system';
import { PickupsSystem } from '@/systems/pickups.system';
import { SpawnSystem } from '@/systems/spawn.system';

const floorLevel = 170;

function spawnFurnace(): Entity {
  const furnaceEntity = new Entity();

  const spriteHeight = 32;

  const positionComponent = new PositionComponent(250, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 32, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Furnace');
  const funnelComponent = new FunnelComponent([Item.coal, Item.iron], 'furnace');
  const furnaceComponent = new FurnaceComponent();

  furnaceEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    funnelComponent,
    furnaceComponent,
  ]);

  return furnaceEntity;
}

function spawnAnvil(): Entity {
  const anvilEntity = new Entity();

  const spriteHeight = 16;

  const positionComponent = new PositionComponent(150, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 16, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Anvil');

  anvilEntity.addComponents([positionComponent, spriteComponent, interactionComponent, labelComponent]);

  return anvilEntity;
}

function spawnCoalpile(): Entity {
  const coalpile = new Entity();

  const spriteHeight = 16;

  const positionComponent = new PositionComponent(310, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 16, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Coal pile');
  const spawnerComponent = new SpawnerComponent(Item.coal);

  coalpile.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    spawnerComponent,
  ]);

  return coalpile;
}

function spawnIronBox(): Entity {
  const ironBox = new Entity();

  const spriteHeight = 16;

  const positionComponent = new PositionComponent(205, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 16, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Iron');
  const spawnerComponent = new SpawnerComponent(Item.iron);

  ironBox.addComponents([positionComponent, spriteComponent, interactionComponent, labelComponent, spawnerComponent]);

  return ironBox;
}

function spawnCoal(): Entity {
  const coal = new Entity();

  const spriteHeight = 4;

  const positionComponent = new PositionComponent(100, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 8, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Coal');
  const pickableComponent = new PickableComponent(Item.coal);

  coal.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    pickableComponent,
  ]);

  return coal;
}

function spawnIron(): Entity {
  const iron = new Entity();
  return iron;
}

function spawnPlayer(): Entity {
  const playerEntity = new Entity();

  const spriteHeight = 16;

  const positionComponent = new PositionComponent(90, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 16, spriteHeight, '#fff');
  const playerComponent = new PlayerComponent();

  playerEntity.addComponents([positionComponent, spriteComponent, playerComponent]);

  return playerEntity;
}

class GameState implements State {
  private readonly ecs: ECS;
  private readonly renderer: Renderer;

  constructor() {
    this.ecs = new ECS();

    const canvas = document.querySelector('#canvas');

    this.renderer = new Renderer(canvas);
  }

  onEnter() {
    const playerEntity = spawnPlayer();
    const furnaceEntity = spawnFurnace();
    const anvilEntity = spawnAnvil();
    const coalpileEntity = spawnCoalpile();
    const ironBoxEntity = spawnIronBox();
    const coalEntity = spawnCoal();
    const ironEntity = spawnIron();

    this.ecs.addEntities([
      furnaceEntity,
      anvilEntity,
      coalpileEntity,
      ironBoxEntity,
      coalEntity,
      ironEntity,

      playerEntity,
    ]);

    const drawSystem = new DrawSystem(this.renderer);
    const controlsSystem = new ControlsSystem();
    const highlightSystem = new HightlightSystem();
    const overlapSystem = new OverlapSystem(playerEntity);
    const labelSystem = new LabelSystem(this.renderer);
    const furnaceSystem = new FurnaceSystem(this.renderer);
    const pickupsSystem = new PickupsSystem(playerEntity, this.renderer);
    const dropzoneSystem = new DropzoneSystem(playerEntity, this.renderer);
    const furnaceDropSystem = new FurnaceDropSystem(playerEntity);
    const spawnSystem = new SpawnSystem(playerEntity);

    this.ecs.addSystems([
      controlsSystem,

      highlightSystem,
      overlapSystem,
      dropzoneSystem,
      furnaceSystem,
      furnaceDropSystem,
      pickupsSystem,
      labelSystem,

      drawSystem,
      spawnSystem,
    ]);

    this.ecs.start(); 
  }

  onUpdate(dt: number) {
    this.renderer.clear();

    this.ecs.update(dt);
  }
}

export const gameState = new GameState();
