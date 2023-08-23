import { AnvilComponent } from '@/components/anvil.component';
import { DeskComponent } from '@/components/desk.component';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { ItemHolderComponent } from '@/components/itemHolder.component';
import { PhysicsComponent } from '@/components/physics.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { SharpenerComponent } from '@/components/sharpener.component';
import { Item, SpawnerComponent } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { anvilTransformerDefinition, furnaceTransformerDefinition, sharpenerTransformerDefinition, TransformerComponent } from '@/components/transformer.component';
import { ECS, Entity } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { State } from '@/core/state';
import { UI } from '@/core/ui';
import { AnvilSystem } from '@/systems/anvil.system';
import { ControlsSystem } from '@/systems/controls.system';
import { DeskSystem } from '@/systems/desk.system';
import { DrawSystem } from '@/systems/draw.system';
import { DropzoneSystem } from '@/systems/dropzone.system';
import { FurnaceSystem } from '@/systems/furnace.system';
import { FurnaceDropSystem } from '@/systems/furnaceDrop.system';
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
    Item.horseShoe,
    Item.weapon,
    Item.tool,
  ], 'desk');
  const deskComponent = new DeskComponent();
  const itemHolderComponent = new ItemHolderComponent();

  deskEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    funnelComponent,
    deskComponent,
    itemHolderComponent,
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
    Item.weapon4,
    Item.tool2,
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
  const itemHolderComponent = new ItemHolderComponent();

  const funnelComponent = new FunnelComponent([
    Item.coal,
    Item.steel,
    Item.weapon1,
  ], 'furnace');

  const furnaceComponent = new FurnaceComponent();
  const transformerComponent = new TransformerComponent(furnaceTransformerDefinition);

  furnaceEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    funnelComponent,
    furnaceComponent,
    transformerComponent,
    itemHolderComponent,
  ]);

  return furnaceEntity;
}

function spawnAnvil(): Entity {
  const anvilEntity = new Entity();

  const spriteHeight = 16;

  const positionComponent = new PositionComponent(150, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 16, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const itemHolderComponent = new ItemHolderComponent();

  const funnelComponent = new FunnelComponent([
    Item.hotSteel,
    Item.weapon2,
    Item.weapon3,
    Item.tool1,
  ], 'Anvil');

  const anvilComponent = new AnvilComponent();
  const transformerComponent = new TransformerComponent(anvilTransformerDefinition);

  anvilEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    funnelComponent,
    anvilComponent,
    transformerComponent,
    itemHolderComponent,
  ]);

  return anvilEntity;
}

function spawnCoalpile(): Entity {
  const coalpile = new Entity();

  const spriteHeight = 16;

  const positionComponent = new PositionComponent(310, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 16, spriteHeight, '#888');
  const interactionComponent = new InteractionComponent();
  const spawnerComponent = new SpawnerComponent(Item.coal);

  coalpile.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
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
  const spawnerComponent = new SpawnerComponent(Item.steel);

  ironBox.addComponents([positionComponent, spriteComponent, interactionComponent, spawnerComponent]);

  return ironBox;
}

function spawnPlayer(): Entity {
  const playerEntity = new Entity();

  const spriteHeight = 15;

  const positionComponent = new PositionComponent(90, floorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(48, 18, 12, spriteHeight);
  const playerComponent = new PlayerComponent();
  const physicsComponent = new PhysicsComponent();

  playerEntity.addComponents([positionComponent, spriteComponent, playerComponent, physicsComponent]);

  return playerEntity;
}

class GameState implements State {
  private readonly ecs: ECS;
  private readonly renderer: Renderer;
  private readonly ui: UI;

  constructor() {
    this.ecs = new ECS();

    const canvas = document.querySelector('#canvas');

    this.renderer = new Renderer(canvas);
    this.ui = new UI(this.renderer);
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
    const overlapSystem = new OverlapSystem(playerEntity);
    const furnaceSystem = new FurnaceSystem(this.renderer);
    const pickupsSystem = new PickupsSystem(playerEntity, this.ui);
    const dropzoneSystem = new DropzoneSystem(playerEntity, this.ui);
    const furnaceDropSystem = new FurnaceDropSystem(playerEntity, this.ui);
    const spawnSystem = new SpawnSystem(playerEntity, this.ui);
    const anvilSystem = new AnvilSystem(this.renderer, this.ui);
    const sharpenerSystem = new SharpenerSystem(playerEntity, this.renderer, this.ui);
    const deskSystem = new DeskSystem(playerEntity);

    this.ecs.addSystems([
      controlsSystem,

      dropzoneSystem,
      overlapSystem,
      furnaceSystem,
      sharpenerSystem,
      furnaceDropSystem,
      anvilSystem,
      deskSystem,
      pickupsSystem,

      drawSystem,
      spawnSystem,
    ]);

    this.ecs.start(); 
  }

  onUpdate(dt: number) {
    this.renderer.clear();
    this.ui.clear();

    this.ecs.update(dt);
    this.ui.draw();
  }
}

export const gameState = new GameState();
