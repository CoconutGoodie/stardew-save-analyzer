import {
  STARDEW_ACHIEVEMENT_FISHES,
  STARDEW_FISHES_BY_CATEGORIES,
} from "@src/const/StardewFishes";
import { Farmer } from "@src/gamesave/Farmer";
import { GameSave } from "@src/gamesave/GameSave";
import { keys, sumBy, values } from "remeda";

export class Achievements {
  public readonly greenhorn;
  public readonly cowpoke;
  public readonly homesteader;
  public readonly millionaire;
  public readonly legend;

  public readonly singularTalent;
  public readonly masterOfTheFiveWays;

  public readonly mysteryOfTheStardrops;

  public readonly motherCatch;
  public readonly fisherman;
  public readonly olMariner;
  public readonly masterAngler;

  constructor(farmer: Farmer, gameSave: GameSave) {
    this.greenhorn = new MoneyAchievement(gameSave, "Greenhorn", 15_000);
    this.cowpoke = new MoneyAchievement(gameSave, "Cowpoke", 50_000);
    this.homesteader = new MoneyAchievement(gameSave, "Homesteader", 250_000);
    this.millionaire = new MoneyAchievement(gameSave, "Millionaire", 1_000_000);
    this.legend = new MoneyAchievement(gameSave, "Legend", 10_000_000);

    this.singularTalent = new Achievement(
      "Singular Talent",
      values(farmer.skills).some((skill) => skill.level >= 10)
    );
    this.masterOfTheFiveWays = new Achievement(
      "Master of the Five Ways",
      values(farmer.skills).every((skill) => skill.level >= 10)
    );

    this.mysteryOfTheStardrops = new Achievement(
      "Mystery of the Stardrops",
      farmer.stardrops.every((stardrop) => stardrop.gathered)
    );

    this.motherCatch = new Achievement(
      "Mother Catch",
      sumBy(farmer.caughtFish, (v) => v.amount) >= 100
    );
    this.fisherman = new DifferentFishAchievement(farmer, "Fisherman", 10);
    this.olMariner = new DifferentFishAchievement(farmer, "Ol' Mariner", 24);
    this.masterAngler = new DifferentFishAchievement(
      farmer,
      "Master Angler",
      STARDEW_ACHIEVEMENT_FISHES.size
    );
  }
}

/* --------------------- */

class Achievement {
  constructor(
    public readonly title: string,
    public readonly achieved: boolean
  ) {}
}

export class MoneyAchievement extends Achievement {
  constructor(gameSave: GameSave, title: string, public readonly goal: number) {
    super(title, gameSave.totalGoldsEarned >= goal);
  }
}

export class DifferentFishAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number,
    public readonly caught = farmer.caughtFish.filter(
      (v) => v.amount > 0 && STARDEW_ACHIEVEMENT_FISHES.has(v.fishId)
    ).length
  ) {
    super(title, caught >= goal);
  }
}
