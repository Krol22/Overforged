import { MaxSatisfaction } from '@/consts';
import { getUpgradeCost } from '@/utils/getUpgradeCost';

const fuelEfficencyBase = 100;
const sharpeningBase = 1;
const furnaceBase = 1;

export class GameData {
  public _isPaused: boolean = false;
  set isPaused(value: boolean) {
    this._isPaused = value;
  }

  get isPaused() {
    return this._isPaused;
  }

  public day: number = 0;
  public currentTime: number = 0;

  public _grindWheelLevel: number = 1;
  public set grindWheelLevel(value: number) {
    this._grindWheelLevel = value;
    this.sharpening = sharpeningBase + sharpeningBase * this.grindWheelLevel / 5;
  }

  public get grindWheelLevel() {
    return this._grindWheelLevel;
  }

  public _coalLevel: number = 1;
  public set coalLevel(value: number) {
    this._coalLevel = value;
    this.fuelEfficency = fuelEfficencyBase + fuelEfficencyBase * this.coalLevel / 10;
  }

  public get coalLevel() {
    return this._coalLevel;
  }

  public _furnaceLevel: number = 1;
  public set furnaceLevel(value: number) {
    this._furnaceLevel = value;
    this.furnaceEfficency = furnaceBase + furnaceBase * this.furnaceLevel / 10;
  }

  public get furnaceLevel() {
    return this._furnaceLevel;
  }

  public bench: number = 0;

  public customersToSpawn: number = 1;
  public customersThisDay: number = this.customersToSpawn;
  public alreadySpawnedCustomers: number = 0;
  public totalCoins: number = 400;

  public maxClientSpawned: number = 2;
  public visibleCustomers: number = 0;

  public _totalSatisfaction: number = 0;
  public set totalSatisfaction(value: number) {
    this._totalSatisfaction = value;
    if (this._totalSatisfaction >= 10) {
      this._totalSatisfaction = 10;
    }
  }

  public clientsHandled: number = 0;
  public get totalSatisfaction() {
    return this._totalSatisfaction;
  };

  // Control variables
  public isDayChangeOverlayVisible: boolean = false;
  public lastCustomerNotification: boolean = false;
  public goToGameOverScreen: boolean = false;
  public settingsVisible = false;

  // Upgradeable variables
  public fuelEfficency = 100;
  public furnaceTemperatureFactor = 0.1;
  public sharpening = 1;
  public furnaceEfficency = 1;

  public newGame(tutorialFirst: boolean) {
    if (tutorialFirst) {
      this.day = 0;
      this.customersToSpawn = 3;
      this.maxClientSpawned = 1;
    } else {
      this.day = 1;
      this.customersToSpawn = 5;
      this.maxClientSpawned = 2;
    }

    this.furnaceLevel = 1;
    this.grindWheelLevel = 1;
    this.coalLevel = 1;
    this.bench = 0;

    this.totalCoins = 0;
    this.totalSatisfaction = 10;
    this.clientsHandled = 0;

    this.isDayChangeOverlayVisible = false;
    this.lastCustomerNotification = false;
    this.goToGameOverScreen = false;
    this.isPaused = false;
  }

  public showSettings() {
    this.isPaused = true;
    this.settingsVisible = true;
  }

  public hideSettings() {
    this.isPaused = false;
    this.settingsVisible = false;
  }

  public finishDay() {
    this.isPaused = true;
    
    if (this.totalSatisfaction >= MaxSatisfaction) {
      this.totalSatisfaction = MaxSatisfaction;
    }

    if (this.totalSatisfaction <= 0) {
      this.goToGameOverScreen = true;
      return;
    }

    this.isDayChangeOverlayVisible = true;
  }

  public startNextDay() {
    this.isPaused = false;

    this.day = this.day + 1;
    this.customersToSpawn = 5 + getUpgradeCost(2, this.day);
    this.maxClientSpawned += 0.5;

    this.isDayChangeOverlayVisible = false;

    this.currentTime = 0;
    this.alreadySpawnedCustomers = 0;
  }
}

export const gameData = new GameData();
