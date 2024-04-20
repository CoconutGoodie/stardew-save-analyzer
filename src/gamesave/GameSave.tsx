import { capitalCase } from "case-anything";
import { entries, find, groupBy, intersection, keys, lowerCase } from "lodash";
import { STARDEW_FISHES } from "../const/StardewFishes";

import combatPng from "../assets/sprite/skill/combat.png";
import farmingPng from "../assets/sprite/skill/farming.png";
import fishingPng from "../assets/sprite/skill/fishing.png";
import foragingPng from "../assets/sprite/skill/foraging.png";
import miningPng from "../assets/sprite/skill/mining.png";
import { STARDEW_PROFESSIONS } from "../const/StardewProfessions";
import { STARDROP_MAIL_FLAGS } from "../const/StardewStardrops";
import { StardewWiki } from "../util/StardewWiki";
import { GameDate, GameSeason } from "../util/GameDate";
import { Farmer } from "./Farmer";
import { STARDEW_SPECIAL_ORDERS } from "../const/StardewSpecialOrders";

type StringNumber = `${number}`;
type StringBoolean = `${boolean}`;

export namespace GameSave {
  export interface SaveXml {
    player: [FarmerXml];
    farmhands?: { Farmer: [FarmerXml] }[];
    whichFarm: [keyof typeof GameSave.FARM_TYPES];
    year: [StringNumber];
    currentSeason: [string];
    dayOfMonth: [StringNumber];
    weatherForTomorrow: [string];
    completedSpecialOrders: [{ string: string[] }];
  }

  export type KeyValueMap<K, V> = { key: K; value: V }[];

  export interface FarmerXml {
    name: [string];
    farmName: [string];
    gameVersion: [string];
    gender?: ["Female" | "Male"];
    isMale?: [StringBoolean];
    favoriteThing: [string];
    totalMoneyEarned: [`${string}`];
    millisecondsPlayed: [StringNumber];
    farmingLevel: [StringNumber];
    fishingLevel: [StringNumber];
    miningLevel: [StringNumber];
    foragingLevel: [StringNumber];
    combatLevel: [StringNumber];
    professions: [{ int: StringNumber[] }];
    mailReceived: [{ string: string[] }];
    fishCaught?: [
      {
        item: KeyValueMap<
          [{ string: [string] } | { int: [string] }],
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

  constructor(private saveXml: GameSave.SaveXml) {
    console.log(saveXml);
  }

  public getFarmOverview() {
    return {
      farmName: this.saveXml.player[0].farmName[0],
      farmType: GameSave.FARM_TYPES[this.saveXml.whichFarm[0]],
      player: new Farmer(this.saveXml.player[0]),
      farmhands:
        this.saveXml.farmhands?.map(
          (farmhand) => new Farmer(farmhand.Farmer[0])
        ) ?? [],
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
      // TODO: Extract to new Advancement Track System (?)
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
      this.saveXml.farmhands?.map((farmhand) => farmhand.Farmer[0].name[0]) ??
        []
    );
  }

  public getFarmer(name: string) {
    if (this.saveXml.player[0].name[0] === name)
      return new Farmer(this.saveXml.player[0]);
    const farmhandXml = this.saveXml.farmhands?.find(
      (farmhand) => farmhand.Farmer[0].name[0] === name
    )?.Farmer[0];
    if (!farmhandXml) return;
    return new Farmer(farmhandXml);
  }

  public getSpecialOrders() {
    const orders = entries(STARDEW_SPECIAL_ORDERS.town);

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
      gathered: farmer.receivedMailFlags.includes(mailId),
    }));
  }
}
