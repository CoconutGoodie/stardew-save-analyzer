import mermaidPendantPng from "@src/assets/icon/mermaid-pendant.png";
import rustyKeyPng from "@src/assets/icon/rusty-key.png";
import skullKeyPng from "@src/assets/icon/skull-key.png";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { Currency } from "@src/component/Currency";
import { Achievements } from "@src/gamesave/Achievements";
import { Farmer } from "@src/gamesave/Farmer";
import { GameSave } from "@src/gamesave/GameSave";
import { XMLNode } from "@src/util/XMLNode";
import { ReactNode } from "react";
import { entries, firstBy, keys, times } from "remeda";

interface ScoreSubject {
  earned: boolean;
  score: number;
  reason: ReactNode;
}

export class GrandpasEvaluations {
  public readonly candlesLit;
  public readonly scoreSubjects: ScoreSubject[] = [];

  constructor(private gameSave: GameSave, private saveXml: XMLNode) {
    this.candlesLit = this.calcCandlesLit();

    this.calcEarningScores();
    this.calcSkillScores();
    this.calcAchievementScores();
    this.calcFriendshipScores();

    [
      "completing The Community Center",
      "attending The Community Center Completion Ceremony",
    ].forEach((reason) => {
      this.scoreSubjects.push({
        earned: false,
        score: NaN,
        reason: reason + " [WIP]",
      });
    });

    this.calcSpecialItemScores();
  }

  private calcCandlesLit() {
    const farmLocationXml = this.saveXml.queryAllAndFind(
      "locations > GameLocation",
      (node) => node.element?.getAttribute("xsi:type") === "Farm"
    );

    return farmLocationXml.query("grandpaScore").number();
  }

  private calcEarningScores() {
    const earningGoals = [
      [1, 50_000],
      [1, 100_000],
      [1, 200_000],
      [1, 300_000],
      [1, 500_000],
      [2, 1_000_000],
    ];

    earningGoals.forEach(([score, earningGoal]) => {
      this.scoreSubjects.push({
        earned: this.gameSave.totalGoldsEarned >= earningGoal,
        score,
        reason: (
          <>
            earning at least <Currency amount={earningGoal} unit="gold" />
          </>
        ),
      });
    });
  }

  private calcSkillScores() {
    const skillLevelGoals = [
      [1, 30],
      [1, 50],
    ];

    const mostSkillfulFarmer =
      firstBy(this.gameSave.getAllFarmers(), [
        (farmer) => farmer.skillLevelTotal,
        "desc",
      ]) ?? this.gameSave.player;

    skillLevelGoals.forEach(([score, skillLevelGoal]) => {
      const earned = mostSkillfulFarmer.skillLevelTotal >= skillLevelGoal;
      this.scoreSubjects.push({
        earned,
        score,
        reason: (
          <>
            reaching <strong>{skillLevelGoal}</strong> skill levels{" "}
            {earned && <>({mostSkillfulFarmer.name})</>}
          </>
        ),
      });
    });
  }

  private calcAchievementScores() {
    const achievementGoals = [
      "masterAngler",
      "aCompleteCollection",
    ] as (keyof Achievements)[];

    achievementGoals.forEach((achievementGoal) => {
      const achiever =
        this.gameSave
          .getAllFarmers()
          .find(
            (farmer) =>
              this.gameSave.achievements[farmer.name][achievementGoal].achieved
          ) ?? this.gameSave.player;

      const achievement =
        this.gameSave.achievements[achiever.name][achievementGoal];

      this.scoreSubjects.push({
        earned: achievement.achieved,
        score: 1,
        reason: (
          <>
            achieving{" "}
            <AchievementDisplay
              title={achievement.title}
              achieved={achievement.achieved}
              inline
            />
          </>
        ),
      });
    });

    // TODO: Yeet
    this.scoreSubjects.push(
      ...["Full Shipment"].map((achi) => ({
        earned: false,
        reason: (
          <>
            achieving{" "}
            <AchievementDisplay title={achi} achieved={false} inline /> [WIP]
          </>
        ),
        score: NaN,
      }))
    );
  }

  private calcFriendshipScores() {
    {
      const marriedEntry = firstBy(
        this.gameSave
          .getAllFarmers()
          .map((farmer) => ({
            farmer,
            spouse: farmer.relationships.find(
              (r) => r.status === "Married" || r.status === "Roommate"
            )?.name,
            houseUpgradeLevel: farmer.houseUpgradeLevel,
          }))
          .filter(({ spouse }) => !!spouse),
        [({ houseUpgradeLevel }) => houseUpgradeLevel, "desc"]
      );

      const earned =
        marriedEntry != null &&
        marriedEntry.spouse != null &&
        marriedEntry.houseUpgradeLevel >= 2;

      this.scoreSubjects.push({
        earned,
        score: 1,
        reason: (
          <>
            getting{" "}
            <strong>
              <img
                width={15}
                height={15}
                src={mermaidPendantPng}
                style={{ verticalAlign: "middle" }}
              />{" "}
              married
            </strong>{" "}
            with at least <strong>two house upgrades</strong>{" "}
            {earned && <>({marriedEntry.farmer.name})</>}
          </>
        ),
      });
    }

    const most8HeartsFarmer =
      firstBy(this.gameSave.getAllFarmers(), [
        (farmer) =>
          farmer.relationships
            .filter((r) => !r.isChild)
            .filter((r) => r.points >= 8 * 250).length,
        "desc",
      ]) ?? null;

    [5, 10].forEach((goal) => {
      const earned =
        most8HeartsFarmer != null &&
        most8HeartsFarmer.relationships
          .filter((r) => !r.isChild)
          .filter((r) => r.points >= 8 * 250).length >= goal;

      this.scoreSubjects.push({
        earned,
        score: 1,
        reason: (
          <>
            having <Currency amount={5} unit="heart" /> with {goal} people{" "}
            {earned && <>({most8HeartsFarmer.name})</>}
          </>
        ),
      });
    });

    this.scoreSubjects.push({
      earned: this.gameSave.pets.some((pet) => pet.love >= 999),
      score: 1,
      reason: (
        <>
          having <Currency amount={5} unit="heart" /> with your pet
        </>
      ),
    });
  }

  private calcSpecialItemScores() {
    const farmers = this.gameSave.getAllFarmers();

    const specialItems = {
      "Rusty Key": rustyKeyPng,
      "Skull Key": skullKeyPng,
    } satisfies Record<keyof Farmer["specialItems"], string>;

    entries.strict(specialItems).forEach(([itemName, icon]) => {
      const farmer = farmers.find((farmer) => farmer.specialItems[itemName]);

      this.scoreSubjects.push({
        earned: farmer != null,
        score: 1,
        reason: (
          <>
            obtaining the{" "}
            <img height={15} style={{ verticalAlign: "middle" }} src={icon} />{" "}
            <strong>{itemName}</strong> {farmer != null && <>({farmer.name})</>}
          </>
        ),
      });
    });
  }
}
