import {
  entries,
  fromEntries,
  intersection,
  keys,
  map,
  pipe,
  sort,
  sumBy,
  values,
} from "remeda";
import { STARDEW_PROFESSIONS } from "../const/StardewProfessions";
import { STARDROP_MAIL_FLAGS } from "../const/StardewStardrops";
import { GameSave } from "./GameSave";
import { STARDEW_MASTERY_LEVEL_EXP } from "@src/const/StardewMasteryLevels";

export class Farmer {
  public readonly name;
  public readonly gender;
  public readonly favoriteThing;
  public readonly playtime;

  public readonly qiGems;

  public readonly skills;
  public readonly skillLevelTotal;
  public readonly skillBasedTitle;

  public readonly masteries;

  public readonly completedQuests;

  public readonly craftedRecipes;

  public readonly receivedMailFlags;
  public readonly caughtFish;
  public readonly unlockedBobberCount;
  public readonly stardrops;

  constructor(
    private farmerXml: GameSave.FarmerXml,
    private saveXml?: GameSave.SaveXml
  ) {
    this.name = farmerXml.name[0];
    this.gender = this.calcGender();
    this.favoriteThing = farmerXml.favoriteThing[0];
    this.playtime = parseInt(farmerXml.millisecondsPlayed[0]);

    this.qiGems = parseInt(farmerXml.qiGems?.[0] ?? "0");

    this.skills = {
      farming: {
        level: parseInt(farmerXml.farmingLevel[0]),
        professions: this.calcProfessions("farming"),
      },
      fishing: {
        level: parseInt(farmerXml.fishingLevel[0]),
        professions: this.calcProfessions("fishing"),
      },
      mining: {
        level: parseInt(farmerXml.miningLevel[0]),
        professions: this.calcProfessions("mining"),
      },
      foraging: {
        level: parseInt(farmerXml.foragingLevel[0]),
        professions: this.calcProfessions("foraging"),
      },
      combat: {
        level: parseInt(farmerXml.combatLevel[0]),
        professions: this.calcProfessions("combat"),
      },
    };
    this.skillLevelTotal = sumBy(values(this.skills), (skill) => skill.level);
    this.skillBasedTitle = this.calcSkillBasedTitle();

    this.masteries = this.calcMasteries();

    this.completedQuests = this.calcCompletedQuests();

    this.craftedRecipes = this.calcCraftedRecipes();

    this.receivedMailFlags = farmerXml.mailReceived.flatMap(
      (entry) => entry.string
    );
    this.caughtFish = (this.farmerXml.fishCaught?.[0]?.item ?? []).map(
      (caught) => ({
        fishId: ("string" in caught.key[0]
          ? caught.key[0].string[0]
          : caught.key[0].int[0]
        ).replace(/\(.*?\)/, ""),
        amount: parseInt(caught.value[0].ArrayOfInt[0].int[0]),
        lengthInInches: parseInt(caught.value[0].ArrayOfInt[0].int[1]),
      })
    );
    this.unlockedBobberCount =
      1 + Math.floor(this.caughtFish.filter((v) => v.amount > 0).length / 2);
    this.stardrops = this.calcStardrops();
  }

  private calcGender() {
    return (
      this.farmerXml.gender?.[0] ??
      (this.farmerXml.isMale?.[0] === "true"
        ? ("Male" as const)
        : ("Female" as const))
    );
  }

  private calcProfessions(skillName: keyof typeof STARDEW_PROFESSIONS) {
    const skillProfessions: Record<number, string> =
      STARDEW_PROFESSIONS[skillName];

    return intersection
      .multiset(this.farmerXml.professions[0].int, keys(skillProfessions))
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

  private calcMasteries() {
    const stats = this.farmerXml.stats?.[0].Values?.[0]?.item;

    const totalExp = parseInt(
      stats?.find((x) => x.key[0].string[0] === "MasteryExp")?.value?.[0]
        ?.unsignedInt?.[0] ?? "0"
    );

    const currentLevel = STARDEW_MASTERY_LEVEL_EXP.reduce(
      (currentLevel, exp, level) => {
        if (totalExp >= exp) return level;
        return currentLevel;
      },
      0
    );

    return {
      totalExp,
      currentExp: totalExp - STARDEW_MASTERY_LEVEL_EXP[currentLevel],
      currentLevel,
      tnl:
        currentLevel === STARDEW_MASTERY_LEVEL_EXP.length - 1
          ? Infinity
          : STARDEW_MASTERY_LEVEL_EXP[currentLevel + 1] -
            STARDEW_MASTERY_LEVEL_EXP[currentLevel],
      perks: {
        combat:
          stats?.some((s) => s?.key?.[0]?.string?.[0] === "mastery_4") ?? false,
        farming:
          stats?.some((s) => s?.key?.[0]?.string?.[0] === "mastery_0") ?? false,
        fishing:
          stats?.some((s) => s?.key?.[0]?.string?.[0] === "mastery_1") ?? false,
        foraging:
          stats?.some((s) => s?.key?.[0]?.string?.[0] === "mastery_2") ?? false,
        mining:
          stats?.some((s) => s?.key?.[0]?.string?.[0] === "mastery_3") ?? false,
      },
    };
  }

  private calcCompletedQuests() {
    let value = this.farmerXml.stats?.[0]?.Values?.[0]?.item?.find(
      (v) => v?.key?.[0]?.string?.[0] === "questsCompleted"
    )?.value?.[0]?.unsignedInt?.[0];

    // version >= 1.3
    if (value == null) value = this.farmerXml.stats?.[0]?.questsCompleted?.[0];

    // version >= 1.2
    if (value == null) value = this.saveXml?.stats?.[0]?.questsCompleted?.[0];

    return parseInt(value ?? "0");
  }

  private calcCraftedRecipes() {
    const relocatedNames: Record<string, string> = {
      "Oil Of Garlic": "Oil of Garlic",
    };

    return fromEntries(
      this.farmerXml.craftingRecipes?.[0]?.item
        ?.map((entry) => {
          const recipeName = entry?.key?.[0]?.string?.[0];
          const craftedTimes = parseInt(entry?.value?.[0]?.int?.[0] ?? "0");
          return [recipeName, craftedTimes] as const;
        })
        ?.filter(([key]) => key != null)
        ?.map(([key, value]) => [relocatedNames[key] ?? key, value]) ?? []
    );
  }

  private calcStardrops() {
    return entries(STARDROP_MAIL_FLAGS).map(([mailId, description]) => ({
      description,
      gathered: this.receivedMailFlags.includes(mailId),
    }));
  }
}
