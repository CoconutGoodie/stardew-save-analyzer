import { STARDEW_COOKING_RECIPES } from "@src/const/StardewCooking";
import { STARDEW_CRAFTING_RECIPES } from "@src/const/StardewCrafting";
import { STARDEW_ACHIEVEMENT_FISHES } from "@src/const/StardewFishes";
import { STARDEW_ARTIFACTS, STARDEW_MINERALS } from "@src/const/StardewMuseum";
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

  public readonly gofer;
  public readonly aBigHelp;

  public readonly mysteryOfTheStardrops;

  public readonly motherCatch;
  public readonly fisherman;
  public readonly olMariner;
  public readonly masterAngler;

  public readonly treasureTrove;
  public readonly aCompleteCollection;

  public readonly diy;
  public readonly artisan;
  public readonly craftMaster;

  public readonly cook;
  public readonly sousChef;
  public readonly gourmetChef;

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

    this.gofer = new QuestCompletionAchievement(farmer, "Gofer", 10);
    this.aBigHelp = new QuestCompletionAchievement(farmer, "A Big Help", 40);

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

    this.treasureTrove = new Achievement(
      "Treasure Trove",
      gameSave.museumPieces.minerals.size +
        gameSave.museumPieces.artifacts.size >=
        40
    );
    this.aCompleteCollection = new Achievement(
      "A Complete Collection",
      gameSave.museumPieces.minerals.size === keys(STARDEW_MINERALS).length &&
        gameSave.museumPieces.artifacts.size === keys(STARDEW_ARTIFACTS).length
    );

    this.diy = new DifferentCraftAchievement(farmer, "D.I.Y.", 10);
    this.artisan = new DifferentCraftAchievement(farmer, "Artisan", 30);
    this.craftMaster = new DifferentCraftAchievement(
      farmer,
      "Craft Master",
      STARDEW_CRAFTING_RECIPES.length
    );

    this.cook = new DifferentCookingAchievement(farmer, "Cook", 10);
    this.sousChef = new DifferentCookingAchievement(farmer, "Sous Chef", 25);
    this.gourmetChef = new DifferentCookingAchievement(
      farmer,
      "Gourmet Chef",
      keys(STARDEW_COOKING_RECIPES).length
    );
  }
}

/* --------------------- */

export class Achievement {
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

export class QuestCompletionAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number,
    public readonly completed = farmer.totalCompletedQuests
  ) {
    super(title, completed >= goal);
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

export class DifferentCraftAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number,
    public readonly crafted = values(farmer.craftedRecipes).filter((v) => v > 0)
      .length
  ) {
    super(title, crafted >= goal);
  }
}

export class DifferentCookingAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number,
    public readonly crafted = values(farmer.cookedRecipes).filter((v) => v > 0)
      .length
  ) {
    super(title, crafted >= goal);
  }
}
