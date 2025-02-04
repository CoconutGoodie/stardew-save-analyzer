import { STARDEW_BASE_COOKING_RECIPES } from "~frontend/const/StardewCooking";
import { STARDEW_CRAFTING_RECIPES } from "~frontend/const/StardewCrafting";
import { STARDEW_ACHIEVEMENT_FISHES } from "~frontend/const/StardewFishes";
import { STARDEW_ERADICATION_GOALS } from "~frontend/const/StardewMonsters";
import {
  STARDEW_ARTIFACTS,
  STARDEW_MINERALS,
} from "~frontend/const/StardewMuseum";
import {
  STARDEW_SHIPPABLE_MONOCROPS,
  STARDEW_SHIPPABLE_POLYCROPS,
  STARDEW_SHIPPABLES,
} from "~frontend/const/StardewShippables";
import { Farmer } from "~frontend/gamesave/Farmer";
import { GameSave } from "~frontend/gamesave/GameSave";
import { reduceIterator } from "~frontend/util/iterator.utils";
import { fromEntries, keys, sumBy, values } from "remeda";
import { ReactNode } from "react";
import { Currency } from "~frontend/component/Currency/Currency";

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

  public readonly theBottom;
  public readonly protectorOfTheValley;

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

  public readonly aNewFriend;
  public readonly cliques;
  public readonly networking;
  public readonly popular;
  public readonly bestFriends;
  public readonly theBelovedFarmer;

  public readonly fullShipment;
  public readonly polyculture;
  public readonly monoculture;

  constructor(farmer: Farmer, gameSave: GameSave) {
    this.greenhorn = new MoneyAchievement(
      gameSave.separateWallets ? farmer : gameSave.player,
      "Greenhorn",
      15_000
    );
    this.cowpoke = new MoneyAchievement(
      gameSave.separateWallets ? farmer : gameSave.player,
      "Cowpoke",
      50_000
    );
    this.homesteader = new MoneyAchievement(
      gameSave.separateWallets ? farmer : gameSave.player,
      "Homesteader",
      250_000
    );
    this.millionaire = new MoneyAchievement(
      gameSave.separateWallets ? farmer : gameSave.player,
      "Millionaire",
      1_000_000
    );
    this.legend = new MoneyAchievement(
      gameSave.separateWallets ? farmer : gameSave.player,
      "Legend",
      10_000_000
    );

    this.singularTalent = new Achievement(
      "Singular Talent",
      <>reach Level 10 in a skill</>,
      values(farmer.skills).some((skill) => skill.level >= 10)
    );
    this.masterOfTheFiveWays = new Achievement(
      "Master of the Five Ways",
      <>reach Level 10 in every skill</>,
      values(farmer.skills).every((skill) => skill.level >= 10)
    );

    this.gofer = new QuestCompletionAchievement(farmer, "Gofer", 10);
    this.aBigHelp = new QuestCompletionAchievement(farmer, "A Big Help", 40);

    this.theBottom = new Achievement(
      "The Bottom",
      <></>,
      farmer.deepestMineLevels.mountainMine >= 120
    );
    this.protectorOfTheValley = new EradicationAchievement(
      farmer,
      "Protector of the Valley"
    );

    this.mysteryOfTheStardrops = new Achievement(
      "Mystery of the Stardrops",
      <></>,
      farmer.stardrops.every((stardrop) => stardrop.gathered)
    );

    this.motherCatch = new Achievement(
      "Mother Catch",
      <></>,
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
      <></>,
      gameSave.museumPieces.minerals.size +
        gameSave.museumPieces.artifacts.size >=
        40
    );
    this.aCompleteCollection = new Achievement(
      "A Complete Collection",
      <></>,
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
      keys(STARDEW_BASE_COOKING_RECIPES).length
    );

    this.aNewFriend = new RelationAchievement(farmer, "A New Friend", 1, 5);
    this.cliques = new RelationAchievement(farmer, "Cliques", 4, 5);
    this.networking = new RelationAchievement(farmer, "Networking", 10, 5);
    this.popular = new RelationAchievement(farmer, "Popular", 20, 5);
    this.bestFriends = new RelationAchievement(farmer, "Best Friends", 1, 10);
    this.theBelovedFarmer = new RelationAchievement(
      farmer,
      "The Beloved Farmer",
      8,
      10
    );

    this.fullShipment = new Achievement(
      "Full Shipment",
      <></>,
      keys(STARDEW_SHIPPABLES).every(
        (shippableId) => farmer.shippedItems[shippableId]?.amount > 0
      )
    );

    this.polyculture = new Achievement(
      "Polyculture",
      <></>,
      reduceIterator(
        STARDEW_SHIPPABLE_POLYCROPS.keys(),
        (shippableId, achieved) =>
          achieved && farmer.shippedItems[shippableId]?.amount >= 15,
        true
      )
    );

    this.monoculture = new Achievement(
      "Monoculture",
      <></>,
      reduceIterator(
        STARDEW_SHIPPABLE_MONOCROPS.keys(),
        (shippableId, achieved) =>
          achieved || farmer.shippedItems[shippableId]?.amount >= 300,
        false
      )
    );
  }
}

/* --------------------- */

export class Achievement {
  constructor(
    public readonly title: string,
    public readonly description: ReactNode,
    public readonly achieved: boolean,
    public readonly achieveHint?: () => ReactNode
  ) {}
}

export class MoneyAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number
  ) {
    super(
      title,
      <>
        earn <Currency amount={goal} />
      </>,
      farmer.totalMoneyEarned >= goal,
      () => (
        <>
          <Currency amount={goal - farmer.totalMoneyEarned} unit="gold" /> more
          to go
        </>
      )
    );
  }
}

export class QuestCompletionAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number,
    public readonly completed = farmer.totalCompletedQuests
  ) {
    super(title, <>complete {goal} help requests</>, completed >= goal, () => (
      <>
        Helped {completed} out of {goal}
      </>
    ));
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
    super(title, <></>, caught >= goal);
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
    super(title, <></>, crafted >= goal);
  }
}

export class DifferentCookingAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number,
    public readonly crafted = values(farmer.cooking).filter((v) => v > 0)
      .length
  ) {
    super(title, <></>, crafted >= goal);
  }
}

export class EradicationAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goalsDone = fromEntries(
      STARDEW_ERADICATION_GOALS.map((goal) => [
        goal.category,
        farmer.monsterKills.byEradicationGoal[goal.category] >= goal.amount,
      ])
    )
  ) {
    super(title, <></>, Object.values(goalsDone).every(Boolean));
  }
}

export class RelationAchievement extends Achievement {
  constructor(
    farmer: Farmer,
    title: string,
    public readonly goal: number,
    public readonly minHearts: number
  ) {
    super(
      title,
      <></>,
      farmer.relationships.filter(
        (r) => !r.isChild && r.points >= minHearts * 250
      ).length >= goal
    );
  }
}
