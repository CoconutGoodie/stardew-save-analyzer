import { capitalCase } from "case-anything";
import { entries, groupBy, intersection, keys, lowerCase } from "lodash";
import { STARDEW_FISHES } from "../const/StardewFishes";

import combatPng from "../assets/sprite/skill/combat.png";
import farmingPng from "../assets/sprite/skill/farming.png";
import fishingPng from "../assets/sprite/skill/fishing.png";
import foragingPng from "../assets/sprite/skill/foraging.png";
import miningPng from "../assets/sprite/skill/mining.png";
import { STARDEW_PROFESSIONS } from "../const/StardewProfessions";
import { STARDROP_MAIL_FLAGS } from "../const/StardewStardrops";
import { StardewWiki } from "./StardewWiki";
import { GameDate, GameSeason } from "./GameDate";

type StringNumber = `${number}`;

type Gender = "Female" | "Male";

export namespace StardewSave {
  export interface SaveXml {
    player: [PlayerXml];
    farmhands: { Farmer: [FarmerXml] }[];
    whichFarm: [keyof typeof GameSave.FARM_TYPES];
    year: [StringNumber];
    currentSeason: [string];
    dayOfMonth: [StringNumber];
    weatherForTomorrow: [string];
    completedSpecialOrders: [{ string: string[] }];
  }

  export type KeyValueMap<K, V> = { key: K; value: V }[];

  export interface PlayerXml extends FarmerXml {
    totalMoneyEarned: [`${string}`];
  }

  export interface FarmerXml {
    name: [string];
    farmName: [string];
    gameVersion: [string];
    gender: [Gender];
    favoriteThing: [string];
    millisecondsPlayed: [StringNumber];
    farmingLevel: [StringNumber];
    fishingLevel: [StringNumber];
    miningLevel: [StringNumber];
    foragingLevel: [StringNumber];
    combatLevel: [StringNumber];
    professions: [{ int: StringNumber[] }];
    mailReceived: [{ string: string[] }];
    fishCaught: [
      {
        item: KeyValueMap<
          [{ string: [string] }],
          [{ ArrayOfInt: [{ int: [StringNumber, StringNumber] }] }]
        >;
      }
    ];
  }
}

export class GameSave {
  static FARM_TYPES = {
    "0": "Standard",
    "1": "Riverland",
    "2": "Forest",
    "3": "Hill-top",
    "4": "Wilderness",
    "5": "Four Corners",
    "6": "Beach",
    MeadowlandsFarm: "Meadowlands",
  };

  static SPECIAL_ORDERS = {
    town: {
      Caroline: "Island Ingredients",
      Clint: "Cave Patrol",
      Demetrius: "Aquatic Overpopulation",
      Demetrius2: "Biome Balance",
      Emily: "Rock Rejuvenation",
      Evelyn: "Gifts for George",
      Gunther: "Fragments of the past",
      Gus: "Gus' Famous Omelet",
      Lewis: "Crop Order",
      Linus: "Community Cleanup",
      Pam: "The Strong Stuff",
      Pierre: "Pierre's Prime Produce",
      Robin: "Robin's Project",
      Robin2: "Robin's Resource Rush",
      Willy: "Juicy Bugs Wanted!",
      Willy2: "Tropical Fish",
      Wizard: "A Curious Substance",
      Wizard2: "Prismatic Jelly",
    },

    qi: {
      QiChallenge2: "Qi's Crop",
      QiChallenge3: "Let's Play A Game",
      QiChallenge4: "Four Precious Stones",
      QiChallenge5: "Qi's Hungry Challenge",
      QiChallenge6: "Qi's Cuisine",
      QiChallenge7: "Qi's Kindness",
      QiChallenge8: "Extended Family",
      QiChallenge9: "Danger In The Deep",
      QiChallenge10: "Skull Cavern Invasion",
      QiChallenge12: "Qi's Prismatic Grange",
    },
  };

  constructor(private saveXml: StardewSave.SaveXml) {}

  public getFarmOverview() {
    return {
      farmName: this.saveXml.player[0].farmName[0],
      farmType: GameSave.FARM_TYPES[this.saveXml.whichFarm[0]],
      player: {
        name: this.saveXml.player[0].name[0],
        gender: this.saveXml.player[0].gender[0],
        favoriteThing: this.saveXml.player[0].favoriteThing[0],
        playtime: parseInt(this.saveXml.player[0].millisecondsPlayed[0]),
      },
      farmhands: this.saveXml.farmhands.map((farmhand) => ({
        name: farmhand.Farmer[0].name[0],
        gender: farmhand.Farmer[0].gender[0],
        favoriteThing: farmhand.Farmer[0].favoriteThing[0],
        playtime: parseInt(farmhand.Farmer[0].millisecondsPlayed[0]),
      })),
      gameVersion: this.saveXml.player[0].gameVersion[0],
      playtime: parseInt(this.saveXml.player[0].millisecondsPlayed[0]),
      currentDate: new GameDate(
        parseInt(this.saveXml.dayOfMonth[0]),
        capitalCase(this.saveXml.currentSeason[0]) as GameSeason,
        parseInt(this.saveXml.year[0])
      ),
    };
  }

