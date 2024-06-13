import { capitalCase, lowerCase } from "case-anything";

import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { Currency } from "@src/component/Currency";
import { STARDEW_FARM_TYPES } from "@src/const/StardewFarmTypes";
import { STARDEW_FISHES } from "@src/const/StardewFishes";
import { STARDEW_ARTIFACTS, STARDEW_MINERALS } from "@src/const/StardewMuseum";
import { STARDEW_RARECROW_IDS } from "@src/const/StardewRarecrows";
import { STARDEW_SPECIAL_ORDERS } from "@src/const/StardewSpecialOrders";
import { Achievements } from "@src/gamesave/Achievements";
import { GameDate, GameSeason } from "@src/util/GameDate";
import { XMLNode } from "@src/util/XMLNode";
import { isKeyOf, thru } from "@src/util/utilities";
import { ReactNode } from "react";
import { entries, firstBy, keys, mapToObj, times } from "remeda";
import { Farmer } from "./Farmer";
import { GrandpasEvaluations } from "@src/gamesave/GrandpasEvaluations";

export class GameSave {
  public readonly gameVersion;
  public readonly farmName;
  public readonly farmType;
  public readonly playtime;
  public readonly currentDate;

  public readonly mineShrineActive;
  public readonly skullShrineActive;

  public readonly separateWallets;
  public readonly totalGoldsEarned;

  public readonly player;
  public readonly farmhands;
  public readonly pets;
  public readonly stables;
  public readonly animalBuildings;
  public readonly fishPonds;
  // public readonly slimeHutches;

  public readonly rarecrowsPlaced;

  public readonly specialOrders;
  public readonly qiSpecialOrders;

  public readonly museumPieces;

  public readonly achievements;

  public readonly grandpasEvals;

  constructor(private saveXml: XMLNode) {
    console.log(saveXml.element);

    this.gameVersion = this.calcGameVersion();
    this.farmName = saveXml.query("player > farmName").text();
    this.farmType = this.calcFarmType();
    this.playtime = saveXml.query("player > millisecondsPlayed").number();
    this.currentDate = this.calcCurrentDate();

    this.mineShrineActive = saveXml
      .query(":scope > mineShrineActivated")
      .boolean();
    this.skullShrineActive = saveXml
      .query(":scope > skullShrineActivated")
      .boolean();

    this.separateWallets = saveXml
      .query("player > useSeparateWallets")
      .boolean();
    this.totalGoldsEarned = saveXml.query("player > totalMoneyEarned").number();

    this.player = new Farmer(saveXml.query("player"), saveXml);
    this.farmhands = this.calcFarmhands();
    this.pets = this.calcPets();
    this.stables = this.calcStables();
    this.animalBuildings = this.calcAnimalBuildings();
    this.fishPonds = this.calcFishPonds();

    this.rarecrowsPlaced = this.calcRarecrowsPlaced();

    this.specialOrders = this.calcSpecialOrders();
    this.qiSpecialOrders = this.calcQiSpecialOrders();

    this.museumPieces = this.calcMuseumPieces();

    this.achievements = mapToObj(this.getAllFarmers(), (farmer) => [
      farmer.name,
      new Achievements(farmer, this),
    ]);

    this.grandpasEvals = new GrandpasEvaluations(this, this.saveXml);
  }

  private calcGameVersion() {
    let gameVersion = this.saveXml.query(":scope > gameVersion").text();

    if (!gameVersion) {
      gameVersion = this.saveXml.query("player > gameVersion").text();
    }

    if (!gameVersion) {
      if (
        this.saveXml.query(":scope > hasApplied1_4_UpdateChanges").boolean()
      ) {
        gameVersion = "1.4";
      }
    }

    if (!gameVersion) {
      if (
        this.saveXml.query(":scope > hasApplied1_3_UpdateChanges").boolean()
      ) {
        gameVersion = "1.3";
      }
    }

    return gameVersion ?? "1.2";
  }

  private calcFarmType() {
    const whichFarm = this.saveXml.query("whichFarm").text();
    return isKeyOf(whichFarm, STARDEW_FARM_TYPES)
      ? STARDEW_FARM_TYPES[whichFarm]
      : STARDEW_FARM_TYPES[0];
  }

  private calcCurrentDate() {
    return new GameDate(
      this.saveXml.query(":scope > dayOfMonth").number(),
      capitalCase(
        this.saveXml.query(":scope > currentSeason").text()
      ) as GameSeason,
      this.saveXml.query(":scope > year").number()
    );
  }

  private calcPets() {
    return this.saveXml
      .queryAll(
        "locations > GameLocation > :is(characters,Characters) > :is(npc,NPC)"
      )
      .filter((npcNode) => {
        const type = npcNode.element?.getAttribute("xsi:type");
        // version < 1.6 - there used to be either Cat or Dog
        return type === "Pet" || type === "Cat" || type === "Dog";
      })
      .map((npcNode) => {
        return {
          name: npcNode.query("name").text(),
          type:
            npcNode.query("petType").text() ||
            npcNode.element?.getAttribute("xsi:type") ||
            "Dog",
          breed: npcNode.query("whichBreed").text() || "0",
          love: npcNode.query("friendshipTowardFarmer").number(),
        };
      });
  }

