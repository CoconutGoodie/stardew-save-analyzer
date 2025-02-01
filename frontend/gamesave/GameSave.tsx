import { capitalCase, lowerCase } from "case-anything";

import { STARDEW_FARM_TYPES } from "~frontend/const/StardewFarmTypes";
import { STARDEW_FISHES } from "~frontend/const/StardewFishes";
import {
  STARDEW_ARTIFACTS,
  STARDEW_MINERALS,
} from "~frontend/const/StardewMuseum";
import { STARDEW_RELATABLE_NPCS } from "~frontend/const/StardewNpcs";
import { STARDEW_RARECROW_IDS } from "~frontend/const/StardewRarecrows";
import { STARDEW_SPECIAL_ORDERS } from "~frontend/const/StardewSpecialOrders";
import { Achievements } from "~frontend/gamesave/Achievements";
import { GrandpasEvaluations } from "~frontend/gamesave/GrandpasEvaluations";
import { GameDate, GameSeason } from "~frontend/util/GameDate";
import { XMLNode } from "~frontend/util/XMLNode";
import { isKeyOf } from "~frontend/util/utilities";
import { clamp, entries, fromEntries, keys, mapToObj } from "remeda";
import { Farmer } from "./Farmer";
import { STARDEW_GOLDEN_WALNUTS_ALL } from "~frontend/const/StardewGoldenWalnuts";

export class GameSave {
  public static compatibleVersion = "1.6.8";

  public readonly gameVersion;
  public readonly farmName;
  public readonly farmType;
  public readonly playtime;
  public readonly currentDate;

  public readonly mineShrineActive;
  public readonly skullShrineActive;

  public readonly separateWallets;

  public readonly goldClock;

  public readonly player;
  public readonly farmhands;
  public readonly pets;
  public readonly stables;
  public readonly animalBuildings;
  public readonly fishPonds;
  // TODO: public readonly slimeHutches;

  public readonly rarecrowsPlaced;
  public readonly allRarecrows;

  public readonly specialOrders;
  public readonly qiSpecialOrders;

  public readonly goldenWalnuts;

  public readonly museumPieces;

  public readonly achievements;

  public readonly grandpasEvals;

  constructor(public saveXml: XMLNode) {
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

    this.goldClock = this.calcGoldClock();

    this.player = new Farmer(saveXml.query("player"), this);
    this.farmhands = this.calcFarmhands();
    this.pets = this.calcPets();
    this.stables = this.calcStables();
    this.animalBuildings = this.calcAnimalBuildings();
    this.fishPonds = this.calcFishPonds();

    this.rarecrowsPlaced = this.calcRarecrowsPlaced();
    this.allRarecrows = this.calcAllRarecrows();

    this.specialOrders = this.calcSpecialOrders();
    this.qiSpecialOrders = this.calcQiSpecialOrders();

    this.goldenWalnuts = this.calcGoldenWalnuts();

    this.museumPieces = this.calcMuseumPieces();

    this.achievements = mapToObj(this.getAllFarmers(), (farmer) => [
      farmer.name,
      new Achievements(farmer, this),
    ]);

    this.grandpasEvals = new GrandpasEvaluations(this, this.saveXml);
  }

  public queryNpcsXml() {
    const locationsXml = this.saveXml?.queryAll("locations > GameLocation");

    return (
      locationsXml
        .flatMap((locationXml) => locationXml.queryAll("characters > NPC"))
        .filter((npcXml) => {
          return (
            // Either a child
            npcXml.element?.getAttribute("xsi:type") === "Child" ||
            // Or a known NPC
            STARDEW_RELATABLE_NPCS[npcXml.query("name").text()]
          );
        }) ?? []
    );
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

    return fishPondsXml.map((buildingNode) => ({
      fish: STARDEW_FISHES[buildingNode.query("fishType").number()]?.name,
      count: buildingNode.query("currentOccupants").number(),
      capacity: buildingNode.query("maxOccupants").number(),
      goldenAnimalCracker: buildingNode
        .query("goldenAnimalCracker > *")
        .boolean(),
    }));
  }

