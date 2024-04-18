import { capitalCase } from "case-anything";

export namespace StardewSave {
  export interface SaveXml {
    player: [PlayerXml];
    farmhands: { Farmer: [FarmerXml] }[];
    whichFarm: [keyof typeof GameSave.FARM_TYPES];
    year: [`${number}`];
    currentSeason: [string];
    dayOfMonth: [`${number}`];
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
    millisecondsPlayed: [`${number}`];
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
}
