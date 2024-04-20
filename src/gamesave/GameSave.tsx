import { capitalCase } from "case-anything";
import { entries, find, groupBy, intersection, keys, lowerCase } from "lodash";
import { STARDEW_FISHES } from "../const/StardewFishes";

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
    // locations[0].GameLocation[1].buildings[0].Building[0].indoors[0].farmhand
    locations?: [
      {
        GameLocation: {
          $: { "xsi:type": string };
          buildings: [
            {
              Building: {
                indoors?: [{ farmhand?: [FarmerXml] }];
              }[];
            }
          ];
        }[];
      }
    ];
    whichFarm?: [keyof typeof GameSave.FARM_TYPES];
    year: [StringNumber];
    currentSeason: [string];
    dayOfMonth: [StringNumber];
    weatherForTomorrow: [string];
    completedSpecialOrders?: [{ string: string[] }];
    hasApplied1_3_UpdateChanges?: [StringBoolean];
    hasApplied1_4_UpdateChanges?: [StringBoolean];
    gameVersion?: [string];
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
      farmType:
        this.saveXml.whichFarm?.[0] != null
          ? GameSave.FARM_TYPES[this.saveXml.whichFarm[0]]
          : GameSave.FARM_TYPES[0],
      player: new Farmer(this.saveXml.player[0]),
      farmhands: this.calcFarmhands(),
      gameVersion:
        this.saveXml.player[0].gameVersion?.[0] ??
        this.saveXml.hasApplied1_4_UpdateChanges?.[0] === "true"
          ? "1.4"
          : this.saveXml.hasApplied1_3_UpdateChanges?.[0] === "true"
          ? "1.3"
          : "1.2",
      playtime: parseInt(this.saveXml.player[0].millisecondsPlayed[0]),
      currentDate: new GameDate(
        parseInt(this.saveXml.dayOfMonth[0]),
        capitalCase(this.saveXml.currentSeason[0]) as GameSeason,
        parseInt(this.saveXml.year[0])
      ),
    };
    // locations[0].GameLocation[1].buildings[0].Building[0].indoors[0].farmhand
  }

  private calcFarmhands() {
    let farmhands = this.saveXml.farmhands?.map(
      (farmhand) => new Farmer(farmhand.Farmer[0])
    );

    // This is how it was stored before 1.6
    if (!farmhands) {
      const farmLocation = this.saveXml.locations?.[0].GameLocation.find(
        (x) => x.$["xsi:type"] === "Farm"
      );

      farmhands = farmLocation?.buildings[0]?.Building?.map(
        (buildingEntry) => buildingEntry?.indoors?.[0]?.farmhand?.[0]
      )
        .filter((farmhandXml) => !!farmhandXml)
        .map((farmhandXml) => new Farmer(farmhandXml!));
    }

    return farmhands ?? [];
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
        this.saveXml.completedSpecialOrders == null
          ? false
          : "string" in this.saveXml.completedSpecialOrders
          ? this.saveXml.completedSpecialOrders[0].string.includes(orderId)
          : false,
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
