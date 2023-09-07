// eslint-disable-next-line max-classes-per-file
import { generateRandomId } from '@/utils/generateId';
import { GameData } from './gameData';

export abstract class Component {
  public type: number;

  public changes: Array<Object> = [];

  constructor(type: number) {
    this.type = type;
  }
}

export class Entity {
  public id: string;
  public components: Record<number, Component> = {};

  public wasUpdated: boolean = false;

  constructor() {
    this.id = generateRandomId();
  }

  addComponents(components: Component[]) {
    components.forEach((component) => {
      this.components[component.type] = component;
    });

    this.wasUpdated = true;
  }

  hasEvery(types: Array<number>) {
    return types.every((type) => !!this.components[type]);
  }

  getComponent<T>(type: number): T {
    return this.components[type] as unknown as T;
  }
}

export abstract class System {
  public componentTypes: Array<number> = [];

  protected systemEntities: Array<Entity> = [];
  protected allEntities: Array<Entity> = [];
  protected gameData: GameData = new GameData(); 

  public markedToRemoveEntities: Array<string> = [];
  public newEntities: Array<Entity> = [];

  public setSystemEntities(systemEntities: Entity[]) {
    this.systemEntities = systemEntities;
  }

  public setEntities(entities: Entity[]) {
    this.allEntities = entities;
  }

  public markToRemove(id: string) {
    this.markedToRemoveEntities.push(id);
  }

  public getEntity(id?: string) {
    if (!id) {
      throw new Error(`ID IS UNDEFINED`);
    }

    const entity = this.allEntities.find((e) => e.id === id);

    if (!entity) {
      throw new Error(`Entity ${id} not found`);
    }

    return entity;
  }

  public attachGameData(gameData: GameData) {
    this.gameData = gameData;
  }

  public addEntity(entity: Entity) {
    this.newEntities.push(entity);
  }

  public abstract update(_dt: number): void

  constructor(componentTypes: Array<number>) {
    this.componentTypes = componentTypes;
  }
}

export class ECS {
  private gameData: GameData;
  public isRunning = false;

  private entities: Entity[] = [];
  private systems: System[] = [];

  private entitiesToRemove: Array<string> = [];
  private entitiesToAdd: Array<Entity> = [];

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  addEntities(entities: Entity[]) {
    this.entities.push(...entities);

    if (this.isRunning) {
      this.updateSystemEntities();
    }
  }

  removeEntities(ids: Array<string>) {
    this.entities = this.entities.filter((entity) => !ids.includes(entity.id));

    if (this.isRunning) {
      this.updateSystemEntities();
      return;
    }
  }

  addSystems(systems: System[]) {
    // Systems will be added only on start no need to check isRunning
    this.systems.push(...systems);
    this.systems.forEach((s) => {
      s.attachGameData(this.gameData);
    });
  }

  start() {
    this.isRunning = true;
    this.updateSystemEntities();
  }

  updateSystemEntities() {
    for (const system of this.systems) {
      const systemEntities = this.entities.filter((entity) => entity.hasEvery(system.componentTypes));
      system.setEntities(this.entities);
      system.setSystemEntities(systemEntities);
    }
  }

  draw() {
    for (const system of this.systems) {
      if ((system as any).draw !== null) {
        (system as any).draw?.();
      }
    }
  }

  update(dt: number) {
    if (!this.isRunning) {
      return;
    }

    for (const system of this.systems) {
      system.update(dt);

      this.entitiesToRemove.push(
        ...system.markedToRemoveEntities,
      );

      this.entitiesToAdd.push(
        ...system.newEntities,
      );

      system.newEntities = [];
      system.markedToRemoveEntities = [];
    }

    if (this.entitiesToAdd.length > 0) {
      this.addEntities(this.entitiesToAdd);
      this.entitiesToAdd = [];
    }

    if (this.entitiesToRemove.length > 0) {
      this.removeEntities(this.entitiesToRemove);
      this.entitiesToRemove = [];
    }

    const updatedEntities = this.entities.filter((e) => e.wasUpdated);
    if (updatedEntities.length > 0) {
      this.updateSystemEntities();
    }
  }
}

