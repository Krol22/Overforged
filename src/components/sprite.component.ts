import { Component } from '@/core/ecs';
import { ComponentTypes } from './component.types';

export class SpriteComponent extends Component {
  public sx: number = 0;
  public sy: number = 0;
  public sw: number = 0;
  public sh: number = 0;

  public dw: number = 0;
  public dh: number = 0;

  public transformOriginX = 0;
  public transformOriginY = 0;

  public rotateDir: number = -1;

  public rotate: number = 0;
  public flipX: number = 1;
  public transformFlipX: number = 0;

  public color?: string;
  public defaultColor?: string = '#fff';
  public visible: boolean = true;

  constructor(sx: number, sy: number, sw: number, sh: number) {
    super(ComponentTypes.Sprite);

    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;

    this.dw = sw;
    this.dh = sh;
  }
}
