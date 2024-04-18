import { capitalCase } from "case-anything";
import { intersection } from "lodash";

type stringNumber = `${number}`;

export namespace StardewSave {
  export interface SaveXml {
    player: [PlayerXml];
    farmhands: { Farmer: [FarmerXml] }[];
    whichFarm: [keyof typeof GameSave.FARM_TYPES];
    year: [stringNumber];
    currentSeason: [string];
    dayOfMonth: [stringNumber];
    weatherForTomorrow: [string];
  }

  export interface PlayerXml extends FarmerXml {
    totalMoneyEarned: [`${string}`];
  }

  export interface FarmerXml {
    name: [string];
    farmName: [string];
    gameVersion: [string];
    gender: [string];
    millisecondsPlayed: [stringNumber];
    farmingLevel: [stringNumber];
    fishingLevel: [stringNumber];
    miningLevel: [stringNumber];
    foragingLevel: [stringNumber];
    combatLevel: [stringNumber];
    professions: [{ int: stringNumber[] }];
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

  static PROFESSIONS = {
    farming: {
      0: "Rancher",
      1: "Tiller",
      2: "Coopmaster",
      3: "Shepherd",
      4: "Artisan",
      5: "Agriculturist",
    },
    fishing: {
      6: "Fisher",
      7: "Trapper",
      8: "Angler",
      9: "Pirate",
      10: "Mariner",
      11: "Luremaster",
    },
    foraging: {
      12: "Forester",
      13: "Gatherer",
      14: "Lumberjack",
      15: "Tapper",
      16: "Botanist",
      17: "Tracker",
    },
    mining: {
      18: "Miner",
      19: "Geologist",
      20: "Blacksmith",
      21: "Prospector",
      22: "Excavator",
      23: "Gemologist",
    },
    combat: {
      24: "Fighter",
      25: "Scout",
      26: "Brute",
      27: "Defender",
      28: "Acrobat",
      29: "Desperado",
    },
  };

  constructor(private saveXml: StardewSave.SaveXml) {}

  public getSaveSummary() {
    return {
      farmName: this.saveXml.player[0].farmName[0],
      farmType: GameSave.FARM_TYPES[this.saveXml.whichFarm[0]],
      playerName: this.saveXml.player[0].name,
      farmhandNames: this.saveXml.farmhands.map(
        (farmhand) => farmhand.Farmer[0].name
      ),
      gameVersion: this.saveXml.player[0].gameVersion[0],
      playtime: parseInt(this.saveXml.player[0].millisecondsPlayed[0]),
      currentDate: {
        year: parseInt(this.saveXml.year[0]),
        season: capitalCase(this.saveXml.currentSeason[0]),
        day: parseInt(this.saveXml.dayOfMonth[0]),
      },
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

  public getAllFarmers() {
    return this.saveXml.farmhands
      .map((farmand) => farmand.Farmer[0])
      .concat(this.saveXml.player);
  }

  public getFarmer(name: string) {
    if (this.saveXml.player[0].name[0] === name) return this.saveXml.player[0];
    return this.saveXml.farmhands.find(
      (farmhand) => farmhand.Farmer[0].name[0] === name
    );
  }

  public getProfessions(
    farmerProfessions: stringNumber[],
    skillName: keyof typeof GameSave.PROFESSIONS
  ) {
    return intersection(
      farmerProfessions,
      Object.keys(GameSave.PROFESSIONS[skillName])
    )
      .sort() // Ensure, lower level professions come first
      .map((professionId) => {
        const professions = GameSave.PROFESSIONS[skillName];
        return professions[professionId as keyof typeof professions];
      });
  }

  public getSkillLevels() {
    return this.getAllFarmers().map((farmer) => ({
      farmerName: farmer.name[0],
      skills: [
        {
          title: "Farming",
          level: parseInt(farmer.farmingLevel[0]),
          professions: this.getProfessions(
            farmer.professions[0].int,
            "farming"
          ),
        },
        {
          title: "Fishing",
          level: parseInt(farmer.fishingLevel[0]),
          professions: this.getProfessions(
            farmer.professions[0].int,
            "fishing"
          ),
        },
        {
          title: "Mining",
          level: parseInt(farmer.miningLevel[0]),
          professions: this.getProfessions(farmer.professions[0].int, "mining"),
        },
        {
          title: "Foraging",
          level: parseInt(farmer.foragingLevel[0]),
          professions: this.getProfessions(
            farmer.professions[0].int,
            "foraging"
          ),
        },
        {
          title: "Combat",
          level: parseInt(farmer.combatLevel[0]),
          professions: this.getProfessions(farmer.professions[0].int, "combat"),
        },
      ],
    }));
  }
}
