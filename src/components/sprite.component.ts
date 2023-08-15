import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class SpriteComponent extends Component {
  public srcX: number = 0;
  public srcY: number = 0;
  public srcW: number = 0;
  public srcH: number = 0;
  public color: string = '#fff';
  public defaultColor: string = '#fff';
  public visible: boolean = true;

  constructor(srcX: number, srcY: number, srcW: number, srcH: number, color: string) {
    super(ComponentTypes.Sprite);

    this.srcX = srcX;
    this.srcY = srcY;
    this.srcW = srcW;
    this.srcH = srcH;
    this.color = color;
    this.defaultColor = color;
  }
}