  private calcStables() {
    const farmLocationXml = this.saveXml.queryAllAndFind(
      "locations > GameLocation",
      (node) => node.element?.getAttribute("xsi:type") === "Farm"
    );

    const stableBuildingsXml = farmLocationXml
      .queryAll("Building")
      .filter(
        (buildingNode) =>
          buildingNode.element?.getAttribute("xsi:type") === "Stable"
      );

    return stableBuildingsXml.map((stableXml) => ({
      horseId: stableXml.query("HorseId").text(),
    }));
  }

  private calcAnimalBuildings() {
    const validAnimalBuildings = [
      "coop",
      "big coop",
      "deluxe coop",
      "barn",
      "big barn",
      "deluxe barn",
    ];

    const farmLocationXml = this.saveXml.queryAllAndFind(
      "locations > GameLocation",
      (node) => node.element?.getAttribute("xsi:type") === "Farm"
    );

    const animalBuildingsXml = farmLocationXml
      .queryAll("Building")
      .filter((buildingNode) => {
        const buildingType = buildingNode.query("buildingType").text();
        return validAnimalBuildings.includes(buildingType.toLowerCase());
      });

    return animalBuildingsXml.map((buildingNode) => ({
      type: buildingNode.query("buildingType").text(),
      capacity: buildingNode.query("maxOccupants").number(),
      animals: buildingNode
        .queryAll(
          "indoors > Animals > SerializableDictionaryOfInt64FarmAnimal FarmAnimal"
        )
        .map((animalNode) => ({
          type: animalNode.query("type").text(),
          name: animalNode.query(":is(name,displayName)").text(),
          love: animalNode.query("friendshipTowardFarmer").number(),
          goldenAnimalCracker: animalNode
            .query("hasEatenAnimalCracker")
            .boolean(),
        })),
    }));
  }

  private calcFishPonds() {
    const farmLocationXml = this.saveXml.queryAllAndFind(
      "locations > GameLocation",
      (node) => node.element?.getAttribute("xsi:type") === "Farm"
    );

    const fishPondsXml = farmLocationXml
      .queryAll("Building")
      .filter((buildingNode) => {
        const buildingType = buildingNode.query("buildingType").text();
        return buildingType.toLowerCase() === "fish pond";
      });

    fishPondsXml.forEach((xml) => console.log(xml.element));

    return fishPondsXml.map((buildingNode) => ({
      fish: STARDEW_FISHES[buildingNode.query("fishType").number()].name,
      count: buildingNode.query("currentOccupants").number(),
      capacity: buildingNode.query("maxOccupants").number(),
      goldenAnimalCracker: buildingNode
        .query("goldenAnimalCracker > *")
        .boolean(),
    }));
  }

  private calcFarmhands() {
    let farmhands = this.saveXml
      .query(":scope > farmhands")
      .transformIfPresent((farmhandsXml) =>
        farmhandsXml
          .queryAll(":scope > Farmer")
          .map((farmerXml) => new Farmer(farmerXml, this.saveXml))
      );

    // version < 1.6
    if (!farmhands) {
      const farmLocationXml = this.saveXml.queryAllAndFind(
        "locations > GameLocation",
        (node) => node.element?.getAttribute("xsi:type") === "Farm"
      );

      farmhands = farmLocationXml.transformIfPresent((farmLocationXml) =>
        farmLocationXml
          .queryAll("farmhand")
          .map((farmerXml) => new Farmer(farmerXml, this.saveXml))
      );
    }

    return farmhands ?? [];
  }

  private calcRarecrowsPlaced() {
    const placedRarecrows = mapToObj(STARDEW_RARECROW_IDS, (id) => [id, 0]);

    return this.saveXml
      .queryAll("locations > GameLocation > objects > item")
      .map((node) => node.query("value > Object"))
      .filter(
        (objectNode) =>
          objectNode.query("name").text() === "Rarecrow" &&
          objectNode.query("hasBeenInInventory").boolean()
      )
      .map((objectNode) => objectNode.query("itemId").text())
      .reduce((counts, rarecrowId) => {
        counts[rarecrowId]++;
        return counts;
      }, placedRarecrows);
  }

  private calcSpecialOrders() {
    const completedOrders = this.saveXml
      .queryAll("completedSpecialOrders > string")
      .map((node) => node.text());

    return entries(STARDEW_SPECIAL_ORDERS.town).map(([orderId, orderTitle]) => {
      return {
        title: orderTitle,
        npc: lowerCase(orderId.replace(/\d+/g, "")),
        completed: completedOrders.includes(orderId),
      };
    });
  }

  private calcQiSpecialOrders() {
    const completedOrders = this.saveXml
      .queryAll("completedSpecialOrders > string")
      .map((node) => node.text());

    return entries(STARDEW_SPECIAL_ORDERS.qi).map(([orderId, orderTitle]) => {
      return {
        title: orderTitle,
        completed: completedOrders.includes(orderId),
      };
    });
  }

  private calcMuseumPieces() {
    const museumLocationXml =
      this.saveXml
        .queryAll(
          // TODO: Y u no work?
          // "locations > GameLocation[xsi\\:type='LibraryMuseum']"
          "locations > GameLocation"
        )
        .find(
          (node) => node.element?.getAttribute("xsi:type") === "LibraryMuseum"
        ) ?? XMLNode.EMPTY;

    const handedInPieces = museumLocationXml
      .queryAll("value > *")
      .map((v) => v.text());

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

  public getAllFarmers() {
    return [this.player].concat(this.farmhands);
  }
}
