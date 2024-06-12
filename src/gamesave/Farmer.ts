import { STARDEW_COOKING_RECIPES } from "@src/const/StardewCooking";
import { STARDEW_MASTERY_LEVEL_EXP } from "@src/const/StardewMasteryLevels";
import { XMLNode } from "@src/util/XMLNode";
import { thru } from "@src/util/utilities";
import {
  entries,
  fromEntries,
  intersection,
  keys,
  sumBy,
  values,
} from "remeda";
import { STARDEW_PROFESSIONS } from "../const/StardewProfessions";
import { STARDROP_MAIL_FLAGS } from "../const/StardewStardrops";

export class Farmer {
  public readonly name;
  public readonly gender;
  public readonly favoriteThing;
  public readonly playtime;

  public readonly qiGems;
  public readonly qiCoins;

  public readonly skills;
  public readonly skillLevelTotal;
  public readonly skillBasedTitle;

  public readonly hasSkullKey;
  public readonly deepestMineLevels;

  public readonly masteries;

  public readonly totalCompletedQuests;
  public readonly billboardCompletedQuests;

  public readonly craftedRecipes;
  public readonly cookedRecipes;

  public readonly receivedMailFlags;
  public readonly caughtFish;
  public readonly unlockedBobberCount;
  public readonly stardrops;

  public readonly rarecrowSocietyMailed;

  constructor(private farmerXml: XMLNode, private saveXml?: XMLNode) {
    this.name = farmerXml.query(":scope > name").text();
    this.gender = this.calcGender();
    this.favoriteThing = farmerXml.query(":scope > favoriteThing").text();
    this.playtime = farmerXml.query(":scope > millisecondsPlayed").number();

    this.qiGems = farmerXml.query(":scope > qiGems").number();
    this.qiCoins = farmerXml.query(":scope > clubCoins").number();

    this.skills = {
      farming: {
        level: farmerXml.query(":scope > farmingLevel").number(),
        professions: this.calcProfessions("farming"),
      },
      fishing: {
        level: farmerXml.query(":scope > fishingLevel").number(),
        professions: this.calcProfessions("fishing"),
      },
      mining: {
        level: farmerXml.query(":scope > miningLevel").number(),
        professions: this.calcProfessions("mining"),
      },
      foraging: {
        level: farmerXml.query(":scope > foragingLevel").number(),
        professions: this.calcProfessions("foraging"),
      },
      combat: {
        level: farmerXml.query(":scope > combatLevel").number(),
        professions: this.calcProfessions("combat"),
      },
    };
    this.skillLevelTotal = sumBy(values(this.skills), (skill) => skill.level);
    this.skillBasedTitle = this.calcSkillBasedTitle();

    this.hasSkullKey = this.farmerXml.query(":scope > hasSkullKey").boolean();
    this.deepestMineLevels = this.calcDeepestMineLevels();

    this.masteries = this.calcMasteries();

    this.totalCompletedQuests = this.calcTotalCompletedQuests();
    this.billboardCompletedQuests = this.calcBillboardCompletedQuests();

    this.craftedRecipes = this.calcCraftedRecipes();
    this.cookedRecipes = this.calcCookedRecipes();

    this.receivedMailFlags = farmerXml
      .queryAll("mailReceived > *")
      .map((x) => x.text());

    this.caughtFish = farmerXml
      .queryAll("fishCaught > item")
      .map((caughtXml) => ({
        fishId: caughtXml
          .query("key > *")
          .text()
          .replace(/\(.*?\)/, ""),
        amount: caughtXml
          .query("value > ArrayOfInt > int:nth-child(1)")
          .number(),
        lengthInInches: caughtXml
          .query("value > ArrayOfInt > int:nth-child(2)")
          .number(),
      }));

    this.unlockedBobberCount =
      1 + Math.floor(this.caughtFish.filter((v) => v.amount > 0).length / 2);
    this.stardrops = this.calcStardrops();

    this.rarecrowSocietyMailed =
      this.receivedMailFlags.includes("RarecrowSociety");
  }

  private calcGender() {
    let gender = this.farmerXml
      .query(":scope > gender")
      .transformIfPresent((genderXml) =>
        genderXml.text() === "Male"
          ? ("Male" as const)
          : genderXml.text() === "Female"
          ? ("Female" as const)
          : null
      );

    // version < 1.6
    if (!gender) {
      gender = this.farmerXml.query(":scope > isMale").boolean()
        ? "Male"
        : "Female";
    }

    return gender;
  }

  private calcProfessions(skillName: keyof typeof STARDEW_PROFESSIONS) {
    const skillProfessions: Record<number, string> =
      STARDEW_PROFESSIONS[skillName];

    return intersection
      .multiset(
        this.farmerXml.queryAll("professions > *").map((xml) => xml.text()),
        keys(skillProfessions)
      )
      .map((id) => parseInt(id))
      .sort((a, b) => a - b)
      .map((professionId) => skillProfessions[professionId]);
  }

  private calcSkillBasedTitle() {
    const v = this.skillLevelTotal / 2;
    if (v >= 30) return "Farm King";
    if (v > 28) return "Cropmaster";
    if (v > 26) return "Agriculturist";
    if (v > 24) return "Farmer";
    if (v > 22) return "Rancher";
    if (v > 20) return "Planter";
    if (v > 18) return "Granger";
    if (v > 16) return this.gender === "Female" ? "Farmgirl" : "Farmboy";
    if (v > 14) return "Sodbuster";
    if (v > 12) return "Smallholder";
    if (v > 10) return "Tiller";
    if (v > 8) return "Farmhand";
    if (v > 6) return "Cowpoke";
    if (v > 4) return "Bumpkin";
    if (v > 2) return "Greenhorn";
    return "Newcomer";
  }

