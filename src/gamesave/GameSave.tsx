import { capitalCase, lowerCase } from "case-anything";

import { Achievement } from "@src/component/Achievement";
import { Currency } from "@src/component/Currency";
import { Achievements } from "@src/gamesave/Achievements";
import { ReactNode } from "react";
import {
  entries,
  find,
  first,
  firstBy,
  keys,
  map,
  mapToObj,
  pipe,
} from "remeda";
import { STARDEW_FARM_TYPES } from "../const/StardewFarmTypes";
import { STARDEW_SPECIAL_ORDERS } from "../const/StardewSpecialOrders";
import { GameDate, GameSeason } from "../util/GameDate";
import { StardewWiki } from "../util/StardewWiki";
import { Farmer } from "./Farmer";
import { thru } from "@src/util/utilities";
import { STARDEW_ARTIFACTS, STARDEW_MINERALS } from "@src/const/StardewMuseum";

type StringNumber = `${number}`;
type StringBoolean = `${boolean}`;

export namespace GameSave {
  export type KeyValueMap<K, V> = { key: K; value: V }[];

  export interface SaveXml {
    player: [FarmerXml];
    farmhands?: { Farmer: [FarmerXml] }[];
    locations?: [
      {
        GameLocation: {
          $: { "xsi:type": string };
          grandpaScore?: [StringNumber];
          museumPieces?: [
            {
              item: KeyValueMap<
                [{ Vector2: [{ X: [StringNumber]; Y: [StringNumber] }] }],
                [{ string: [StringNumber] } | { int: [StringNumber] }]
              >;
            }
          ];
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

  public readonly museumPieces;

  public readonly achievements;

  public readonly grandpaShrineCandlesLit;
  public readonly grandpaScoreSubjects;

  constructor(private saveXml: GameSave.SaveXml) {
    console.log(saveXml);

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

    this.museumPieces = this.calcMuseumPieces();

    this.achievements = mapToObj(this.getAllFarmers(), (farmer) => [
      farmer.name,
      new Achievements(farmer, this),
    ]);

    this.grandpaShrineCandlesLit = this.calcGrandpaShrineCandlesLit();
    this.grandpaScoreSubjects = this.calcGrandpaScoreSubjects();
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

  private calcMuseumPieces() {
    const museumLocation = this.saveXml.locations?.[0].GameLocation.find(
      (x) => x.museumPieces != null
    );

    const handedInPieces: string[] =
      museumLocation?.museumPieces?.[0]?.item
        ?.map((item) => item?.value?.[0])
        ?.map((value) =>
          "string" in value ? value.string[0] : value.int[0]
        ) ?? [];

    return {
      minerals: new Set(
        keys(STARDEW_MINERALS).filter((mineralId) =>
          handedInPieces.includes(mineralId)
        )
      ),
      artifacts: new Set(
        keys(STARDEW_ARTIFACTS).filter((artifactId) =>
          handedInPieces.includes(artifactId)
        )
      ),
    };
  }

  private calcGrandpaShrineCandlesLit() {
    const farmLocation = find(
      this.saveXml.locations?.[0].GameLocation ?? [],
      (location) => location.$["xsi:type"] === "Farm"
    );
    return parseInt(farmLocation?.grandpaScore?.[0] ?? "0");
  }

  // TODO: Extract into its own class
  private calcGrandpaScoreSubjects() {
    interface ScoreSubject {
      earned: boolean;
      score: number;
      reason: ReactNode;
    }

    const scoreSubjects: ScoreSubject[] = [];

    // Earnings
    scoreSubjects.push(
      ...[
        [1, 50_000],
        [1, 100_000],
        [1, 200_000],
        [1, 300_000],
        [1, 500_000],
        [2, 1_000_000],
      ].map<ScoreSubject>(([score, earningGoal]) => ({
        earned: this.totalGoldsEarned >= earningGoal,
        reason: (
          <>
            earning at least <Currency amount={earningGoal} unit="gold" />
          </>
        ),
        score,
      }))
    );

    // Skill Levels
    const mostSkillfulFarmer =
      firstBy(this.getAllFarmers(), [
        (farmer) => farmer.skillLevelTotal,
        "desc",
      ]) ?? this.player;

    scoreSubjects.push(
      ...[
        [1, 30],
        [1, 50],
      ].map<ScoreSubject>(([score, skillLevels]) => {
        const earned = mostSkillfulFarmer.skillLevelTotal >= skillLevels;
        return {
          earned,
          reason: (
            <>
              reaching <strong>{skillLevels}</strong> skill levels.{" "}
              {earned && <>({mostSkillfulFarmer.name})</>}
            </>
          ),
          score,
        };
      })
    );

    // Achievements
    const achievements = [
      "masterAngler",
      "aCompleteCollection",
    ] as (keyof Achievements)[];

    achievements.forEach((achievement) =>
      scoreSubjects.push(
        thru(
          this.getAllFarmers().find(
            (farmer) => this.achievements[farmer.name][achievement].achieved
          ) ?? this.player,
          (achiever) => ({
            earned: this.achievements[achiever.name][achievement].achieved,
            score: 1,
            reason: (
              <>
                achieving{" "}
                <Achievement
                  title={this.achievements[achiever.name][achievement].title}
                  achieved={this.achievements[achiever.name][achievement].achieved}
                  inline
                />
              </>
            ),
          })
        )
      )
    );

    scoreSubjects.push(
      ...["Full Shipment"].map((achi) => ({
        earned: false,
        reason: (
          <>
            achieving <Achievement title={achi} achieved={false} inline /> [WIP]
          </>
        ),
        score: Infinity,
      }))
    );

    return scoreSubjects;
  }

  public getAllFarmers() {
    return [this.player].concat(this.farmhands);
  }
}
