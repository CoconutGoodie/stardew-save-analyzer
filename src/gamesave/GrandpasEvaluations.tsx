import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { Currency } from "@src/component/Currency";
import { Achievements } from "@src/gamesave/Achievements";
import { GameSave } from "@src/gamesave/GameSave";
import { XMLNode } from "@src/util/XMLNode";
import { ReactNode } from "react";
import { firstBy, times } from "remeda";

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

    times(4, (i) =>
      this.scoreSubjects.push({
        earned: false,
        reason: `Other #${i + 1} [WIP]`,
        score: NaN,
      })
    );
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
            reaching <strong>{skillLevelGoal}</strong> skill levels.{" "}
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
    this.scoreSubjects.push({
      earned: false,
      reason: `Friendship #1 [WIP]`,
      score: NaN,
    });

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
}
