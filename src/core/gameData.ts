import { MaxSatisfaction } from '@/consts';
import { getUpgradeCost } from '@/utils/getUpgradeCost';

const fuelEfficencyBase = 100;
const sharpeningBase = 1;

export class GameData {
  public _isPaused: boolean = false;
  set isPaused(value: boolean) {
    this._isPaused = value;
  }

  get isPaused() {
    return this._isPaused;
  }

  public day: number = 1;
  public currentTime: number = 0;

  public _grindWheelLevel: number = 1;
  public set grindWheelLevel(value: number) {
    this._grindWheelLevel = value;
    this.sharpening = sharpeningBase + sharpeningBase * this.grindWheelLevel / 2;
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
  public couch: number = 0;

  public customersToSpawn: number = 5;
  public customersThisDay: number = this.customersToSpawn;
  public alreadySpawnedCustomers: number = 0;
  public totalCoins: number = 100;

  public maxClientSpawned: number = 2;
  public visibleCustomers: number = 0;

  public dailyCustomerSatisfaction: number = 0;

  public happyClientsHandled: number = 0;
  public clientsHandled: number = 0;

  public totalSatisfaction: number = 10;

  // Control variables
  public isDayChangeOverlayVisible: boolean = true;
  public lastCustomerNotification: boolean = true;

  // Upgradeable variables
  public fuelEfficency = 100;
  public furnaceTemperatureFactor = 0.1;
  public sharpening = 1;

  public settingsVisible = false;

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
    this.isDayChangeOverlayVisible = true;

    this.totalSatisfaction += this.dailyCustomerSatisfaction;
    
    if (this.totalSatisfaction >= MaxSatisfaction) {
      this.totalSatisfaction = MaxSatisfaction;
    }
  }

  public startNextDay() {
    this.isPaused = false;

    this.day = this.day + 1;
    this.customersToSpawn = 5 + getUpgradeCost(2, this.day);
    this.maxClientSpawned += 1;

    this.isDayChangeOverlayVisible = false;
    this.dailyCustomerSatisfaction = 0;

    this.currentTime = 0;
    this.alreadySpawnedCustomers = 0;
  }
}

export const gameData = new GameData();
