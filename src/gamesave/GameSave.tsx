import { capitalCase } from "case-anything";
import { entries, find, lowerCase } from "lodash";

import { STARDEW_FARM_TYPES } from "../const/StardewFarmTypes";
import { STARDEW_SPECIAL_ORDERS } from "../const/StardewSpecialOrders";
import { STARDROP_MAIL_FLAGS } from "../const/StardewStardrops";
import { GameDate, GameSeason } from "../util/GameDate";
import { StardewWiki } from "../util/StardewWiki";
import { Farmer } from "./Farmer";

type StringNumber = `${number}`;
type StringBoolean = `${boolean}`;

export namespace GameSave {
  export interface SaveXml {
    player: [FarmerXml];
    farmhands?: { Farmer: [FarmerXml] }[];
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
    whichFarm?: [keyof typeof STARDEW_FARM_TYPES];
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
    qiGems?: [StringNumber];
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
  public readonly gameVersion;
  public readonly farmName;
  public readonly farmType;
  public readonly playtime;
  public readonly currentDate;

  public readonly totalGoldsEarned;

  public readonly player;
  public readonly farmhands;

  public readonly specialOrders;

  constructor(private saveXml: GameSave.SaveXml) {
    this.gameVersion = this.calcGameVersion();
    this.farmName = this.saveXml.player[0].farmName[0];
    this.farmType = this.calcFarmType();
    this.playtime = parseInt(this.saveXml.player[0].millisecondsPlayed[0]);
    this.currentDate = new GameDate(
      parseInt(this.saveXml.dayOfMonth[0]),
      capitalCase(this.saveXml.currentSeason[0]) as GameSeason,
      parseInt(this.saveXml.year[0])
    );

    this.totalGoldsEarned = parseInt(
      this.saveXml.player[0].totalMoneyEarned[0]
    );

    this.player = new Farmer(this.saveXml.player[0]);
    this.farmhands = this.calcFarmhands();

    this.specialOrders = this.calcSpecialOrders();
  }

  private calcGameVersion() {
    return (
      this.saveXml.gameVersion?.[0] ??
      this.saveXml.player[0].gameVersion?.[0] ??
      (this.saveXml.hasApplied1_4_UpdateChanges?.[0] === "true"
        ? "1.4"
        : this.saveXml.hasApplied1_3_UpdateChanges?.[0] === "true"
        ? "1.3"
        : "1.2")
    );
  }

  private calcFarmType() {
    return this.saveXml.whichFarm?.[0] != null
      ? STARDEW_FARM_TYPES[this.saveXml.whichFarm[0]]
      : STARDEW_FARM_TYPES[0];
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

  private calcSpecialOrders() {
    const orders = entries(STARDEW_SPECIAL_ORDERS.town);

    return orders.map(([orderId, title]) => ({
      title,
      npc: lowerCase(orderId.replace(/\d+/g, "")),
      completed:
        this.saveXml.completedSpecialOrders?.[0] == null
          ? false
          : "string" in this.saveXml.completedSpecialOrders[0]
          ? this.saveXml.completedSpecialOrders[0].string.includes(orderId)
          : false,
      wiki: StardewWiki.getLink("Quests", title.replace(/\s+/g, "_")),
    }));
  }

  public getAllFarmers() {
    return [this.player].concat(this.farmhands);
  }

  public getFarmerByName(name: string) {
    return find(this.getAllFarmers(), { name });
  }
}
