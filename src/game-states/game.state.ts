import { PositionComponent } from '@/components/position.component';
import { SpriteComponent } from '@/components/sprite.component';
import { ECS, Entity } from '@/core/ecs';
import { Renderer } from '@/core/renderer';
import { State } from '@/core/state';
import { DrawSystem } from '@/systems/draw.system';

class GameState implements State {
  private readonly ecs: ECS;
  private readonly renderer: Renderer;

  constructor() {
    this.ecs = new ECS();

    const canvas = document.querySelector('.canvas');

    this.renderer = new Renderer(canvas);
  }

  onEnter() {
    // Spawn player

    const playerEntity = new Entity();

    const positionComponent = new PositionComponent(0, 0);
    const spriteComponent = new SpriteComponent(0, 0, 16, 16);

    playerEntity.addComponents([positionComponent, spriteComponent]);

    this.ecs.addEntities([
      playerEntity,
    ]);

    const drawSystem = new DrawSystem(this.renderer);

    this.ecs.addSystems([
      drawSystem,
    ]);

    this.ecs.start(); 
  }

  onUpdate(dt: number) {
    this.ecs.update(dt);
    this.renderer.clear();
  }
}

export const gameState = new GameState();