  public getMoneySummary() {
    return {
      earnedTotal: parseInt(this.saveXml.player[0].totalMoneyEarned[0]),
      achievements: [
        { title: "Greenhorn", goal: 15_000 },
        { title: "Cowpoke ", goal: 50_000 },
        { title: "Homesteader", goal: 250_000 },
        { title: "Millionaire", goal: 1_000_000 },
        { title: "Legend", goal: 10_000_000 },
      ],
    };
  }

  public getAllFarmerNames() {
    return [this.saveXml.player[0].name[0]].concat(
      this.saveXml.farmhands.map((farmhand) => farmhand.Farmer[0].name[0])
    );
  }

  public getFarmer(name: string) {
    if (this.saveXml.player[0].name[0] === name) return this.saveXml.player[0];
    return this.saveXml.farmhands.find(
      (farmhand) => farmhand.Farmer[0].name[0] === name
    )?.Farmer[0];
  }

  public getProfessions(
    farmerProfessions: StringNumber[],
    skillName: keyof typeof STARDEW_PROFESSIONS
  ) {
    return intersection(farmerProfessions, keys(STARDEW_PROFESSIONS[skillName]))
      .map((id) => parseInt(id))
      .sort((a, b) => a - b) // Ensure, 5 level professions come first
      .map((professionId) => {
        const professions = STARDEW_PROFESSIONS[skillName];
        return professions[professionId as keyof typeof professions];
      });
  }

  public getSkillBasedTitle(skillLevelsTotal: number, gender: Gender) {
    const v = skillLevelsTotal / 2;
    if (v >= 30) return "Farm King";
    if (v >= 28) return "Cropmaster";
    if (v >= 25) return "Agriculturist";
    if (v >= 24) return "Farmer";
    if (v >= 22) return "Rancher";
    if (v >= 20) return "Planter";
    if (v >= 18) return "Granger";
    if (v >= 16) return gender === "Female" ? "Farmgirl" : "Farmboy";
    if (v >= 14) return "Sodbuster";
    if (v >= 12) return "Smallholder";
    if (v >= 10) return "Tiller";
    if (v >= 8) return "Farmhand";
    if (v >= 6) return "Cowpoke";
    if (v >= 4) return "Bumpkin";
    if (v >= 2) return "Greenhorn";
    return "Newcomer";
  }

  public getSkillAttributes(farmerName: string) {
    const farmer = this.getFarmer(farmerName);
    if (!farmer) return;

    const skills = [
      {
        title: "Farming",
        level: parseInt(farmer.farmingLevel[0]),
        professions: this.getProfessions(farmer.professions[0].int, "farming"),
        iconSrc: farmingPng,
      },
      {
        title: "Fishing",
        level: parseInt(farmer.fishingLevel[0]),
        professions: this.getProfessions(farmer.professions[0].int, "fishing"),
        iconSrc: fishingPng,
      },
      {
        title: "Mining",
        level: parseInt(farmer.miningLevel[0]),
        professions: this.getProfessions(farmer.professions[0].int, "mining"),
        iconSrc: miningPng,
      },
      {
        title: "Foraging",
        level: parseInt(farmer.foragingLevel[0]),
        professions: this.getProfessions(farmer.professions[0].int, "foraging"),
        iconSrc: foragingPng,
      },
      {
        title: "Combat",
        level: parseInt(farmer.combatLevel[0]),
        professions: this.getProfessions(farmer.professions[0].int, "combat"),
        iconSrc: combatPng,
      },
      // This exists, yet as an unused feature for now (?)
      // {
      //   title: "Luck",
      //   level: parseInt(farmer.luckLevel[0]),
      //   professions: this.getProfessions(farmer.professions[0].int, "combat"),
      //   iconSrc: luckPng,
      // },
    ];

    const totalLevel = skills.reduce((total, skill) => total + skill.level, 0);

    return {
      skillLevel: Math.floor(totalLevel / 2),
      title: this.getSkillBasedTitle(totalLevel, farmer.gender[0]),
      skills,
    };
  }

  public getSpecialOrders() {
    const orders = entries(GameSave.SPECIAL_ORDERS.town);

    return orders.map(([orderId, title]) => ({
      title,
      npc: lowerCase(orderId.replace(/\d+/g, "")),
      completed:
        this.saveXml.completedSpecialOrders[0].string.includes(orderId),
      wiki: StardewWiki.getLink("Quests", title.replace(/\s+/g, "_")),
    }));
  }

  public getStardrops(farmerName: string) {
    const farmer = this.getFarmer(farmerName);
    if (!farmer) return;

    const mails = entries(STARDROP_MAIL_FLAGS);

    return mails.map(([mailId, description]) => ({
      description,
      gathered: farmer.mailReceived[0].string.includes(mailId),
    }));
  }

  public getCaughtFishes(farmerName: string) {
    const farmer = this.getFarmer(farmerName);
    if (!farmer) return;

    const fishEntries = entries(STARDEW_FISHES);

    // return groupBy(fishEntries, ([_, fish]) => {
    //   return fish.category;
    // });

    const caughtFishes = fishEntries.map(([itemId, fishDefinition]) => ({
      itemId,
      ...fishDefinition,
      caught: parseInt(
        farmer.fishCaught[0].item.find(
          (item) => item.key[0].string[0].replace(/\(.*?\)/, "") === itemId
        )?.value[0].ArrayOfInt[0].int[0] ?? "0"
      ),
    }));

    return groupBy(caughtFishes, (fish) => fish.category);
  }
}
