export class GameData {
  public isPaused: boolean = false;

  public day: number = 1;
  public currentTime: number = 0;

  public customersToSpawn: number = -1;
  public customersThisDay: number = this.customersToSpawn;
  public alreadySpawnedCustomers: number = 0;
  public coins: number = 0;

  public maxClientSpawned: number = 2;
  public visibleCustomers: number = 0;

  public dailyCustomerSatisfaction: number = 0;

  public happyClientsHandled: number = 0;
  public clientsHandled: number = 0;

  public totalSatisfaction: number = 10;

  // Control variables
  public isDayChangeOverlayVisible: boolean = false;

  // Upgradeable variables
  public fuelEfficency = 100;
  public furnaceTemperatureFactor = 0.1;


  public finishDay() {
    this.isPaused = true;
    this.isDayChangeOverlayVisible = true;

    this.totalSatisfaction += this.dailyCustomerSatisfaction;
  }

  public startNextDay() {
    this.isPaused = false;

    this.day = this.day + 1;
    this.customersToSpawn = this.day + 3;
    // this.remaningCustomers = this.customersToSpawn;
    this.isDayChangeOverlayVisible = false;
    this.dailyCustomerSatisfaction = 0;

    this.currentTime = 0;
    this.alreadySpawnedCustomers = 0;
  }
}
