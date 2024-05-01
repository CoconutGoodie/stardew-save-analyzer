import { Achievement } from "../component/Achievement";
import { Currency } from "../component/Currency";
import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
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

  return (
    <SummarySection
      id="money"
      sectionTitle="Money"
      className={styles.section}
      collapsable
    >
      <div>
        In total, {props.gameSave.farmName} Farm has earned{" "}
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
        {[
          playerAchievements.greenhorn,
          playerAchievements.cowpoke,
          playerAchievements.homesteader,
          playerAchievements.millionaire,
          playerAchievements.legend,
        ].map((achievement) => {
          return (
            <Achievement
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
                    amount={
                      achievement.goal - props.gameSave.totalGoldsEarned
                    }
                    unit="gold"
                  />{" "}
                  more to go
                </span>
              )}
            </Achievement>
          );
        })}
      </div>
    </SummarySection>
  );
};