  private calcGoldClock() {
    const farmLocationXml = this.saveXml.queryAllAndFind(
      "locations > GameLocation",
      (node) => node.element?.getAttribute("xsi:type") === "Farm"
    );

    const goldClockXml = farmLocationXml
      .queryAll("Building")
      .find(
        (buildingXml) =>
          buildingXml.query("buildingType").text().toLowerCase() ===
          "gold clock"
      );

    return {
      isBuilt: goldClockXml != null,
      active: goldClockXml?.query("magical").boolean(),
    };
  }

  private calcFarmhands() {
    let farmhandXmls = this.saveXml
      .query(":scope > farmhands")
      .transformIfPresent((farmhandsXml) =>
        farmhandsXml.queryAll(":scope > Farmer")
      );

    // version < 1.6
    if (!farmhandXmls) {
      const farmLocationXml = this.saveXml.queryAllAndFind(
        "locations > GameLocation",
        (node) => node.element?.getAttribute("xsi:type") === "Farm"
      );

      farmhandXmls = farmLocationXml.transformIfPresent((farmLocationXml) =>
        farmLocationXml.queryAll("farmhand")
      );
    }

    const farmhands = farmhandXmls
      ?.filter(
        (farmhandXml) =>
          farmhandXml.query(":scope > userID").text() !== "" &&
          farmhandXml.query(":scope > name").text() !== ""
      )
      .map((farmhandXml) => new Farmer(farmhandXml, this));

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

  private calcAllRarecrows() {
    const placedRarecrows = mapToObj(STARDEW_RARECROW_IDS, (id) => [id, 0]);

    const storedRarecrows = this.saveXml
      .queryAll("item > value > Object")
      .filter((buildingNode) => {
        return buildingNode.element?.getAttribute("xsi:type") === "Chest";
      })
      .flatMap((chestNode) => {
        const items = chestNode.queryAll("items");
        if (items.length === 0) {
          return [];
        } else {
          return chestNode
            .queryAll("items > Item")
            .filter(
              (objectNode) => objectNode.query("name").text() === "Rarecrow"
            );
        }
      })
      .map((objectNode) => objectNode.query("itemId").text())
      .reduce((counts, rarecrowId) => {
        counts[rarecrowId]++;
        return counts;
      }, placedRarecrows);

    return Object.entries(storedRarecrows).reduce((counts, [rarecrowId]) => {
      counts[rarecrowId] += this.rarecrowsPlaced[rarecrowId];
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

  private calcGoldenWalnuts() {
    const collection: Record<string, number> = {};

    const parrotUsed = this.saveXml.query("activatedGoldenParrot").boolean();

    const gameTotal = this.saveXml.query("goldenWalnutsFound").number();
    let calculatedTotal = 0;

    if (this.saveXml.query("goldenCoconutCracked").boolean()) {
      collection["GoldenCoconut"] = 1;
      calculatedTotal++;
    }

    this.saveXml
      .queryAll("collectedNutTracker > string")
      .map((xml) => xml.text())
      .forEach((collected) => {
        collection[collected] = STARDEW_GOLDEN_WALNUTS_ALL[collected].quantity;
        calculatedTotal += STARDEW_GOLDEN_WALNUTS_ALL[collected].quantity;
      });

    this.saveXml.queryAll("limitedNutDrops > item").forEach((itemXml) => {
      const key = itemXml.query("key > *").text();
      const value = itemXml.query("value > *").number();

      const collectedValue = clamp(value, {
        min: 0,
        max: STARDEW_GOLDEN_WALNUTS_ALL[key].quantity,
      });

      collection[key] = collectedValue;
      calculatedTotal += collectedValue;
    });

    return {
      gameTotal,
      calculatedTotal,
      collection,
      parrotUsed,
    };
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