  private calcDeepestMineLevels() {
    let mineLevel = this.farmerXml.query(":scope > deepestMineLevel").number();

    // Thanks to https://github.com/MouseyPounds/stardew-checkup/blob/8e48aa1806ad2c856d35e1a68f08128b4673f2c5/stardew-checkup.js#L3260
    if (this.hasSkullKey) mineLevel = Math.max(120, mineLevel);

    return {
      mountainMine: Math.min(120, mineLevel),
      skullCavern: mineLevel > 120 ? mineLevel - 120 : 0,
    };
  }

  private calcMasteries() {
    const statsXml = this.farmerXml.queryAll(":scope > stats > Values > item");

    const masterExpStatXml =
      statsXml.find(
        (entryXml) => entryXml.query("key > *").text() === "MasteryExp"
      ) ?? XMLNode.EMPTY;

    const totalExp = masterExpStatXml.query("value > *").number();

    const currentLevel = STARDEW_MASTERY_LEVEL_EXP.reduce(
      (currentLevel, exp, level) => {
        if (totalExp >= exp) return level;
        return currentLevel;
      },
      0
    );

    return {
      totalExp: totalExp,
      currentExp: totalExp - STARDEW_MASTERY_LEVEL_EXP[currentLevel],
      currentLevel,
      tnl:
        currentLevel === STARDEW_MASTERY_LEVEL_EXP.length - 1
          ? Infinity
          : STARDEW_MASTERY_LEVEL_EXP[currentLevel + 1] -
            STARDEW_MASTERY_LEVEL_EXP[currentLevel],
      perks: {
        combat: statsXml.some(
          (statXml) => statXml.query("key > *").text() === "mastery_4"
        ),
        farming: statsXml.some(
          (statXml) => statXml.query("key > *").text() === "mastery_0"
        ),
        fishing: statsXml.some(
          (statXml) => statXml.query("key > *").text() === "mastery_1"
        ),
        foraging: statsXml.some(
          (statXml) => statXml.query("key > *").text() === "mastery_2"
        ),
        mining: statsXml.some(
          (statXml) => statXml.query("key > *").text() === "mastery_3"
        ),
      },
    };
  }

  private calcTotalCompletedQuests() {
    let completedQuests = this.farmerXml
      .queryAll(":scope > stats > Values > item")
      .find(
        (valueXml) => valueXml.query("key > *").text() === "questsCompleted"
      )
      ?.query("value > *")
      ?.number();

    // version < 1.6
    if (completedQuests == null) {
      completedQuests = this.farmerXml
        .query("stats > questsCompleted")
        .transformIfPresent((xml) => xml.number());
    }

    // version < 1.3
    if (completedQuests == null) {
      completedQuests = this.saveXml
        ?.query("stats > questsCompleted")
        .transformIfPresent((xml) => xml.number());
    }

    return completedQuests ?? 0;
  }

  private calcBillboardCompletedQuests() {
    let completedQuests = this.farmerXml
      .queryAll(":scope > stats > Values > item")
      .find(
        (valueXml) => valueXml.query("key > *").text() === "BillboardQuestsDone"
      )
      ?.query("value > *")
      ?.number();

    // version < 1.5
    if (completedQuests == null) {
      completedQuests = this.totalCompletedQuests;
    }

    return completedQuests ?? 0;
  }

  private calcCraftedRecipes() {
    const relocatedNames: Record<string, string> = {
      "Oil Of Garlic": "Oil of Garlic",
    };

    return fromEntries(
      this.farmerXml
        .queryAll("craftingRecipes > item")
        .map((entry) => {
          const recipeName = entry.query("key > *").text();
          const craftedTimes = entry.query("value > *").number();
          return [recipeName, craftedTimes] as const;
        })
        .filter(([key]) => key != null)
        .map(([key, value]) => [relocatedNames[key] ?? key, value])
    );
  }

  private calcCookedRecipes() {
    const relocatedNames: Record<string, string> = {
      "Cheese Cauli.": "Cheese Cauliflower",
      Cookies: "Cookie",
      "Cran. Sauce": "Cranberry Sauce",
      "Dish o' The Sea": "Dish O' The Sea",
      "Eggplant Parm.": "Eggplant Parmesan",
      "Vegetable Stew": "Vegetable Medley",
    };

    const cookedRecipes = fromEntries(
      this.farmerXml
        .queryAll("recipesCooked > item")
        .map((entry) => {
          const recipeId = entry.query("key > *").text();
          const cookedTimes = entry.query("value > *").number();
          return [STARDEW_COOKING_RECIPES[recipeId], cookedTimes] as const;
        })
        .filter(([key]) => key != null)
        .map(([key, value]) => [relocatedNames[key] ?? key, value])
    );

    this.farmerXml.queryAll("cookingRecipes > item").forEach((entry) => {
      const recipeName = thru(
        entry.query("key > *").text(),
        (name) => relocatedNames[name] ?? name
      );

      if (!recipeName) return;

      if (!(recipeName in cookedRecipes)) {
        cookedRecipes[recipeName] = 0;
      }
    });

    return cookedRecipes;
  }

  private calcStardrops() {
    // TODO: Refactor to extract description from here. Keep it as SSOT
    return entries(STARDROP_MAIL_FLAGS).map(([mailId, description]) => ({
      description,
      gathered: this.receivedMailFlags.includes(mailId),
    }));
  }
}
