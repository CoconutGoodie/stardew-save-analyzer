import { Achievement } from "../component/Achievement";
import { Currency } from "../component/Currency";
import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../gamesave/GameSave";
import styles from "./MoneySection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const MoneySection = (props: Props) => {
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

      <div>
        {[
          { title: "Greenhorn", goal: 15_000 },
          { title: "Cowpoke ", goal: 50_000 },
          { title: "Homesteader", goal: 250_000 },
          { title: "Millionaire", goal: 1_000_000 },
          { title: "Legend", goal: 10_000_000 },
        ].map((achievement) => {
          const achieved = achievement.goal <= props.gameSave.totalGoldsEarned;

          return (
            <Achievement
              key={achievement.title}
              title={achievement.title}
              achieved={achieved}
              description={
                <>
                  earn <Currency amount={achievement.goal} />
                </>
              }
            >
              {!achieved && (
                <span>
                  —{" "}
                  <Currency
                    amount={achievement.goal - props.gameSave.totalGoldsEarned}
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
