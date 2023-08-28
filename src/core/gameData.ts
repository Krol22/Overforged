export class GameData {
  public isPaused: boolean = false;
  public day: number = 1;

  public remaningEnemies: number = 5;
  public enemiesToSpawn: number = 5;
  public coins: number = 0;

  // Control variables
  public isDayChangeOverlayVisible: boolean = false;

  // Upgradeable variables
  public fuelEfficency = 100;
  public furnaceTemperatureFactor = 0.1;


  public finishDay() {
    this.isPaused = true;
    this.isDayChangeOverlayVisible = true;
  }

  public startNextDay() {
    this.isPaused = false;

    this.day = this.day + 1;
    this.enemiesToSpawn = this.day + 3;
    this.remaningEnemies = this.enemiesToSpawn;
    this.isDayChangeOverlayVisible = false;
  }
}
