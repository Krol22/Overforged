import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class HealthComponent extends Component {
  public currentHealth: number;
  public maxHealth: number; 

  constructor(maxHealth: number) {
    super(ComponentTypes.Health);

    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  public doDamage(damage: number) {
    this.currentHealth -= damage;

    if (this.currentHealth < 0) {
      this.currentHealth = 0;
    }
  }
} 
