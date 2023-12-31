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
import { gameData, GameData } from '@/core/gameData';
import { Renderer } from '@/core/renderer';
import { State } from '@/core/state';
import { UI } from '@/core/ui';
import { AnvilSystem } from '@/systems/anvil.system';
import { ControlsSystem } from '@/systems/controls.system';
import { DeskSystem } from '@/systems/desk.system';
import { DrawSystem } from '@/systems/draw.system';
import { DropzoneSystem } from '@/systems/dropzone.system';
import { CustomerSpawnSystem } from '@/systems/customerSpawn.system';
import { FunnelSystem } from '@/systems/funnel.system';
import { FurnaceSystem } from '@/systems/furnace.system';
import { FurnaceDropSystem } from '@/systems/furnaceDrop.system';
import { HealthBarSystem } from '@/systems/healthBar.system';
import { ItemSpriteSystem } from '@/systems/itemSprite.system';
import { OverlapSystem } from '@/systems/overlap.system';
import { PhysicsSystem } from '@/systems/physics.system';
import { PickupsSystem } from '@/systems/pickups.system';
import { SharpenerSystem } from '@/systems/sharpener.system';
import { SpawnSystem } from '@/systems/spawn.system';
import { CustomerSpawnerComponent } from '@/components/customerSpawner.component';
import { CustomerTooltipSystem } from '@/systems/customerTooltip.system';
import { CustomerQueueSystem } from '@/systems/customerQueue.system';
import { FloorLevel, RightWallX } from '@/consts';
import { CustomerDespawnSystem } from '@/systems/customerDespawn.system';
import { FunnelNotifySystem } from '@/systems/funnelNotify.system';
import { DropzoneActionTextSystem } from '@/systems/dropzoneActionText.system';
import { MovementAnimationSystem } from '@/systems/movementAnimation.system';
import { ScreenTransition } from '@/core/screen-transition';
import { CustomerWaitSystem } from '@/systems/customerWait.system';
import { gameStateMachine } from '@/game-state-machine';
import { gameOverState } from './gameOver.state';

