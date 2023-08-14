export class ECS {
  private isRunning = false;

  private entities: Entity[] = [];
  private systems: System[] = [];

  private entitiesToRemove: Array<string> = [];

  addEntities(entities: Entity[]) {
    this.entities.push(...entities);

    if (this.isRunning) {
      this.updateSystemEntities();
    }
  }

  removeEntities(ids: Array<string>) {
    if (this.isRunning) {
      this.entitiesToRemove = ids;
      return;
    }

    this.entities = this.entities.filter((entity) => ids.includes(entity.id));
  }

  addSystems(systems: System[]) {
    // Systems will be added only on start
    this.systems.push(...systems);
  }

  start() {
    this.isRunning = true;
    this.updateSystemEntities();
  }

  updateSystemEntities() {
    for (const system of this.systems) {
      const systemEntities = this.entities.filter((entity) => entity.hasEvery(system.componentTypes));
      system.setSystemEntities(systemEntities);
    }
  }

  update(dt: number) {
    if (!this.isRunning) {
      return;
    }

    for (const system of this.systems) {
      system.update(dt);
    }

    if (this.entitiesToRemove.length > 0) {
      this.entities = this.entities.filter((entity) => this.entitiesToRemove.includes(entity.id));
      this.entitiesToRemove = [];
      this.updateSystemEntities();
    }
  }
}

export abstract class Component {
  public type: string;

  constructor(type: string) {
    this.type = type;
  }
}

export class Entity {
  public id: string;
  private components: Record<string, Component> = {};

  constructor() {
    this.id = '1';
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

  public setSystemEntities(systemEntities: Entity[]) {
    this.systemEntities = systemEntities;
  }

  public abstract update(dt: number) {}

  constructor(componentTypes: Array<string>) {
    this.componentTypes = componentTypes;
  }
}
