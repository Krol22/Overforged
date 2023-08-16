import { AnvilComponent } from '@/components/anvil.component';
import { FunnelComponent } from '@/components/funnel.component';
import { FurnaceComponent } from '@/components/furnace.component';
import { InteractionComponent } from '@/components/interaction.component';
import { LabelComponent } from '@/components/label.component';
import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { Item, SpawnerComponent } from '@/components/spawner.component';
import { SpriteComponent } from '@/components/sprite.component';
import { ECS, Entity } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { State } from '@/core/state';
import { AnvilSystem } from '@/systems/anvil.system';
import { ControlsSystem } from '@/systems/controls.system';
import { DrawSystem } from '@/systems/draw.system';
import { DropzoneSystem } from '@/systems/dropzone.system';
import { FurnaceSystem } from '@/systems/furnace.system';
import { FurnaceDropSystem } from '@/systems/furnaceDrop.system';
import { HightlightSystem } from '@/systems/hightlight.system';
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
  const funnelComponent = new FunnelComponent([Item.coal, Item.steel], 'furnace');
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
  const funnelComponent = new FunnelComponent([Item.hotSteel], 'Anvil');
  const anvilComponent = new AnvilComponent();

  anvilEntity.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    labelComponent,
    funnelComponent,
    anvilComponent,
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

    this.ecs.addEntities([
      furnaceEntity,
      anvilEntity,
      coalpileEntity,
      ironBoxEntity,

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

    this.ecs.addSystems([
      controlsSystem,

      highlightSystem,
      overlapSystem,
      dropzoneSystem,
      furnaceSystem,
      furnaceDropSystem,
      anvilSystem,
      pickupsSystem,

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