function spawnDesk(): Entity {
  const deskEntity = new Entity();

  const spriteHeight = 8; 

  const positionComponent = new PositionComponent(RightWallX - 160, FloorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(34, 0, 16, spriteHeight);
  const interactionComponent = new InteractionComponent(1, { x: 0, y: 0, w: 16, h: 12 });
  const funnelComponent = new FunnelComponent([
    Item.horseShoe,
    Item.weapon,
    Item.axe,
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

  const spriteHeight = 8;

  const positionComponent = new PositionComponent(RightWallX - 115, FloorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(13, 0, 7, spriteHeight);
  const interactionComponent = new InteractionComponent(1, { x: 0, y: 0, w: 7, h: 9 });
  const transformerComponent = new TransformerComponent(sharpenerTransformerDefinition);
  const funnelComponent = new FunnelComponent([
    Item.weapon3,
    Item.axe1,
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

  const spriteHeight = 20;

  const positionComponent = new PositionComponent(RightWallX - 45, FloorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 0, 13, spriteHeight);
  const interactionComponent = new InteractionComponent(1, { x: 2, y: 2, w: 9, h: 14 });
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

  const spriteHeight = 6;

  const positionComponent = new PositionComponent(RightWallX - 98, FloorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(13, 13, 12, spriteHeight);
  const interactionComponent = new InteractionComponent(1, { x: 0, y: 0, w: 12, h: 7 });

  const funnelComponent = new FunnelComponent([
    Item.hotSteel,
    Item.weapon2,
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
  ]);

  return anvilEntity;
}

function spawnCoalpile(): Entity {
  const coalpile = new Entity();

  const spriteHeight = 7;

  const positionComponent = new PositionComponent(RightWallX - 15, FloorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(13, 19, 14, spriteHeight);
  const interactionComponent = new InteractionComponent(1, { x: -1, y: 0, w: 16, h: 16 });
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

  const spriteHeight = 8;

  const positionComponent = new PositionComponent(RightWallX - 67, FloorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(0, 20, 11, spriteHeight);
  const interactionComponent = new InteractionComponent(1, { x: 1, y: 0, w: 9, h: 10 });
  const spawnerComponent = new SpawnerComponent(Item.steel);

  ironBox.addComponents([
    positionComponent,
    spriteComponent,
    interactionComponent,
    spawnerComponent, 
  ]);

  return ironBox;
}

function spawnCustomerSpawner(): Entity {
  const customerSpawner = new Entity();

  customerSpawner.addComponents([
    new CustomerSpawnerComponent(15),
  ]);

  return customerSpawner;
}

function spawnPlayer(): Entity {
  const playerEntity = new Entity();

  const spriteHeight = 14;

  const positionComponent = new PositionComponent(RightWallX - 145, FloorLevel - spriteHeight);
  const spriteComponent = new SpriteComponent(32, 26, 12, spriteHeight);
  const playerComponent = new PlayerComponent();
  const physicsComponent = new PhysicsComponent();

  playerEntity.addComponents([positionComponent, spriteComponent, playerComponent, physicsComponent]);

  return playerEntity;
}

class GameState implements State {
  private readonly ecs: ECS;
  private readonly renderer: Renderer;
  private readonly ui: UI;
  private readonly gameData: GameData;
  private readonly screenTransition: ScreenTransition;

  constructor() {
    this.gameData = gameData;
    this.ecs = new ECS(this.gameData);

    const canvas = document.querySelector('#canvas');

    this.renderer = new Renderer(canvas);
    this.ui = new UI(this.renderer, this.gameData);
    this.screenTransition = new ScreenTransition(this.renderer);

  }

  onEnter() {
    const playerEntity = spawnPlayer();
    const furnaceEntity = spawnFurnace();
    const anvilEntity = spawnAnvil();
    const coalpileEntity = spawnCoalpile();
    const ironBoxEntity = spawnIronBox();
    const sharpenerEntity = spawnSharpener();
    const deskEntity = spawnDesk();
    const customerSpawnerEntity = spawnCustomerSpawner();

    this.ecs.addEntities([
      furnaceEntity,
      anvilEntity,
      coalpileEntity,
      ironBoxEntity,

      sharpenerEntity,
      deskEntity,

      customerSpawnerEntity,

      playerEntity,
    ]);

    const drawSystem = new DrawSystem(this.renderer);
    const controlsSystem = new ControlsSystem();
    const overlapSystem = new OverlapSystem(playerEntity, this.renderer);
    const furnaceSystem = new FurnaceSystem(this.renderer);
    const pickupsSystem = new PickupsSystem(playerEntity, this.ui);
    const dropzoneSystem = new DropzoneSystem(playerEntity, this.ui);
    const furnaceDropSystem = new FurnaceDropSystem(playerEntity, this.ui);
    const spawnSystem = new SpawnSystem(playerEntity, this.ui);
    const anvilSystem = new AnvilSystem(playerEntity, this.renderer, this.ui);
    const sharpenerSystem = new SharpenerSystem(playerEntity, this.renderer, this.ui);
    const deskSystem = new DeskSystem(this.ui);
    const physicsSystem = new PhysicsSystem();
    const itemSpriteSystem = new ItemSpriteSystem();
    const funnelSystem = new FunnelSystem(playerEntity);
    const funnelNotifySystem = new FunnelNotifySystem(playerEntity, this.renderer);
    const healthBarSystem = new HealthBarSystem(this.renderer);
    const customerQueueSystem = new CustomerQueueSystem();

    const customerSpawnSystem = new CustomerSpawnSystem();
    const customerDespawnSystem = new CustomerDespawnSystem();
    const customerTooltipSystem = new CustomerTooltipSystem(this.renderer, this.ui);

    const dropzoneActionTextSystem = new DropzoneActionTextSystem(playerEntity, this.ui);
    const movementAnimationSystem = new MovementAnimationSystem();
    const customerWaitSystem = new CustomerWaitSystem();

    this.ecs.addSystems([
      controlsSystem,

      funnelSystem,
      dropzoneSystem,
      overlapSystem,
      furnaceSystem,
      sharpenerSystem,
      furnaceDropSystem,
      anvilSystem,
      deskSystem,
      pickupsSystem,
      itemSpriteSystem,

      physicsSystem,
      drawSystem,

      spawnSystem,
      customerSpawnSystem,
      customerDespawnSystem,
      healthBarSystem,
      customerTooltipSystem,
      customerQueueSystem,
      customerWaitSystem,
      funnelNotifySystem,

      dropzoneActionTextSystem,
      movementAnimationSystem,
    ]);

    this.gameData.isPaused = true;
    this.ecs.start(); 
    this.ecs.update(1); 
    
    this.screenTransition.startTransition(() => {
      this.gameData.isPaused = false;
    }, 50, true);
  }

  onUpdate(dt: number) {
    this.renderer.clear();
    this.ui.clear();

    this.ecs.isRunning = !this.gameData.isPaused;

    this.renderer.drawCelling();

    this.renderer.drawOutsideWall(50);
    this.renderer.drawRightWall();
    this.renderer.drawFloor();
    this.renderer.drawOrnaments(!!this.gameData.bench);

    this.ecs.update(dt);
    this.ecs.draw();

    this.renderer.drawSplitWall();
    this.renderer.drawEntry();

    if (
      this.gameData.visibleCustomers === 0 &&
      this.gameData.customersToSpawn === 0
    ) {
      this.gameData.lastCustomerNotification = true;
    }

    if (this.gameData.goToGameOverScreen) {
      this.screenTransition.startTransition(() => {
        gameStateMachine.setState(gameOverState);
      }, 50);
    }

    this.ui.draw();
    this.screenTransition.update();
  }
}

export const gameStateFactory = () => new GameState();
