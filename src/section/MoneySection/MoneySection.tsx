import { useGoals } from "@src/hook/useGoals";
import { AchievementDisplay } from "@src/component/AchievementDisplay";
import { Currency } from "@src/component/Currency";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import goldPng from "@src/assets/icon/gold.png";

import styles from "./MoneySection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const MoneySection = (props: Props) => {
  const playerAchievements =
    props.gameSave.achievements[props.gameSave.player.name];

  const totalDigits = props.gameSave.totalGoldsEarned
    .toString()
    .padStart(9, " ")
    .split("");

  const { goals, allDone } = useGoals({
    global: {
      achievements: [
        playerAchievements.greenhorn,
        playerAchievements.cowpoke,
        playerAchievements.homesteader,
        playerAchievements.millionaire,
        playerAchievements.legend,
      ],
    },
  });

  return (
    <SummarySection
      id="money"
      sectionTitle="Money"
      sectionIcon={goldPng}
      className={styles.section}
      collapsable
      allDone={allDone}
    >
      <div>
        In total, <strong>{props.gameSave.farmName} Farm</strong> has earned{" "}
        <Currency amount={props.gameSave.totalGoldsEarned} />
      </div>

      <div className={styles.money}>
        <span className={styles.currency}>G</span>
        {totalDigits.map((digit, index) => (
          <span key={index} className={styles.digit}>
            {digit}
          </span>
        ))}
      </div>

      <div className={styles.achievements}>
        {goals.global.achievements.map((achievement) => {
          return (
            <AchievementDisplay
              key={achievement.title}
              title={achievement.title}
              achieved={achievement.achieved}
              description={
                <>
                  earn <Currency amount={achievement.goal} />
                </>
              }
            >
              {!achievement.achieved && (
                <span>
                  —{" "}
                  <Currency
                    amount={achievement.goal - props.gameSave.totalGoldsEarned}
                    unit="gold"
                  />{" "}
                  more to go
                </span>
              )}
            </AchievementDisplay>
          );
        })}
      </div>
    </SummarySection>
  );
};
