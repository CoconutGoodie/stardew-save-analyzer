import { Achievement } from "../component/Achievement";
import { Currency } from "../component/Currency";
import { SummarySection } from "../component/SummarySection";
import { GameSave } from "../util/GameSave";
import styles from "./MoneySection.module.scss";

interface Props {
  gameSave: GameSave;
}

export const MoneySection = (props: Props) => {
  const farmSummary = props.gameSave.getFarmSummary();
  const moneySummary = props.gameSave.getMoneySummary();

  const totalDigits = moneySummary.earnedTotal
    .toString()
    .padStart(8, " ")
    .split("");

  return (
    <SummarySection id="money" className={styles.section}>
      <h1>Money </h1>

      <div>
        In total, {farmSummary.farmName} Farm has earned{" "}
        <Currency amount={moneySummary.earnedTotal} />
      </div>

      <div className={styles.money}>
        {totalDigits.map((digit, index) => (
          <span key={index} className={styles.digit}>
            {digit}
          </span>
        ))}
        <span className={styles.currency}>G</span>
      </div>

      <div>
        {moneySummary.achievements.map((achievement) => {
          const achieved = achievement.goal <= moneySummary.earnedTotal;

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
                    amount={achievement.goal - moneySummary.earnedTotal}
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
