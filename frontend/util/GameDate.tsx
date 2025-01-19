export enum GameSeason {
  Spring = "Spring",
  Summer = "Summer",
  Fall = "Fall",
  Winter = "Winter",
}

export class GameDate {
  static DAYS_IN_A_MONTH = 28;

  static SEASON_INDEX = {
    [GameSeason.Spring]: 0,
    [GameSeason.Summer]: 1,
    [GameSeason.Fall]: 2,
    [GameSeason.Winter]: 3,
  };

  public readonly canonicalDay: number;
  public readonly dayOfTheWeek: string;

  constructor(
    public readonly day: number,
    public readonly season: GameSeason,
    public readonly year: number
  ) {
    this.canonicalDay =
      year * (4 * GameDate.DAYS_IN_A_MONTH) +
      GameDate.SEASON_INDEX[season] * GameDate.DAYS_IN_A_MONTH +
      day;
    this.dayOfTheWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ][(day - 1) % 7];
  }
}
