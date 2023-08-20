import { AnvilComponent } from '@/components/anvil.component';
import { DeskComponent } from '@/components/desk.component';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { LabelComponent } from '@/components/label.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { SharpenerComponent } from '@/components/sharpener.component';
import { Item, SpawnerComponent } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { anvilTransformerDefinition, furnaceTransformerDefinition, sharpenerTransformerDefinition, TransformerComponent } from '@/components/transformer.component';
import { ECS, Entity } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { State } from '@/core/state';
import { AnvilSystem } from '@/systems/anvil.system';
import { ControlsSystem } from '@/systems/controls.system';
import { DeskSystem } from '@/systems/desk.system';
import { DrawSystem } from '@/systems/draw.system';
import { DropzoneSystem } from '@/systems/dropzone.system';
import { FurnaceSystem } from '@/systems/furnace.system';
import { FurnaceDropSystem } from '@/systems/furnaceDrop.system';
import { HightlightSystem } from '@/systems/hightlight.system';
import { OverlapSystem } from '@/systems/overlap.system';
import { PickupsSystem } from '@/systems/pickups.system';
import { SharpenerSystem } from '@/systems/sharpener.system';
import { SpawnSystem } from '@/systems/spawn.system';

const floorLevel = 170;

function spawnDesk(): Entity {
  const deskEntity = new Entity();

  const spriteHeight = 24; 

  const positionComponent = new PositionComponent(50, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 8, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const funnelComponent = new FunnelComponent([
    Item.dagger,
    Item.horseShoe,
    Item.sword,
    Item.axe,
  ], 'desk');
  const deskComponent = new DeskComponent();

  deskEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    funnelComponent,
    deskComponent,
  ]);

  return deskEntity;
}

function spawnSharpener(): Entity {
  const sharpenerEntity = new Entity();

  const spriteHeight = 16;

  const positionComponent = new PositionComponent(90, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 8, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const transformerComponent = new TransformerComponent(sharpenerTransformerDefinition);
  const funnelComponent = new FunnelComponent([
    Item.dagger1,
    Item.sword4,
    Item.axe2,
  ], 'sharpener');
  const sharpenerComponent = new SharpenerComponent();

  sharpenerEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    transformerComponent,
    funnelComponent,
    sharpenerComponent,
  ]);

  return sharpenerEntity;
}

function spawnFurnace(): Entity {
  const furnaceEntity = new Entity();

  const spriteHeight = 48;

  const positionComponent = new PositionComponent(250, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 32, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const labelComponent = new LabelComponent('Furnace');

  const funnelComponent = new FunnelComponent([
    Item.coal,
    Item.steel,
    Item.sword1,
  ], 'furnace');

  const furnaceComponent = new FurnaceComponent();
  const transformerComponent = new TransformerComponent(furnaceTransformerDefinition);

  furnaceEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    funnelComponent,
    furnaceComponent,
    transformerComponent,
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

  const funnelComponent = new FunnelComponent([
    Item.hotSteel,
    Item.sword2,
    Item.sword3,
    Item.axe1,
  ], 'Anvil');

  const anvilComponent = new AnvilComponent();
  const transformerComponent = new TransformerComponent(anvilTransformerDefinition);

  anvilEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    funnelComponent,
    anvilComponent,
    transformerComponent,
  ]);

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
  const labelComponent = new LabelComponent('Steel box');
  const spawnerComponent = new SpawnerComponent(Item.steel);

  ironBox.addComponents([positionComponent, spriteComponent, interactionComponent, labelComponent, spawnerComponent]);

  return ironBox;
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
    const sharpenerEntity = spawnSharpener();
    const deskEntity = spawnDesk();

    this.ecs.addEntities([
      furnaceEntity,
      anvilEntity,
      coalpileEntity,
      ironBoxEntity,

      sharpenerEntity,
      deskEntity,

      playerEntity,
    ]);

    const drawSystem = new DrawSystem(this.renderer);
    const controlsSystem = new ControlsSystem();
    const highlightSystem = new HightlightSystem();
    const overlapSystem = new OverlapSystem(playerEntity);
    const furnaceSystem = new FurnaceSystem(this.renderer);
    const pickupsSystem = new PickupsSystem(playerEntity, this.renderer);
    const dropzoneSystem = new DropzoneSystem(playerEntity, this.renderer);
    const furnaceDropSystem = new FurnaceDropSystem(playerEntity);
    const spawnSystem = new SpawnSystem(playerEntity, this.renderer);
    const anvilSystem = new AnvilSystem(playerEntity, this.renderer);
    const sharpenerSystem = new SharpenerSystem(playerEntity, this.renderer);
    const deskSystem = new DeskSystem(playerEntity);

    this.ecs.addSystems([
      controlsSystem,

      highlightSystem,
      overlapSystem,
      furnaceSystem,
      sharpenerSystem,
      furnaceDropSystem,
      anvilSystem,
      deskSystem,
      pickupsSystem,
      dropzoneSystem,

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
