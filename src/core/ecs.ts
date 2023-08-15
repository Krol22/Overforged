// eslint-disable-next-line max-classes-per-file
import { generateRandomId } from '@/utils/generateId';

export abstract class Component {
  public type: string;

  public changes: Array<Object> = [];

  constructor(type: string) {
    this.type = type;
  }

  update(change: Object) {
    this.changes.push(change);
  }

  commit() {
    Object.entries(this.changes).forEach(([key, value]) => {
      this[key as keyof typeof value] = value as any;
    });

    this.changes = [];
  }
}

export class Entity {
  public id: string;
  public components: Record<string, Component> = {};

  constructor() {
    this.id = generateRandomId();
  }

  addComponents(components: Component[]) {
    components.forEach((component) => {
      this.components[component.type] = component;
    });
  }

  hasEvery(types: Array<string>) {
    return types.every((type) => !!this.components[type]);
  }

  getComponent<T>(type: string): T {
    return this.components[type] as unknown as T;
  }
}

export abstract class System {
  public componentTypes: Array<string> = [];
  protected systemEntities: Array<Entity> = [];
  protected allEntities: Array<Entity> = [];

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

  public addEntity(entity: Entity) {
    this.newEntities.push(entity);
  }

  public abstract update(_dt: number): void

  constructor(componentTypes: Array<string>) {
    this.componentTypes = componentTypes;
  }
}

export class ECS {
  private isRunning = false;

  private entities: Entity[] = [];
  private systems: System[] = [];

  private entitiesToRemove: Array<string> = [];
  private entitiesToAdd: Array<Entity> = [];

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
  }
}

