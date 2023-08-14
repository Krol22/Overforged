import { PlayerComponent } from '@/components/player.component';
import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { ECS, Entity } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { State } from '@/core/state';
import { ControlsSystem } from '@/systems/controls.system';
import { DrawSystem } from '@/systems/draw.system';

class GameState implements State {
  private readonly ecs: ECS;
  private readonly renderer: Renderer;

  constructor() {
    this.ecs = new ECS();

    const canvas = document.querySelector('#canvas');

    this.renderer = new Renderer(canvas);
  }

  onEnter() {
    // Spawn player

    const playerEntity = new Entity();

    const positionComponent = new PositionComponent(0, 150);
    const spriteComponent = new SpriteComponent(0, 0, 16, 16);
    const playerComponent = new PlayerComponent();

    playerEntity.addComponents([positionComponent, spriteComponent, playerComponent]);

    this.ecs.addEntities([
      playerEntity,
    ]);

    const drawSystem = new DrawSystem(this.renderer);
    const controlsSystem = new ControlsSystem();

    this.ecs.addSystems([
      drawSystem,
      controlsSystem,
    ]);

    this.ecs.start(); 
  }

  onUpdate(dt: number) {
    this.renderer.clear();

    this.ecs.update(dt);
  }
}

export const gameState = new GameState();
